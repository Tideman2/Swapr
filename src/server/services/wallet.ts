import { simulateNetworkDelay } from "../helpers";
import { walletState } from "../state/wallet";
import { formatMoney } from "@/lib/money/format-money";
import type { BalancesResponse } from "@/types/wallet";

export async function getBalances(): Promise<BalancesResponse> {
    await simulateNetworkDelay();

    return {
        balances: walletState.balances.map((balance) => ({
            ...balance
        })),
    };
}