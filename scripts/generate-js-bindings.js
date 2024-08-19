const fs = require('fs');
const path = require('path');

const wasmCode = fs.readFileSync(path.join(__dirname, '../dist/index.wasm'));

const jsContent = `
const wasmModule = new WebAssembly.Module(new Uint8Array([${wasmCode.join(',')}]));

export default function instantiate(imports = {}) {
  const instance = new WebAssembly.Instance(wasmModule, imports);
  return instance.exports;
}
`;

fs.writeFileSync(path.join(__dirname, '../dist/index.js'), jsContent);
fs.writeFileSync(path.join(__dirname, '../dist/index.mjs'), jsContent);