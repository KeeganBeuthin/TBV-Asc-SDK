async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.assign(Object.create(globalThis), imports.env || {}, {
      abort(message, fileName, lineNumber, columnNumber) {
        // src/ffi/abort(~lib/string/String | null, ~lib/string/String | null, u32, u32) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        abort(message, fileName, lineNumber, columnNumber);
      },
      logMessage(ptr, len) {
        // src/ffi/logMessage(usize, i32) => void
        ptr = ptr >>> 0;
        logMessage(ptr, len);
      },
      query_rdf_tbv_cli(queryPtr, queryLen) {
        // src/ffi/query_rdf_tbv_cli(usize, i32) => usize
        queryPtr = queryPtr >>> 0;
        return query_rdf_tbv_cli(queryPtr, queryLen);
      },
      get_result_row(resultPtr) {
        // src/ffi/get_result_row(usize) => usize
        resultPtr = resultPtr >>> 0;
        return get_result_row(resultPtr);
      },
      free_result(resultPtr) {
        // src/ffi/free_result(usize) => void
        resultPtr = resultPtr >>> 0;
        free_result(resultPtr);
      },
      set_query_result(resultPtr) {
        // src/ffi/set_query_result(usize) => void
        resultPtr = resultPtr >>> 0;
        set_query_result(resultPtr);
      },
    }),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    execute_credit_leg(amountPtr, accountPtr) {
      // src/transactions/execute_credit_leg(usize, usize) => usize
      return exports.execute_credit_leg(amountPtr, accountPtr) >>> 0;
    },
    process_credit_result(resultPtr) {
      // src/transactions/process_credit_result(usize) => usize
      return exports.process_credit_result(resultPtr) >>> 0;
    },
    execute_debit_leg(amountPtr, accountPtr) {
      // src/transactions/execute_debit_leg(usize, usize) => usize
      return exports.execute_debit_leg(amountPtr, accountPtr) >>> 0;
    },
    allocateString(len) {
      // src/memory/allocateString(i32) => usize
      return exports.allocateString(len) >>> 0;
    },
    writeString(ptr, str) {
      // src/memory/writeString(usize, ~lib/string/String) => void
      str = __lowerString(str) || __notnull();
      exports.writeString(ptr, str);
    },
    readString(ptr) {
      // src/memory/readString(usize) => ~lib/string/String
      return __liftString(exports.readString(ptr) >>> 0);
    },
    parseFloat(str) {
      // src/utils/parseFloat(~lib/string/String) => f64
      str = __lowerString(str) || __notnull();
      return exports.parseFloat(str);
    },
    isNaN(value) {
      // src/utils/isNaN(f64) => bool
      return exports.isNaN(value) != 0;
    },
    consoleLog(message) {
      // src/utils/consoleLog(~lib/string/String) => void
      message = __lowerString(message) || __notnull();
      exports.consoleLog(message);
    },
    parseBalance(jsonStr) {
      // src/utils/parseBalance(~lib/string/String) => f64
      jsonStr = __lowerString(jsonStr) || __notnull();
      return exports.parseBalance(jsonStr);
    },
    abort(message, fileName, lineNumber, columnNumber) {
      // src/ffi/abort(~lib/string/String | null, ~lib/string/String | null, u32, u32) => void
      message = __retain(__lowerString(message));
      fileName = __lowerString(fileName);
      try {
        exports.abort(message, fileName, lineNumber, columnNumber);
      } finally {
        __release(message);
      }
    },
    query_rdf_tbv_cli(queryPtr, queryLen) {
      // src/ffi/query_rdf_tbv_cli(usize, i32) => usize
      return exports.query_rdf_tbv_cli(queryPtr, queryLen) >>> 0;
    },
    get_result_row(resultPtr) {
      // src/ffi/get_result_row(usize) => usize
      return exports.get_result_row(resultPtr) >>> 0;
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __lowerString(value) {
    if (value == null) return 0;
    const
      length = value.length,
      pointer = exports.__new(length << 1, 2) >>> 0,
      memoryU16 = new Uint16Array(memory.buffer);
    for (let i = 0; i < length; ++i) memoryU16[(pointer >>> 1) + i] = value.charCodeAt(i);
    return pointer;
  }
  const refcounts = new Map();
  function __retain(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount) refcounts.set(pointer, refcount + 1);
      else refcounts.set(exports.__pin(pointer), 1);
    }
    return pointer;
  }
  function __release(pointer) {
    if (pointer) {
      const refcount = refcounts.get(pointer);
      if (refcount === 1) exports.__unpin(pointer), refcounts.delete(pointer);
      else if (refcount) refcounts.set(pointer, refcount - 1);
      else throw Error(`invalid refcount '${refcount}' for reference '${pointer}'`);
    }
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  return adaptedExports;
}
export const {
  memory,
  execute_credit_leg,
  process_credit_result,
  execute_debit_leg,
  allocateString,
  writeString,
  getStringLen,
  readString,
  parseFloat,
  isNaN,
  consoleLog,
  parseBalance,
  abort,
  logMessage,
  query_rdf_tbv_cli,
  get_result_row,
  free_result,
  set_query_result,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
  }
))(new URL("debug.wasm", import.meta.url));
