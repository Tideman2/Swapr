"use client";

import { useEffect, useRef, useState } from "react";
import Big from "big.js";
import { useQuery } from "@tanstack/react-query";

import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    Tooltip,
    Typography,
    type SelectChangeEvent,
} from "@mui/material";

import { useMediaQuery } from "@/layout/hooks/useMediaQuery";
import type { RatesResponse } from "@/types/rate";
import {
    SUPPORTED_CURRENCIES,
    type CurrencyCode,
} from "@/types/wallet";

const RATES_STALE_THRESHOLD_MS = 15_000;

type RateDirection = "up" | "down" | "unchanged";

function getRateDirection(
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

function formatLastUpdated(
    timestamp: string,
    now: number,
): string {
    const elapsed = Math.max(
        0,
        Math.floor((now - new Date(timestamp).getTime()) / 1000),
    );

    if (elapsed < 1) {
        return "just now";
    }

    return `${elapsed} second${elapsed === 1 ? "" : "s"} ago`;
}

interface MovementIndicatorProps {
    currency: CurrencyCode;
    direction: RateDirection;
}

function MovementIndicator({
    currency,
    direction,
}: MovementIndicatorProps) {
    const label =
        direction === "up"
            ? `${currency} rate increased`
            : direction === "down"
              ? `${currency} rate decreased`
              : `${currency} rate unchanged`;

    return (
        <Tooltip title={label}>
            <Box
                component="span"
                aria-label={label}
                sx={{
                    display: "inline-flex",
                    alignItems: "center",
                }}
            >
                {direction === "up" ? (
                    <ArrowUpwardRoundedIcon
                        fontSize="small"
                        color="success"
                    />
                ) : direction === "down" ? (
                    <ArrowDownwardRoundedIcon
                        fontSize="small"
                        color="error"
                    />
                ) : (
                    <RemoveRoundedIcon
                        fontSize="small"
                        color="disabled"
                    />
                )}
            </Box>
        </Tooltip>
    );
}

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

    return (
        <Box>
            <Typography
                variant="h1"
                gutterBottom
            >
                Live rates
            </Typography>

            <FormControl
                size="small"
                sx={isMobile
                    ? { width: "100%" }
                    : { minWidth: 200 }}
            >
                <InputLabel>Base currency</InputLabel>

                <Select
                    value={base}
                    label="Base currency"
                    onChange={(event: SelectChangeEvent) =>
                        setBase(
                            event.target.value as CurrencyCode,
                        )
                    }
                >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                        <MenuItem
                            key={currency}
                            value={currency}
                        >
                            {currency}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                    <Stack
                        direction={
                            isMobile ? "column" : "row"
                        }
                        spacing={1}
                        sx={
                            isMobile
                                ? {
                                      mt: 2,
                                      mb: 2,
                                      alignItems:
                                          "flex-start",
                                  }
                                : {
                                      mt: 2,
                                      mb: 2,
                                      alignItems: "center",
                                  }
                        }
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Last updated{" "}
                            {formatLastUpdated(
                                data.timestamp,
                                now,
                            )}
                        </Typography>

                        {isStale && (
                            <Chip
                                label="Stale"
                                size="small"
                                color="warning"
                            />
                        )}

                        {isFetching && !isError && (
                            <Chip
                                label="Updating..."
                                size="small"
                                variant="outlined"
                                color="info"
                            />
                        )}

                        {isError && (
                            <Chip
                                label="Update failed, retrying…"
                                size="small"
                                variant="outlined"
                                color="error"
                            />
                        )}
                    </Stack>

                    <Stack spacing={1}>
                        {(
                            Object.keys(data.rates) as CurrencyCode[]
                        ).map((currency) => {
                            const value = data.rates[currency];

                            if (!value) {
                                return null;
                            }

                            return (
                                <Box
                                    key={currency}
                                    sx={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems: "center",
                                    }}
                                >
                                    <Typography variant="body2">
                                        {currency}
                                    </Typography>

                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Typography variant="body2">
                                            {value}
                                        </Typography>

                                        <MovementIndicator
                                            currency={currency}
                                            direction={
                                                directions[currency] ??
                                                "unchanged"
                                            }
                                        />
                                    </Box>
                                </Box>
                            );
                        })}
                    </Stack>
                </>
            )}
        </Box>
    );
}