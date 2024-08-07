import { readString, allocateString, writeString } from "./memory";
import { consoleLog, parseFloat, isNaN } from "./utils";

let globalAmount: f64 = 0;

export function execute_credit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amount = readString(amountPtr);
  const account = readString(accountPtr);
  
  consoleLog(`Executing credit leg for amount: ${amount}, account: ${account}`);

  globalAmount = parseFloat(amount);
  
  const query = `
    PREFIX ex: <http://example.org/>
    SELECT ?balance
    WHERE {
      ex:${account} ex:hasBalance ?balance .
    }
  `;

  const queryPtr = allocateString(query.length);
  writeString(queryPtr, query);

  return queryPtr;
}

export function process_credit_result(resultPtr: usize): usize {
  const result = readString(resultPtr);
  consoleLog(`Processing credit result: ${result}`);

  const balanceStart = result.indexOf('"balance":') + 10;
  const balanceEnd = result.indexOf('}', balanceStart);
  if (balanceStart === 9 || balanceEnd === -1) {
    return createErrorResult("Invalid result format or no balance found");
  }

  const balanceStr = result.substring(balanceStart, balanceEnd);
  const balance = parseFloat(balanceStr);

  if (isNaN(balance)) {
    return createErrorResult(`Invalid balance value: ${balanceStr}`);
  }

  const newBalance = balance + globalAmount;
  
  const responseMessage = `Current balance: ${balance}. After credit of ${globalAmount}, new balance: ${newBalance}`;
  consoleLog(responseMessage);
  
  return createSuccessResult(responseMessage);
}

export function execute_debit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amount = readString(amountPtr);
  const account = readString(accountPtr);
  
  const message = `Debiting ${amount} from account ${account}`;
  consoleLog(`Created message: "${message}"`);
  
  return createSuccessResult(message);
}

function createErrorResult(message: string): usize {
  const errorMessage = `Error: ${message}`;
  return allocateString(errorMessage.length);
}

function createSuccessResult(message: string): usize {
  return allocateString(message.length);
}