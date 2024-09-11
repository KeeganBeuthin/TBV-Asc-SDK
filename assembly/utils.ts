// utils.ts

import { logMessage } from './ffi';

export function parseFloat(str: string): f64 {
  return F64.parseFloat(str);
}

export function isNaN(value: f64): bool {
  return value != value;
}

export function consoleLog(message: string): void {
  const encoded = String.UTF8.encode(message);
  logMessage(changetype<usize>(encoded), encoded.byteLength);
}

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

export function getStringLen(ptr: usize): i32 {
  consoleLog(`Getting string length at address ${ptr}`);
  let len = 0;
  while (load<u8>(ptr + len) !== 0) {
    len++;
  }
  consoleLog(`String at ${ptr} has length ${len}`);
  return len;
}

export function readString(ptr: usize): string {
  const len = getStringLen(ptr);
  const buffer = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    buffer[i] = load<u8>(ptr + i);
  }
  return String.UTF8.decode(buffer.buffer);
}

export function createErrorResult(message: string): usize {
  const errorMessage = `Error: ${message}`;
  const ptr = allocateString(errorMessage.length);
  writeString(ptr, errorMessage);
  return ptr;
}

export function createSuccessResult(message: string): usize {
  const ptr = allocateString(message.length);
  writeString(ptr, message);
  return ptr;
}

export function parseBalance(jsonStr: string): f64 {
  const balanceStart = jsonStr.indexOf('"balance":') + 10;
  const balanceEnd = jsonStr.indexOf('}', balanceStart);
  if (balanceStart === 9 || balanceEnd === -1) {
    consoleLog("Error parsing balance: invalid JSON format");
    return NaN;
  }
  const balanceStr = jsonStr.substring(balanceStart, balanceEnd);
  return parseFloat(balanceStr);
}