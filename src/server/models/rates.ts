import type { Balance, CurrencyCode } from "@/types/wallet"

export interface Rate {
    base: CurrencyCode;
    rates: Record<CurrencyCode, string>;
    timestamp: string;
}

export type RatesResponse = Rate[]