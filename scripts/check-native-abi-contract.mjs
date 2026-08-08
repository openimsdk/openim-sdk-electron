import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);
const headerPath = path.resolve(
  process.env.OPENIM_NATIVE_HEADER ??
    path.join(packageRoot, '../openim-sdk-cpp/scripts/openimsdk.h')
);
const interfacePath = path.join(packageRoot, 'src/types/nativeSdk.ts');
const corePath = path.join(packageRoot, 'src/core');

const intentionallyUnmappedHeaderSymbols = new Map([
  ['set_print', 'native-only debug hook'],
  ['im_login', 'low-level split login is not a public client API'],
  ['im_logout', 'low-level split logout is not a public client API'],
  [
    'get_login_user',
    'intentionally not exported by the current TypeScript SDK',
  ],
  [
    'get_conversation_id_by_session_type',
    'intentionally not exported by the current TypeScript SDK',
  ],
  ['typing_status_update', 'deprecated public API'],
  ['set_app_Badge', 'mobile-only badge hook'],
]);

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async entry => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) return sourceFiles(absolutePath);
      return entry.name.endsWith('.ts') ? [absolutePath] : [];
    })
  );
  return nested.flat().sort();
}

function normalizeCType(type) {
  const normalized = type.replace(/\s+/g, ' ').trim();
  const aliases = {
    'char *': 'str',
    'char*': 'str',
    'long long int': 'long long',
    CB_S_I_S_S: 'NativeBaseCallback',
    CB_I_S: 'NativeEventListenerCallback',
    CB_S_I_S_S_I: 'NativeSendMessageCallback',
    GoInt: 'long long',
    GoUint8: 'uint8',
  };
  return aliases[normalized] ?? normalized;
}

function normalizeKoffiType(type) {
  const normalized = type.replace(/\s+/g, ' ').trim();
  const aliases = {
    'baseCallback *': 'NativeBaseCallback',
    'listenerCallback *': 'NativeEventListenerCallback',
    'sendMessageCallback *': 'NativeSendMessageCallback',
    int64: 'long long',
  };
  return aliases[normalized] ?? normalized;
}

function normalizeTypeScriptType(type) {
  const normalized = type.replace(/\s+/g, ' ').trim();
  const aliases = {
    string: 'str',
    CB_S_I_S_S: 'NativeBaseCallback',
    CB_I_S: 'NativeEventListenerCallback',
    CB_S_I_S_S_I: 'NativeSendMessageCallback',
  };
  return aliases[normalized] ?? normalized;
}

function cTypeForTypeScript(type) {
  return ['int', 'long long', 'double', 'uint8'].includes(type)
    ? 'number'
    : type;
}

function parseHeader(source) {
  const publicBlockStart = source.indexOf('extern "C" {');
  assert.notEqual(publicBlockStart, -1, 'C ABI header has no extern "C" block');
  source = source.slice(publicBlockStart);
  const functions = new Map();
  const declaration = /^extern\s+(.+?)\s+([A-Za-z_]\w*)\s*\(([^;]*)\);$/gm;

  for (const match of source.matchAll(declaration)) {
    const [, returnType, name, rawParameters] = match;
    const parameters =
      rawParameters.trim() === 'void' || !rawParameters.trim()
        ? []
        : rawParameters.split(',').map(parameter => {
            const trimmed = parameter.trim();
            const separator = trimmed.lastIndexOf(' ');
            assert.notEqual(
              separator,
              -1,
              `Cannot parse C parameter: ${trimmed}`
            );
            return normalizeCType(trimmed.slice(0, separator));
          });
    assert(!functions.has(name), `Duplicate C ABI symbol: ${name}`);
    functions.set(name, {
      name,
      returnType: normalizeCType(returnType),
      parameters,
    });
  }

  assert(functions.size > 0, `No C ABI symbols parsed from ${headerPath}`);
  return functions;
}

function createSourceFile(filePath, source) {
  return ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS
  );
}

function parseNativeInterface(source, filePath) {
  const sourceFile = createSourceFile(filePath, source);
  const functions = new Map();

  sourceFile.forEachChild(node => {
    if (
      !ts.isInterfaceDeclaration(node) ||
      node.name.text !== 'NativeOpenIMSdk'
    ) {
      return;
    }
    for (const member of node.members) {
      if (!ts.isMethodSignature(member) || !member.name || !member.type)
        continue;
      const name = member.name.getText(sourceFile);
      assert(!functions.has(name), `Duplicate NativeOpenIMSdk method: ${name}`);
      functions.set(name, {
        name,
        returnType: normalizeTypeScriptType(member.type.getText(sourceFile)),
        parameters: member.parameters.map(parameter =>
          normalizeTypeScriptType(
            parameter.type?.getText(sourceFile) ?? 'unknown'
          )
        ),
      });
    }
  });

  assert(functions.size > 0, 'NativeOpenIMSdk interface was not found');
  return functions;
}

function nativeMemberName(expression) {
  if (!ts.isPropertyAccessExpression(expression)) return undefined;
  const owner = expression.expression;
  if (
    !ts.isPropertyAccessExpression(owner) ||
    owner.name.text !== 'nativeSdk'
  ) {
    return undefined;
  }
  return expression.name.text;
}

function literalText(expression, description) {
  assert(
    ts.isStringLiteral(expression) ||
      ts.isNoSubstitutionTemplateLiteral(expression),
    `${description} must be a string literal`
  );
  return expression.text;
}

function parseCoreSources(sources) {
  const registrations = new Map();
  const calls = new Map();

  for (const { filePath, source } of sources) {
    const sourceFile = createSourceFile(filePath, source);
    const visit = node => {
      if (
        ts.isBinaryExpression(node) &&
        node.operatorToken.kind === ts.SyntaxKind.EqualsToken
      ) {
        const propertyName = nativeMemberName(node.left);
        const registration = node.right;
        if (
          propertyName &&
          ts.isCallExpression(registration) &&
          ts.isPropertyAccessExpression(registration.expression) &&
          registration.expression.name.text === 'func'
        ) {
          const [, nativeNameNode, returnTypeNode, parametersNode] =
            registration.arguments;
          assert(
            nativeNameNode && returnTypeNode && parametersNode,
            `${propertyName} has an incomplete Koffi registration`
          );
          assert(
            ts.isArrayLiteralExpression(parametersNode),
            `${propertyName} Koffi parameters must be an array literal`
          );
          assert(
            !registrations.has(propertyName),
            `Duplicate registration: ${propertyName}`
          );
          registrations.set(propertyName, {
            name: propertyName,
            nativeName: literalText(
              nativeNameNode,
              `${propertyName} native symbol`
            ),
            returnType: normalizeKoffiType(
              literalText(returnTypeNode, `${propertyName} return type`)
            ),
            parameters: parametersNode.elements.map((element, index) =>
              normalizeKoffiType(
                literalText(element, `${propertyName} parameter ${index}`)
              )
            ),
          });
        }
      }

      if (ts.isCallExpression(node)) {
        const propertyName = nativeMemberName(node.expression);
        if (propertyName) {
          const entries = calls.get(propertyName) ?? [];
          entries.push(node.arguments.length);
          calls.set(propertyName, entries);
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sourceFile);
  }

  return { registrations, calls };
}

function compareContracts(header, nativeInterface, registrations, calls) {
  const errors = [];
  const headerNames = new Set(header.keys());
  const interfaceNames = new Set(nativeInterface.keys());
  const registrationNames = new Set(registrations.keys());

  for (const [name, reason] of intentionallyUnmappedHeaderSymbols) {
    if (!headerNames.has(name))
      errors.push(`Stale C ABI exclusion: ${name} (${reason})`);
    if (
      interfaceNames.has(name) ||
      registrationNames.has(name) ||
      calls.has(name)
    ) {
      errors.push(
        `Excluded C ABI symbol is partially mapped: ${name} (${reason})`
      );
    }
  }

  for (const name of interfaceNames) {
    if (!headerNames.has(name))
      errors.push(`Interface exposes unknown C symbol: ${name}`);
    if (!registrationNames.has(name))
      errors.push(`Interface method is not registered: ${name}`);
  }
  for (const name of registrationNames) {
    if (!interfaceNames.has(name))
      errors.push(`Registration missing from interface: ${name}`);
    if (!headerNames.has(name))
      errors.push(`Registration targets unknown C symbol: ${name}`);
  }
  for (const name of headerNames) {
    if (
      !interfaceNames.has(name) &&
      !intentionallyUnmappedHeaderSymbols.has(name)
    ) {
      errors.push(`C ABI symbol is neither mapped nor excluded: ${name}`);
    }
  }

  for (const [name, registration] of registrations) {
    const cSignature = header.get(name);
    const tsSignature = nativeInterface.get(name);
    if (!cSignature || !tsSignature) continue;
    if (registration.nativeName !== name) {
      errors.push(`${name} registers native symbol ${registration.nativeName}`);
    }
    if (registration.returnType !== cSignature.returnType) {
      errors.push(
        `${name} Koffi return ${registration.returnType} != C ${cSignature.returnType}`
      );
    }
    if (registration.parameters.join('|') !== cSignature.parameters.join('|')) {
      errors.push(`${name} Koffi parameters do not match C header`);
    }
    if (tsSignature.returnType !== cTypeForTypeScript(cSignature.returnType)) {
      errors.push(`${name} TypeScript return does not match C header`);
    }
    const expectedTsParameters = cSignature.parameters.map(cTypeForTypeScript);
    if (tsSignature.parameters.join('|') !== expectedTsParameters.join('|')) {
      errors.push(`${name} TypeScript parameters do not match C header`);
    }
    const functionCalls = calls.get(name) ?? [];
    if (functionCalls.length === 0)
      errors.push(`Registered symbol is never called: ${name}`);
    for (const argumentCount of functionCalls) {
      if (argumentCount !== cSignature.parameters.length) {
        errors.push(
          `${name} call has ${argumentCount} arguments; expected ${cSignature.parameters.length}`
        );
      }
    }
  }

  for (const name of calls.keys()) {
    if (!registrationNames.has(name))
      errors.push(`Native call has no registration: ${name}`);
  }
  return errors.sort();
}

const [headerSource, interfaceSource, coreSources] = await Promise.all([
  readFile(headerPath, 'utf8'),
  readFile(interfacePath, 'utf8'),
  Promise.all(
    (
      await sourceFiles(corePath)
    ).map(async filePath => ({
      filePath,
      source: await readFile(filePath, 'utf8'),
    }))
  ),
]);

const header = parseHeader(headerSource);
const nativeInterface = parseNativeInterface(interfaceSource, interfacePath);
const { registrations, calls } = parseCoreSources(coreSources);
const errors = compareContracts(header, nativeInterface, registrations, calls);

assert.deepEqual(
  errors,
  [],
  `Electron native ABI contract has ${
    errors.length
  } mismatch(es):\n- ${errors.join('\n- ')}`
);

console.log(
  `[electron-abi-contract] ${registrations.size} mapped and ${intentionallyUnmappedHeaderSymbols.size} explicitly excluded native symbols match`
);
