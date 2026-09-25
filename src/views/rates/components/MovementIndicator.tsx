import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import RemoveRoundedIcon from "@mui/icons-material/RemoveRounded";
import { Box, Tooltip } from "@mui/material";
import type { ReactNode } from "react";

import type { CurrencyCode } from "@/types/wallet";
import type { RateDirection } from "../helpers/get-rate-direction";

interface MovementIndicatorProps {
    currency: CurrencyCode;
    direction: RateDirection;
}

export default function MovementIndicator({
    currency,
    direction,
}: MovementIndicatorProps) {
    let label = `${currency} rate unchanged`;

    if (direction === "up") {
        label = `${currency} rate increased`;
    } else if (direction === "down") {
        label = `${currency} rate decreased`;
    }

    let icon: ReactNode;

    if (direction === "up") {
        icon = (
            <ArrowUpwardRoundedIcon
                fontSize="small"
                color="success"
            />
        );
    } else if (direction === "down") {
        icon = (
            <ArrowDownwardRoundedIcon
                fontSize="small"
                color="error"
            />
        );
    } else {
        icon = (
            <RemoveRoundedIcon
                fontSize="small"
                color="disabled"
            />
        );
    }

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
                {icon}
            </Box>
        </Tooltip>
    );
}