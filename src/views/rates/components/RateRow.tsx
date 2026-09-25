import { Box, Typography } from "@mui/material";

import type { CurrencyCode } from "@/types/wallet";
import type { RateDirection } from "../helpers/get-rate-direction";

import MovementIndicator from "./MovementIndicator";

interface RateRowProps {
    currency: CurrencyCode;
    value: string;
    direction: RateDirection;
}

export default function RateRow({
    currency,
    value,
    direction,
}: RateRowProps) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
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
                    direction={direction}
                />
            </Box>
        </Box>
    );
}