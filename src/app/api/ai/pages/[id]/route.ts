import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/ai/pages/[id] - Get a single AI page by ID
export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await props.params;

        const page = await prisma.aIGeneratedPage.findUnique({
            where: { id },
        });

        if (!page) {
            return NextResponse.json(
                { error: 'Page not found' },
                { status: 404 }
            );
        }

        // Check ownership
        if (page.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'You do not have permission to view this page' },
                { status: 403 }
            );
        }

        return NextResponse.json(page);
    } catch (error) {
        console.error('AI Page Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch page' },
            { status: 500 }
        );
    }
}

// DELETE /api/ai/pages/[id] - Delete an AI page
export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { id } = await props.params;

        const page = await prisma.aIGeneratedPage.findUnique({
            where: { id },
        });

        if (!page) {
            return NextResponse.json(
                { error: 'Page not found' },
                { status: 404 }
            );
        }

        // Check ownership
        if (page.userId !== session.user.id) {
            return NextResponse.json(
                { error: 'You do not have permission to delete this page' },
                { status: 403 }
            );
        }

        await prisma.aIGeneratedPage.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('AI Page Delete Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete page' },
            { status: 500 }
        );
    }
}
