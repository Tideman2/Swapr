import { Chip, Stack, Typography } from "@mui/material";

import { formatLastUpdated } from "../helpers/format-last-updated";

interface RateStatusProps {
    timestamp: string;
    now: number;
    isStale: boolean;
    isFetching: boolean;
    isError: boolean;
    isMobile: boolean;
}

export default function RateStatus({
    timestamp,
    now,
    isStale,
    isFetching,
    isError,
    isMobile,
}: RateStatusProps) {
    return (
        <Stack
            direction={isMobile ? "column" : "row"}
            spacing={1}
            sx={{
                mt: 2,
                mb: 2,
                alignItems: isMobile
                    ? "flex-start"
                    : "center",
            }}
        >
            <Typography
                variant="body2"
                color="text.secondary"
            >
                Last updated{" "}
                {formatLastUpdated(timestamp, now)}
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
    );
}