import { readString, allocateString, writeString, consoleLog, parseFloat, isNaN, allocateJson, readJson } from './utils';
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
  const errorResult = new JSON.Obj();
  errorResult.set("creditQuery", globalQuery);
  errorResult.set("creditResult", `Error: ${message}`);
  
  return allocateJson(errorResult);
}

export function process_credit_result(resultPtr: usize): usize {
  const result = readString(resultPtr);
  consoleLog(`Processing credit result: ${result}`);

  const jsonResult = <JSON.Obj>JSON.parse(result);
  const results = jsonResult.getObj("results");
  if (results) {
    const bindings = results.getArr("bindings");
    if (bindings && bindings.valueOf().length > 0) {
      const balanceObj = <JSON.Obj>bindings.valueOf()[0];
      const balanceValue = balanceObj.get("balance");
      if (balanceValue && balanceValue.isString) {
        const balance = parseFloat((<JSON.Str>balanceValue).valueOf());

        if (!isNaN(balance)) {
          const newBalance = balance + globalAmount;
          
          const finalResult = new JSON.Obj();
          finalResult.set("creditQuery", globalQuery);
          finalResult.set("creditResult", `Current balance: ${balance.toString()}. After credit of ${globalAmount.toString()}, new balance: ${newBalance.toString()}`);

          return allocateJson(finalResult);
        } else {
          return createErrorResult(`Invalid balance value: ${(<JSON.Str>balanceValue).valueOf()}`);
        }
      }
    }
  }
  return createErrorResult("No balance found in result");
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