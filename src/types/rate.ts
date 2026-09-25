import type { CurrencyCode } from "@/types/wallet";

export interface RatesResponse {
    base: CurrencyCode;
    rates: Partial<Record<CurrencyCode, string>>;
    timestamp: string;
}