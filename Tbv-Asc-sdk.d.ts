declare module 'tbv-asc-sdk' {
    export function execute_credit_leg(amountPtr: number, accountPtr: number): number;
    export function process_credit_result(resultPtr: number): number;
    export function execute_debit_leg(amountPtr: number, accountPtr: number): number;
    export function allocateString(len: number): number;
    export function writeString(ptr: number, str: string): void;
    export function readString(ptr: number): string;
    export function __allocate(size: number): number;
    export function logMessage(ptr: usize, len: i32): void;
    export function free_result(resultPtr: usize): void;
    export function set_query_result(resultPtr: usize): void;
    export function get_result_row(resultPtr: usize): usize;
    export function abort(message: string | null, fileName: string | null, lineNumber: u32, columnNumber: u32): void;
  }