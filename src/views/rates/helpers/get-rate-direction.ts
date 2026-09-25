import Big from "big.js";

export type RateDirection = "up" | "down" | "unchanged";

export function getRateDirection(
    previous: string,
    current: string,
): RateDirection {
    const previousRate = new Big(previous);
    const currentRate = new Big(current);

    if (currentRate.gt(previousRate)) {
        return "up";
    }

    if (currentRate.lt(previousRate)) {
        return "down";
    }

    return "unchanged";
}