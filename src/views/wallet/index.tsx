"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Alert,
    Button,
    Card,
    CardContent,
    Typography,
    Box
} from "@mui/material";
import type { RatesResponse } from "@/types/rate";
import { formatMoney } from "@/lib/money/format-money";
import type {
    BalancesResponse,
    CurrencyCode,
} from "@/types/wallet";

import BalanceList from "./components/BalanceList";
import BalanceListSkeleton from "./components/BalanceListSkeleton";
import CurrencySelector from "./components/CurrencySelector";
import { calculateTotalBalance } from "./helpers/calculate-total-balance";

export default function WalletOverview() {
    const [selectedCurrency, setSelectedCurrency] =
        useState<CurrencyCode>("USD");

    const { data, isLoading, error, refetch } =
        useQuery<BalancesResponse>({
            queryKey: ["balances"],
            queryFn: async () => {
                const response = await fetch("/api/balances");
                if (!response.ok) {
                    throw new Error("Failed to fetch balances");
                }
                return response.json();
            },
        });

    const { data: rates } = useQuery<RatesResponse>({
        queryKey: ["live_rates", selectedCurrency],
        queryFn: async () => {
            const response = await fetch(
                `/api/rates?base=${selectedCurrency}`,
            );

            if (!response.ok) {
                throw new Error("Failed to fetch rates");
            }

            return response.json();
        },
    });

    if (isLoading) {
        return (
            <>
                <h1>Wallet overview</h1>

                <BalanceListSkeleton />
            </>
        );
    }

    if (error) {
        return (
            <>
                <h1>Wallet overview</h1>

                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => refetch()}
                        >
                            Try again
                        </Button>
                    }
                >
                    Unable to load balances.
                </Alert>
            </>
        );
    }

    if (!data || data.balances.length === 0) {
        return (
            <>
                <h1>Wallet overview</h1>

                <Card>
                    <CardContent>
                        <Typography variant="h6">
                            No balances yet
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Your wallet balances will appear here.
                        </Typography>
                    </CardContent>
                </Card>
            </>
        );
    }

    const totalBalance = rates
        ? calculateTotalBalance(
            data.balances,
            rates.rates,
            selectedCurrency,
        )
        : null;

    return (
        <>
            <Typography
                variant="h1"
                gutterBottom
            >
                Wallet overview
            </Typography>

            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1
            }}>

                <CurrencySelector
                    value={selectedCurrency}
                    currencies={data.balances.map(
                        (balance) => balance.currency,
                    )}
                    onChange={setSelectedCurrency}
                />

                <Typography>
                    {formatMoney(totalBalance ?? "0", selectedCurrency)} {selectedCurrency}
                </Typography>
            </Box>

            <BalanceList
                balances={data.balances}
            />
        </>
    );
}