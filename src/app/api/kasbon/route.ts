import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List user's kasbon history
export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const kasbons = await prisma.kasbon.findMany({
            where: {
                userId: session.user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Convert BigInt to string for JSON serialization
        const serializedKasbons = kasbons.map((kasbon) => ({
            ...kasbon,
            amount: kasbon.amount.toString(),
        }));

        return NextResponse.json(serializedKasbons);
    } catch (error) {
        console.error("Error fetching kasbons:", error);
        return NextResponse.json({ error: "Failed to fetch kasbon history" }, { status: 500 });
    }
}

// POST - Create new kasbon request
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await request.json();
        const { amount, note } = data;

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // Check if user has pending commission
        const commission = await prisma.commission.findUnique({
            where: { userId: session.user.id },
        });

        const pendingCommission = commission?.pendingCommission || BigInt(0);
        const requestedAmount = BigInt(amount);

        if (requestedAmount > pendingCommission) {
            return NextResponse.json(
                { error: "Kasbon amount exceeds pending commission" },
                { status: 400 }
            );
        }

        // Check for existing active kasbon requests
        const existingRequest = await prisma.kasbon.findFirst({
            where: {
                userId: session.user.id,
                status: { in: ["REQUESTED", "PENDING"] },
            },
        });

        if (existingRequest) {
            return NextResponse.json(
                { error: "You already have an active kasbon request" },
                { status: 400 }
            );
        }

        // Create kasbon request
        const kasbon = await prisma.kasbon.create({
            data: {
                userId: session.user.id,
                amount: requestedAmount,
                note: note || null,
                status: "REQUESTED",
            },
        });

        return NextResponse.json({
            ...kasbon,
            amount: kasbon.amount.toString(),
        });
    } catch (error) {
        console.error("Error creating kasbon:", error);
        return NextResponse.json({ error: "Failed to create kasbon request" }, { status: 500 });
    }
}
