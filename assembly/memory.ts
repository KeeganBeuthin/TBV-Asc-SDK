import { consoleLog } from "./utils";

export function allocateString(len: i32): usize {
  consoleLog(`Attempting to allocate string of length ${len}`);
  const ptr = __new(len, idof<ArrayBuffer>()) + 4; 
  consoleLog(`Allocated buffer for string at ${ptr} with length ${len}`);
  return ptr;
}


export function writeString(ptr: usize, str: string): void {
  const buffer = String.UTF8.encode(str);
  memory.copy(ptr, changetype<usize>(buffer), buffer.byteLength);
}



export function __allocate(size: i32): usize {
  return heap.alloc(size) as usize;
}


export function getStringLen(ptr: usize): i32 {
  consoleLog(`Getting string length at address ${ptr}`);
  let len = 0;
  while (load<u8>(ptr + len) !== 0) {
    consoleLog(`Byte at ${ptr + len}: ${load<u8>(ptr + len)}`);
    len++;
    if (len > 1000) {  // Safety check to prevent infinite loop
      consoleLog("Warning: Reached maximum length check");
      break;
    }
  }
  consoleLog(`String at ${ptr} has length ${len}`);
  return len;
}



export function readString(ptr: usize): string {
  const len = getStringLen(ptr);
  consoleLog(`Reading string of length ${len} from address ${ptr}`);
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buffer[i] = load<u8>(ptr + i);
    consoleLog(`Read byte: ${buffer[i]}`);
  }
  const result = String.UTF8.decode(buffer.buffer);
  consoleLog(`Decoded string: "${result}"`);
  return result;
}

