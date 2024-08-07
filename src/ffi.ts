// @ts-ignore
@external("env", "abort")
export declare function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void;

// @ts-ignore
@external("env", "logMessage")
export declare function logMessage(ptr: usize, len: i32): void;

// @ts-ignore
@external("env", "query_rdf_tbv_cli")
export declare function query_rdf_tbv_cli(queryPtr: usize, queryLen: i32): usize;

// @ts-ignore
@external("env", "get_result_row")
export declare function get_result_row(resultPtr: usize): usize;

// @ts-ignore
@external("env", "free_result")
export declare function free_result(resultPtr: usize): void;

// @ts-ignore
@external("env", "set_query_result")
export declare function set_query_result(resultPtr: usize): void;