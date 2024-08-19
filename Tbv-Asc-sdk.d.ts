declare module 'tbv-asc-sdk' {
    export function execute_credit_leg(amountPtr: number, accountPtr: number): number;
    export function process_credit_result(resultPtr: number): number;
    export function execute_debit_leg(amountPtr: number, accountPtr: number): number;
    export function allocateString(len: number): number;
    export function writeString(ptr: number, str: string): void;
    export function readString(ptr: number): string;
  }