import { consoleLog, allocateString, writeString, readString, allocateJson } from './utils';
import { JSON } from 'assemblyscript-json';

class Request {
  method: string;
  path: string;
  headers: Map<string, string>;
  body: JSON.Obj;

  constructor(method: string, path: string, headers: Map<string, string>, body: JSON.Obj) {
    this.method = method;
    this.path = path;
    this.headers = headers;
    this.body = body;
  }
}

class Response {
  statusCode: i32;
  headers: Map<string, string>;
  body: string;

  constructor(statusCode: i32, headers: Map<string, string>, body: string) {
    this.statusCode = statusCode;
    this.headers = headers;
    this.body = body;
  }
}

function handleRequest(req: Request): Response {
  if (req.method == "GET" && req.path == "/api/data") {
    return handleGetData();
  } else if (req.method == "POST" && req.path == "/api/data") {
    return handlePostData(req.body);
  } else if (req.method == "PUT" && req.path == "/api/data") {
    return handlePutData(req.body);
  } else if (req.method == "DELETE" && req.path == "/api/data") {
    return handleDeleteData();
  }
  return notFoundResponse();
}

function handleGetData(): Response {
  return new Response(
    200,
    new Map<string, string>().set("Content-Type", "application/json"),
    '{"message": "Hello from WebAssembly API!"}'
  );
}

function handlePostData(body: JSON.Obj): Response {
  return new Response(
    201,
    new Map<string, string>().set("Content-Type", "application/json"),
    '{"message": "Data created successfully", "received": ' + body.toString() + '}'
  );
}

function handlePutData(body: JSON.Obj): Response {
  return new Response(
    200,
    new Map<string, string>().set("Content-Type", "application/json"),
    '{"message": "Data updated successfully", "received": ' + body.toString() + '}'
  );
}

function handleDeleteData(): Response {
  return new Response(
    200,
    new Map<string, string>().set("Content-Type", "application/json"),
    '{"message": "Data deleted successfully"}'
  );
}

function notFoundResponse(): Response {
  return new Response(
    404,
    new Map<string, string>().set("Content-Type", "application/json"),
    '{"error": "Not Found"}'
  );
}

export function handle_http_request(requestPtr: usize): usize {
    consoleLog("AS: Entering handle_http_request");
    const requestStr = readString(requestPtr);
    consoleLog(`AS: Received request: ${requestStr}`);
  
    const requestObj = <JSON.Obj>JSON.parse(requestStr);
    const methodValue = requestObj.getString("method");
    const pathValue = requestObj.getString("path");
    const bodyValue = requestObj.getObj("body");
  
    const request = new Request(
      methodValue ? methodValue.toString() : "",
      pathValue ? pathValue.toString() : "",
      new Map<string, string>(),
      bodyValue ? bodyValue : new JSON.Obj()
    );
  
    const headersObj = requestObj.getObj("headers");
    if (headersObj) {
      const keys = headersObj.keys;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = headersObj.getString(key);
        if (value) {
          request.headers.set(key, value.toString());
        }
      }
    }
  
    const response = handleRequest(request);
    
    const responseObj = new JSON.Obj();
    responseObj.set("statusCode", new JSON.Integer(response.statusCode));
    responseObj.set("headers", mapToJsonObj(response.headers));
    responseObj.set("body", JSON.from(response.body));
  
    const responseStr = responseObj.toString();
    consoleLog(`AS: Sending response: ${responseStr}`);
    const responsePtr = allocateString(responseStr.length);
    writeString(responsePtr, responseStr);
    return responsePtr;
  }

function createErrorResponse(message: string): usize {
  const errorResponse = JSON.Obj();
  errorResponse.set("statusCode", 500);
  const headers = JSON.Obj();
  headers.set("Content-Type", "application/json");
  errorResponse.set("headers", headers);
  const body = JSON.Obj();
  body.set("error", "Internal Server Error");
  body.set("details", message);
  errorResponse.set("body", body.toString());

  const errorStr = errorResponse.toString();
  const errorPtr = allocateString(errorStr.length);
  writeString(errorPtr, errorStr);
  return errorPtr;
}


function mapToJsonObj(map: Map<string, string>): JSON.Obj {
    const obj = new JSON.Obj();
    const keys = map.keys();
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      obj.set(key, JSON.from(map.get(key)));
    }
    return obj;
  }