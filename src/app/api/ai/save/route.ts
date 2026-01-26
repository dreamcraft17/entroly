import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const {
            slug,
            generatedHtml,
            generatedCss,  // CSS content for cloned pages
            prompt,
            profession,
            style,
            colorScheme,
            isPublished = false,
            sourceType = 'generated',  // 'clone' | 'generated'
            sourceUrl,  // Original URL for cloned pages
        } = body;

        if (!slug || !generatedHtml) {
            return NextResponse.json(
                { error: 'Missing required fields (slug and generatedHtml are required)' },
                { status: 400 }
            );
        }

        // Check if slug is available (not taken by Profile or AIGeneratedPage)
        const existingProfile = await prisma.profile.findUnique({
            where: { username: slug },
        });

        if (existingProfile) {
            return NextResponse.json(
                { error: 'This URL is already taken by a profile' },
                { status: 409 }
            );
        }

        // Check for existing AI page with same slug (for update)
        const existingAIPage = await prisma.aIGeneratedPage.findUnique({
            where: { slug },
        });

        let savedPage;

        if (existingAIPage) {
            // Update existing page (must be owned by current user)
            if (existingAIPage.userId !== session.user.id) {
                return NextResponse.json(
                    { error: 'You do not have permission to edit this page' },
                    { status: 403 }
                );
            }

            savedPage = await prisma.aIGeneratedPage.update({
                where: { slug },
                data: {
                    generatedHtml,
                    generatedCss,
                    prompt,
                    profession,
                    style,
                    colorScheme,
                    isPublished,
                    sourceType,
                    sourceUrl,
                },
            });
        } else {
            // Create new page
            savedPage = await prisma.aIGeneratedPage.create({
                data: {
                    userId: session.user.id,
                    slug,
                    generatedHtml,
                    generatedCss,
                    prompt,
                    profession,
                    style,
                    colorScheme,
                    isPublished,
                    sourceType,
                    sourceUrl,
                },
            });
        }

        return NextResponse.json({
            success: true,
            page: {
                id: savedPage.id,
                slug: savedPage.slug,
                isPublished: savedPage.isPublished,
            },
        });
    } catch (error) {
        console.error('AI Save Error:', error);
        return NextResponse.json(
            { error: 'Failed to save page' },
            { status: 500 }
        );
    }
}
