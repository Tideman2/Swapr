import { marketRates } from "@/server/state/market";
import {
    applyRateDrift,
    calculateRelativeRate,
    generateRateDrift,
    isSupportedCurrency,
} from "@/server/helpers/rates";
import type { CurrencyCode } from "@/types/wallet";
import type { RatesResponse } from "@/types/rate";

export class InvalidCurrencyError extends Error {
    constructor(currency: string) {
        super(`Unsupported currency: ${currency}`);
        this.name = "InvalidCurrencyError";
    }
}

export async function getRates(
    base: string
): Promise<RatesResponse> {
    if (!isSupportedCurrency(base)) {
        throw new InvalidCurrencyError(base);
    }

    const drift = generateRateDrift();

    for (const currency of Object.keys(marketRates) as CurrencyCode[]) {
        marketRates[currency] = applyRateDrift(
            marketRates[currency],
            drift
        );
    }

    const baseRate = marketRates[base];

    const rates: Partial<Record<CurrencyCode, string>> = {};

    for (const currency of Object.keys(marketRates) as CurrencyCode[]) {
        if (currency === base) {
            continue;
        }

        rates[currency] = calculateRelativeRate(
            marketRates[currency],
            baseRate
        );
    }

    return {
        base,
        rates,
        timestamp: new Date().toISOString(),
    };
}