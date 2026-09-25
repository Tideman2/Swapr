import { NextResponse, NextRequest } from "next/server";

import {
    getRates,
    InvalidCurrencyError,
} from "@/server/services/rate";
import { simulateNetworkDelay, shouldSimulateRateFailure } from "@/server/helpers";

export async function GET(
    request: Request
): Promise<NextResponse> {
    await simulateNetworkDelay()

    const { searchParams } = new URL(request.url);
    const base = searchParams.get("base");

    if (!base) {
        return NextResponse.json(
            {
                error: {
                    code: "MISSING_BASE_CURRENCY",
                    message: "The base currency is required.",
                },
            },
            { status: 400 }
        );
    }

    try {

        if (shouldSimulateRateFailure()) {
            return NextResponse.json(
                {
                    error: {
                        code: "RATE_SERVICE_UNAVAILABLE",
                        message: "Rate service is temporarily unavailable.",
                    },
                },
                { status: 503 }
            );
        }

        const rates = await getRates(base);

        return NextResponse.json(rates, {
            status: 200,
        });
    } catch (error) {
        if (error instanceof InvalidCurrencyError) {
            return NextResponse.json(
                {
                    error: {
                        code: "INVALID_BASE_CURRENCY",
                        message: error.message,
                    },
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
            {
                error: {
                    code: "RATES_FETCH_FAILED",
                    message: "Unable to retrieve exchange rates.",
                },
            },
            { status: 500 }
        );
    }
}