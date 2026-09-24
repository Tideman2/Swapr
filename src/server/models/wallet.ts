import type { Balance } from "@/types/wallet"

export interface Wallet {
    currencies: Balance[];
    convertions: []
}

export interface BalancesResponse {
    balances: Balance[];
}