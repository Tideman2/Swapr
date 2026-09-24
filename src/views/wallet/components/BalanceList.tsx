"use client";

import { Grid, Stack } from "@mui/material";

import { useMediaQuery } from "@/layout/hooks/useMediaQuery";
import type { Balance } from "@/types/wallet";
import BalanceItem from "./BalanceItem";

interface BalanceListProps {
    balances: Balance[];
}

export default function BalanceList({
    balances,
}: BalanceListProps) {
    const isTabletAndUp = useMediaQuery("fromMd");

    if (!isTabletAndUp) {
        return (
            <Stack spacing={2}>
                {balances.map((balance) => (
                    <BalanceItem
                        key={balance.currency}
                        balance={balance}
                    />
                ))}
            </Stack>
        );
    }

    return (
        <Grid
            container
            spacing={2}
        >
            {balances.map((balance) => (
                <Grid
                    key={balance.currency}
                    size={{ md: 6, lg: 4, xl: 3 }}
                >
                    <BalanceItem balance={balance} />
                </Grid>
            ))}
        </Grid>
    );
}