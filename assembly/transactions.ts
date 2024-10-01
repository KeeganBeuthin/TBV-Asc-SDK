
import { readString, allocateString, writeString, consoleLog, parseFloat, isNaN } from './utils';
import { JSON } from "assemblyscript-json";

let globalAmount: f64 = 0;
let globalQuery: string = "";

export function execute_credit_leg(amountPtr: usize, accountPtr: usize): usize {
  const amount = readString(amountPtr);
  const account = readString(accountPtr);
  
  consoleLog(`Executing credit leg for amount: ${amount}, account: ${account}`);

  globalAmount = parseFloat(amount);
  
  // Construct RDF query
  globalQuery = `
    PREFIX ex: <http://example.org/>
    SELECT ?balance
    WHERE {
      ex:${account} ex:hasBalance ?balance .
    }
  `;

  // Allocate memory for the query string and write it
  const queryPtr = allocateString(globalQuery.length);
  writeString(queryPtr, globalQuery);

  // Return the pointer to the query string
  return queryPtr;
}

function createErrorResult(message: string): usize {
  const errorResult = {
    creditQuery: globalQuery,
    creditResult: `Error: ${message}`
  };
  const errorResultString = JSON.stringify(errorResult);
  const errorPtr = allocateString(errorResultString.length);
  writeString(errorPtr, errorResultString);
  return errorPtr;
}



export function process_credit_result(resultPtr: usize): usize {
  const result = readString(resultPtr);
  consoleLog(`Processing credit result: ${result}`);

  const jsonResult = JSON.parse(result);
  const balanceValue = jsonResult.getObj("results")!.getArr("bindings")!.at(0).getObj("balance")!.getString("value");

  if (balanceValue) {
    const balance = parseFloat(balanceValue.toString());

    if (!isNaN(balance)) {
      const newBalance = balance + globalAmount;
      
      const finalResult = {
        creditQuery: globalQuery,
        creditResult: `Current balance: ${balance.toFixed(2)}. After credit of ${globalAmount.toFixed(2)}, new balance: ${newBalance.toFixed(2)}`
      };

      const finalResultString = JSON.stringify(finalResult);
      consoleLog(`Final result: ${finalResultString}`);
      
      const responsePtr = allocateString(finalResultString.length);
      writeString(responsePtr, finalResultString);
      return responsePtr;
    } else {
      return createErrorResult(`Invalid balance value: ${balanceValue}`);
    }
  } else {
    return createErrorResult("No balance found in result");
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