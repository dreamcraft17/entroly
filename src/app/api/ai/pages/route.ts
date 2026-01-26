import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/ai/pages - Get all AI pages for the current user
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const pages = await prisma.aIGeneratedPage.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                slug: true,
                prompt: true,
                style: true,
                colorScheme: true,
                isPublished: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(pages);
    } catch (error) {
        console.error('AI Pages Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch pages' },
            { status: 500 }
        );
    }
}
