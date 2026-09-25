import { Card, CardContent, Typography } from "@mui/material";

import { formatMoney } from "@/lib/money/format-money";
import { MEDIA_QUERY_BREAKPOINTS } from "@/layout/constants/media-query-breakpoints";
import type { Balance } from "@/types/wallet";

interface BalanceItemProps {
    balance: Balance;
}

const TILE_MEDIA_QUERY = `@media ${MEDIA_QUERY_BREAKPOINTS.fromMd}`;

export default function BalanceItem({
    balance,
}: BalanceItemProps) {
    return (
        <Card
            sx={{
                [TILE_MEDIA_QUERY]: {
                    aspectRatio: "1 / 1",
                },
            }}
        >
            <CardContent
                sx={{
                    [TILE_MEDIA_QUERY]: {
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                    },
                }}
            >
                <Typography variant="body2">
                    {balance.currency}
                </Typography>

                <Typography variant="h5">
                    {formatMoney(balance.amount, balance.currency)}
                </Typography>
            </CardContent>
        </Card>
    );
}