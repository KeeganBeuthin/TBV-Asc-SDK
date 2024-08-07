import { logMessage } from "./ffi";

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