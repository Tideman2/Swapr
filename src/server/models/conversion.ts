import type { Balance, CurrencyCode } from "@/types/wallet"

export interface Conversion {
    id: string;
    quoteId: string;
    sellCurrency: CurrencyCode;
    sellAmount: string;
    buyCurrency: CurrencyCode;
    buyAmount: string;
    rate: string;
    fee: {
        currency: CurrencyCode;
        amount: string;
    };
    createdAt: string;
}

export type Conversions = Conversion[]