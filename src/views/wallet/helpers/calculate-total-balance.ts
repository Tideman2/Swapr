import Big from "big.js";

import type {
    Balance,
    CurrencyCode,
} from "@/types/wallet";

export function calculateTotalBalance(
    balances: Balance[],
    rates: Partial<Record<CurrencyCode, string>>,
    base: CurrencyCode,
): string {
    let total = new Big(0);

    for (const balance of balances) {
        if (balance.currency === base) {
            total = total.plus(balance.amount);
            continue;
        }

        const rate = rates[balance.currency];

        if (!rate) {
            continue;
        }

        total = total.plus(
            new Big(balance.amount).div(rate)
        );
    }

    return total.toFixed(2);
}