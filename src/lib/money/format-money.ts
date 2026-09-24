import Big from "big.js";
import type { CurrencyCode } from "@/types/wallet";

const CURRENCY_DECIMALS: Record<CurrencyCode, number> = {
    NGN: 2,
    USD: 2,
    GBP: 2,
    EUR: 2,
    JPY: 0,
};

export function formatMoney(
    minorUnits: string,
    currency: CurrencyCode,
): string {
    const decimals = CURRENCY_DECIMALS[currency];

    // 1. Create a Big instance of the minor units and the divisor
    const bigMinor = new Big(minorUnits);
    const divisor = new Big(10).pow(decimals);

    // 2. Perform high-precision division
    const valueBig = bigMinor.div(divisor);

    // 3. Convert to a standard number safely for the Intl formatter
    const value = valueBig.toNumber();

    return new Intl.NumberFormat("en", {
        style: "currency",
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(value);
}
