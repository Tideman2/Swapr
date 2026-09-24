import { NextResponse } from "next/server";
import { getBalances } from "@/server/services/wallet";

export async function GET(): Promise<NextResponse> {
    try {
        const balances = await getBalances();

        return NextResponse.json(balances, {
            status: 200,
        });
    } catch {
        return NextResponse.json(
            {
                error: {
                    code: "BALANCES_FETCH_FAILED",
                    message: "Unable to retrieve wallet balances.",
                },
            },
            {
                status: 500,
            },
        );
    }
}