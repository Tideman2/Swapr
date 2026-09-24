"use client";

import { Card, CardContent, Grid, Skeleton, Stack } from "@mui/material";

import { MEDIA_QUERY_BREAKPOINTS } from "@/layout/constants/media-query-breakpoints";
import { useMediaQuery } from "@/layout/hooks/useMediaQuery";

interface BalanceListSkeletonProps {
    count?: number;
}

const TILE_MEDIA_QUERY = `@media ${MEDIA_QUERY_BREAKPOINTS.fromMd}`;

export default function BalanceListSkeleton({
    count = 4,
}: BalanceListSkeletonProps) {
    const isTabletAndUp = useMediaQuery("fromMd");

    const items = Array.from({ length: count }, (_, index) => index);

    const tile = (
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
                        gap: 1,
                    },
                }}
            >
                <Skeleton variant="text" width="30%" />
                <Skeleton variant="text" width="55%" />
            </CardContent>
        </Card>
    );

    if (!isTabletAndUp) {
        return (
            <Stack spacing={2}>
                {items.map((index) => (
                    <div key={index}>{tile}</div>
                ))}
            </Stack>
        );
    }

    return (
        <Grid
            container
            spacing={2}
        >
            {items.map((index) => (
                <Grid
                    key={index}
                    size={{ md: 6, lg: 4, xl: 3 }}
                >
                    {tile}
                </Grid>
            ))}
        </Grid>
    );
}