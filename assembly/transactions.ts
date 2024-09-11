// main.ts

import { readString, allocateString, writeString, consoleLog, parseFloat, isNaN } from './utils';

let globalAmount: f64 = 0;

export function execute_credit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amount = readString(amountPtr);
  const account = readString(accountPtr);
  
  consoleLog(`Executing credit leg for amount: ${amount}, account: ${account}`);

  globalAmount = parseFloat(amount)
  
  // Construct RDF query
  const query = `
    PREFIX ex: <http://example.org/>
    SELECT ?balance
    WHERE {
      ex:${account} ex:hasBalance ?balance .
    }
  `;

  // Allocate memory for the query string and write it
  const queryPtr = allocateString(query.length);
  writeString(queryPtr, query);

  // Return the pointer to the query string
  return queryPtr;
}

export function process_credit_result(resultPtr: usize): usize {
  const result = readString(resultPtr);
  consoleLog(`Processing credit result: ${result}`);

  // Find the balance value in the JSON string
  const balanceStart = result.indexOf('"balance":"') + 11;
  const balanceEnd = result.indexOf('"', balanceStart);

  if (balanceStart > 10 && balanceEnd > balanceStart) {
    const balanceStr = result.substring(balanceStart, balanceEnd);
    const balance = parseFloat(balanceStr);

    if (!isNaN(balance)) {
      const newBalance = balance + globalAmount;
      const responseMessage = `Current balance: ${balance.toString()}. After credit of ${globalAmount.toString()}, new balance: ${newBalance.toString()}`;
      consoleLog(responseMessage);
      const responsePtr = allocateString(responseMessage.length);
      writeString(responsePtr, responseMessage);
      return responsePtr;
    } else {
      const errorMessage = `Invalid balance value: ${balanceStr}`;
      consoleLog(errorMessage);
      const errorPtr = allocateString(errorMessage.length);
      writeString(errorPtr, errorMessage);
      return errorPtr;
    }
  } else {
    const errorMessage = "No balance found in result";
    consoleLog(errorMessage);
    const errorPtr = allocateString(errorMessage.length);
    writeString(errorPtr, errorMessage);
    return errorPtr;
  }
}

export function execute_debit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amount = readString(amountPtr);
  const account = readString(accountPtr);
  
  const message = `Debiting ${amount} from account ${account}`;
  consoleLog(`Created message: "${message}"`);
  
  const ptr = allocateString(message.length);
  writeString(ptr, message);
  
  return ptr;
}