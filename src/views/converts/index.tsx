"use client";

import {
    Box,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography,
    Divider,
} from "@mui/material";
import { convertAmount } from "./helpers/convert-amount";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { RatesResponse } from "@/types/rate";
import { formatMoney } from "@/lib/money/format-money";

import { SUPPORTED_CURRENCIES, CurrencyCode } from "@/types/wallet";
import { Direction } from "./types";

export default function Convert() {
    const [source, setSource] = useState<CurrencyCode>("USD");
    const [target, setTarget] = useState<CurrencyCode>("NGN");

    const [sendAmount, setSendAmount] = useState("1");
    const [receiveAmount, setReceiveAmount] = useState("");

    const [direction, setDirection] =
        useState<Direction>("source-to-target");

    const {
        data,
        isLoading,
        isFetching,
        isError,
        refetch,
    } = useQuery<RatesResponse>({
        queryKey: ["live_rates", source],
        queryFn: async () => {
            const response = await fetch(
                `/api/rates?base=${source}`,
            );

            if (!response.ok) {
                throw new Error("Failed to fetch rates");
            }

            return response.json();
        },
    });
    const rate = data?.rates?.[target];

    useEffect(() => {
        if (!rate) {
            return;
        }

        if (direction === "source-to-target") {
            if (!sendAmount) {
                setReceiveAmount("");
                return;
            }

            const converted = convertAmount(
                sendAmount,
                rate,
                "source-to-target",
            );

            setReceiveAmount(converted);
        }

        if (direction === "target-to-source") {
            if (!receiveAmount) {
                setSendAmount("");
                return;
            }

            const converted = convertAmount(
                receiveAmount,
                rate,
                "target-to-source",
            );

            setSendAmount(converted);
        }
    }, [source, target, rate]);

    const filteredTarget = SUPPORTED_CURRENCIES.filter((currency) => currency != source);
    const filterdSource = SUPPORTED_CURRENCIES.filter((currency) => currency != target);

    const handleSourceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setSendAmount(value);
        setDirection("source-to-target");
        if (!value || !rate) {
            setReceiveAmount("");
            return;
        }

        const converted = convertAmount(
            value,
            rate,
            "source-to-target",
        );

        setReceiveAmount(converted);
    }

    const handleTargetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        setReceiveAmount(value);
        setDirection("target-to-source");

        if (!value || !rate) {
            setSendAmount("");
            return;
        }

        const converted = convertAmount(
            value,
            rate,
            "target-to-source",
        );

        setSendAmount(converted);
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                p: { xs: 2, sm: 3 },
                bgcolor: "background.default",
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    width: "100%",
                    maxWidth: 480,
                    p: { xs: 2.5, sm: 4 },
                    borderRadius: 3,
                }}
            >
                <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ mb: 3, fontWeight: 500 }}
                >
                    Currency converter
                </Typography>

                <Stack spacing={3}>
                    {/* Source / Send */}
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            You send
                        </Typography>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                        >
                            <TextField
                                fullWidth
                                label="Amount"
                                value={sendAmount}
                                onChange={handleSourceChange}
                                type="text"
                                slotProps={{
                                    htmlInput: {
                                        inputMode: "decimal",
                                    },
                                }}
                                sx={{ flex: 2 }}
                            />

                            <TextField
                                select
                                fullWidth
                                label="Currency"
                                value={source}
                                onChange={(event) => {
                                    setSource(event.target.value as CurrencyCode);
                                }}
                                sx={{ flex: 1, minWidth: 120 }}
                            >
                                {filterdSource.map((currency) => (
                                    <MenuItem
                                        key={currency}
                                        value={currency}
                                    >
                                        {currency}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Box>

                    <Divider>
                        <SwapHorizIcon color="action" />
                    </Divider>

                    {/* Target / Receive */}
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                        >
                            You receive
                        </Typography>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1.5}
                        >
                            <TextField
                                fullWidth
                                label="Amount"
                                value={receiveAmount}
                                onChange={handleTargetChange}
                                type="text"
                                slotProps={{
                                    htmlInput: {
                                        inputMode: "decimal",
                                    },
                                }}
                                sx={{ flex: 2 }}
                            />

                            <TextField
                                select
                                fullWidth
                                label="Currency"
                                value={target}
                                onChange={(event) => {
                                    setTarget(event.target.value as CurrencyCode);
                                }}
                                sx={{ flex: 1, minWidth: 120 }}
                            >
                                {filteredTarget.map((currency) => (
                                    <MenuItem
                                        key={currency}
                                        value={currency}
                                    >
                                        {currency}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
}