import type { Balance, CurrencyCode } from "@/types/wallet";
import type { Conversions } from "../models/conversion";

export interface WalletState {
    balances: Balance[];
    conversions: Conversions;
}

export const walletState: WalletState = {
    balances: [
        {
            currency: "NGN",
            amount: "125000050",
        },
        {
            currency: "USD",
            amount: "250075",
        },
        {
            currency: "GBP",
            amount: "0",
        },
        {
            currency: "EUR",
            amount: "48020",
        },
        {
            currency: "JPY",
            amount: "150000",
        },
    ],

    conversions: [],
};