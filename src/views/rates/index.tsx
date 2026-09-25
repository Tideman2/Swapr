"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Stack,
    Typography,
} from "@mui/material";

import { useMediaQuery } from "@/layout/hooks/useMediaQuery";
import type { RatesResponse } from "@/types/rate";
import type { CurrencyCode } from "@/types/wallet";

import BaseCurrencySelector from "./components/BaseCurrencySelector";
import RateRow from "./components/RateRow";
import RateStatus from "./components/RateStatus";
import {
    getRateDirection,
    type RateDirection,
} from "./helpers/get-rate-direction";

const RATES_STALE_THRESHOLD_MS = 15_000;

export default function LiveRates() {
    const [base, setBase] = useState<CurrencyCode>("USD");
    const [now, setNow] = useState(() => Date.now());

    const isMobile = useMediaQuery("upToSm");

    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useQuery<RatesResponse>({
        queryKey: ["live_rates", base],

        queryFn: async () => {
            const response = await fetch(
                `/api/rates?base=${base}`,
            );

            if (!response.ok) {
                throw new Error("Failed to fetch rates");
            }

            return response.json();
        },

        refetchInterval: 5000,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
        retry: true,
    });

    useEffect(() => {
        const timer = setInterval(
            () => setNow(Date.now()),
            1000,
        );

        return () => clearInterval(timer);
    }, []);

    const lastSnapshotRef = useRef<{
        base: CurrencyCode;
        rates: Partial<Record<CurrencyCode, string>>;
    } | null>(null);

    const [directions, setDirections] = useState<
        Partial<Record<CurrencyCode, RateDirection>>
    >({});

    useEffect(() => {
        if (!data) {
            return;
        }

        if (lastSnapshotRef.current?.base === data.base) {
            const next: Partial<
                Record<CurrencyCode, RateDirection>
            > = {};

            for (
                const currency
                of Object.keys(data.rates) as CurrencyCode[]
            ) {
                const previousRate =
                    lastSnapshotRef.current.rates[currency];
                const currentRate = data.rates[currency];

                if (previousRate && currentRate) {
                    next[currency] = getRateDirection(
                        previousRate,
                        currentRate,
                    );
                }
            }

            setDirections(next);
        } else {
            setDirections({});
        }

        lastSnapshotRef.current = {
            base: data.base,
            rates: data.rates,
        };
    }, [data]);

    const isStale = data
        ? now - new Date(data.timestamp).getTime() >=
          RATES_STALE_THRESHOLD_MS
        : false;

    const handleBaseChange = (currency: CurrencyCode) => {
        setBase(currency);
    };

    return (
        <Box>
            <Typography
                variant="h1"
                gutterBottom
            >
                Live rates
            </Typography>

            <BaseCurrencySelector
                value={base}
                onChange={handleBaseChange}
                isMobile={isMobile}
            />

            {isLoading && !data && (
                <Box
                    sx={{
                        mt: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                    }}
                >
                    <CircularProgress size={18} />

                    <Typography variant="body2">
                        Loading rates...
                    </Typography>
                </Box>
            )}

            {isError && !data && (
                <Alert
                    severity="error"
                    action={
                        <Button
                            color="inherit"
                            size="small"
                            onClick={() => refetch()}
                        >
                            Retry
                        </Button>
                    }
                >
                    Unable to load rates.
                </Alert>
            )}

            {data && (
                <>
                    <RateStatus
                        timestamp={data.timestamp}
                        now={now}
                        isStale={isStale}
                        isFetching={isFetching}
                        isError={isError}
                        isMobile={isMobile}
                    />

                    <Stack spacing={1}>
                        {(
                            Object.keys(data.rates) as CurrencyCode[]
                        ).map((currency) => {
                            const value = data.rates[currency];

                            if (!value) {
                                return null;
                            }

                            return (
                                <RateRow
                                    key={currency}
                                    currency={currency}
                                    value={value}
                                    direction={
                                        directions[currency] ??
                                        "unchanged"
                                    }
                                />
                            );
                        })}
                    </Stack>
                </>
            )}
        </Box>
    );
}
