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
 * src/memory/readString
 * @param ptr `usize`
 * @returns `~lib/string/String`
 */
export declare function readString(ptr: number): string;
