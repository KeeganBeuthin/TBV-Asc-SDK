/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * src/transactions/execute_credit_leg
 * @param amountPtr `usize`
 * @param accountPtr `usize`
 * @returns `usize`
 */
export declare function execute_credit_leg(amountPtr: number, accountPtr: number): number;
/**
 * src/transactions/process_credit_result
 * @param resultPtr `usize`
 * @returns `usize`
 */
export declare function process_credit_result(resultPtr: number): number;
/**
 * src/transactions/execute_debit_leg
 * @param amountPtr `usize`
 * @param accountPtr `usize`
 * @returns `usize`
 */
export declare function execute_debit_leg(amountPtr: number, accountPtr: number): number;
/**
 * src/memory/allocateString
 * @param len `i32`
 * @returns `usize`
 */
export declare function allocateString(len: number): number;
/**
 * src/memory/writeString
 * @param ptr `usize`
 * @param str `~lib/string/String`
 */
export declare function writeString(ptr: number, str: string): void;
/**
 * src/memory/getStringLen
 * @param ptr `usize`
 * @returns `i32`
 */
export declare function getStringLen(ptr: number): number;
/**
 * src/memory/readString
 * @param ptr `usize`
 * @returns `~lib/string/String`
 */
export declare function readString(ptr: number): string;
/**
 * src/utils/parseFloat
 * @param str `~lib/string/String`
 * @returns `f64`
 */
export declare function parseFloat(str: string): number;
/**
 * src/utils/isNaN
 * @param value `f64`
 * @returns `bool`
 */
export declare function isNaN(value: number): boolean;
/**
 * src/utils/consoleLog
 * @param message `~lib/string/String`
 */
export declare function consoleLog(message: string): void;
/**
 * src/utils/parseBalance
 * @param jsonStr `~lib/string/String`
 * @returns `f64`
 */
export declare function parseBalance(jsonStr: string): number;
/**
 * src/ffi/abort
 * @param message `~lib/string/String | null`
 * @param fileName `~lib/string/String | null`
 * @param lineNumber `u32`
 * @param columnNumber `u32`
 */
export declare function abort(message: string | null, fileName: string | null, lineNumber: number, columnNumber: number): void;
/**
 * src/ffi/logMessage
 * @param ptr `usize`
 * @param len `i32`
 */
export declare function logMessage(ptr: number, len: number): void;
/**
 * src/ffi/query_rdf_tbv_cli
 * @param queryPtr `usize`
 * @param queryLen `i32`
 * @returns `usize`
 */
export declare function query_rdf_tbv_cli(queryPtr: number, queryLen: number): number;
/**
 * src/ffi/get_result_row
 * @param resultPtr `usize`
 * @returns `usize`
 */
export declare function get_result_row(resultPtr: number): number;
/**
 * src/ffi/free_result
 * @param resultPtr `usize`
 */
export declare function free_result(resultPtr: number): void;
/**
 * src/ffi/set_query_result
 * @param resultPtr `usize`
 */
export declare function set_query_result(resultPtr: number): void;
