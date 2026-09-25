export type CurrencyCode = "NGN" | "USD" | "GBP" | "EUR" | "JPY";

export interface Balance {
    currency: CurrencyCode;
    amount: string; // minor units
}

export interface BalancesResponse {
    balances: Balance[];
}

export const SUPPORTED_CURRENCIES = [
    "NGN", "USD", "GBP", "EUR", "JPY"
]
