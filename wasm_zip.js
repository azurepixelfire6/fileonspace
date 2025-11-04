// wasm_zip.js - Updated for proper memory handling
let wasm;
let memory = new WebAssembly.Memory({ initial: 256, maximum: 256 });
let heap_next = 0;

export async function initZip(input) {
  if (!input) input = './wasm_zip_bg.wasm';
  const response = await fetch(input);
  const module = await WebAssembly.instantiateStreaming(response, { js: { mem: memory } });
  wasm = module.instance.exports;
}

function allocate(size) {
  const ptr = heap_next;
  heap_next += size;
  if (heap_next > memory.buffer.byteLength) throw new Error('Out of memory');
  return ptr;
}

export function unzip(buffer) {
  const ptr = allocate(buffer.length);
  new Uint8Array(memory.buffer).set(buffer, ptr);
  const resultPtr = wasm.unzip(ptr, buffer.length);
  // Parse result to JS Map (assume wasm returns serialized data; adapt as needed)
  return new Map(); // Placeholder - implement based on your wasm-zip exports
}

export function rezip(entries) {
  // Serialize entries to buffer, call wasm.rezip
  return new Uint8Array(); // Placeholder
}

export function updatePlist(buffer, newId) {
  const ptr = allocate(buffer.length);
  new Uint8Array(memory.buffer).set(buffer, ptr);
  const resultPtr = wasm.update_plist(ptr, buffer.length, newId);
  const resultLen = wasm.get_result_len();
  return new Uint8Array(memory.buffer.slice(resultPtr, resultPtr + resultLen));
}
