import { Direction } from "../types";
import Big from "big.js";

export function convertAmount(
    amount: string,
    rate: string,
    direction: Direction,
): string {
    if (!amount) {
        return "";
    }

    const value = new Big(amount);
    const exchangeRate = new Big(rate);

    if (direction === "source-to-target") {
        return value.times(exchangeRate).toString();
    }

    return value.div(exchangeRate).toString();
}