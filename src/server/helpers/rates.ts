// Validate the base.
// Apply the random ±0.5% drift.
// Calculate the requested base's relative rates.
import Big from "big.js";

import {
    SUPPORTED_CURRENCIES,
    type CurrencyCode,
} from "@/types/wallet";

export function isSupportedCurrency(
    currency: string
): currency is CurrencyCode {
    return SUPPORTED_CURRENCIES.includes(
        currency as CurrencyCode
    );
}

export function generateRateDrift(): Big {
    // -0.5% to +0.5%
    const drift = Math.random() * 0.01 - 0.005;

    return new Big(drift);
}

export function applyRateDrift(
    rate: string,
    drift: Big
): string {
    return new Big(rate)
        .times(new Big(1).plus(drift))
        .toFixed(8);
}

export function calculateRelativeRate(
    rate: string,
    baseRate: string
): string {
    return new Big(rate)
        .div(baseRate)
        .toFixed(8);
}

export function shouldSimulateRateFailure(): boolean {
    return Math.random() < 0.1;
}