import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch commission for the current user
        const commission = await prisma.commission.findUnique({
            where: {
                userId: session.user.id,
            },
        });

        // Return commission data or default zeros
        return NextResponse.json({
            paidCommission: commission?.paidCommission?.toString() || "0",
            pendingCommission: commission?.pendingCommission?.toString() || "0",
            updatedAt: commission?.updatedAt || null,
        });
    } catch (error) {
        console.error("Error fetching commission:", error);
        return NextResponse.json({ error: "Failed to fetch commission" }, { status: 500 });
    }
}
