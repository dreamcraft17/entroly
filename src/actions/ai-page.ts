"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { aiPageCache } from "@/lib/profile-cache";

// Internal function that fetches from database
async function fetchAIGeneratedPageFromDb(slug: string) {
    try {
        const page = await prisma.aIGeneratedPage.findUnique({
            where: { slug },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return page;
    } catch (error) {
        console.error("Failed to fetch AI generated page:", error);
        return null;
    }
}

// Cached version with 60-second revalidation
const getCachedAIGeneratedPage = unstable_cache(
    async (slug: string) => fetchAIGeneratedPageFromDb(slug),
    ["ai-page"],
    { revalidate: 60, tags: ["ai-page"] }
);

/**
 * Get an AI-generated page by its slug
 * Wrapped with React cache() for request-level deduplication
 */
export const getAIGeneratedPage = cache(async (slug: string) => {
    // Check in-memory cache first (fastest)
    const memCached = aiPageCache.get<Awaited<ReturnType<typeof getCachedAIGeneratedPage>>>(slug);
    if (memCached) {
        return memCached;
    }

    // Fall back to unstable_cache + database
    const page = await getCachedAIGeneratedPage(slug);

    // Store in memory cache for future requests
    if (page) {
        aiPageCache.set(slug, page);
    }

    return page;
});

/**
 * Check if a slug is available (not taken by Profile or AIGeneratedPage)
 */
export async function checkSlugAvailable(slug: string): Promise<boolean> {
    try {
        // Check profiles
        const existingProfile = await prisma.profile.findUnique({
            where: { username: slug },
        });

        if (existingProfile) {
            return false;
        }

        // Check AI pages
        const existingAIPage = await prisma.aIGeneratedPage.findUnique({
            where: { slug },
        });

        return !existingAIPage;
    } catch (error) {
        console.error("Failed to check slug availability:", error);
        return false;
    }
}

/**
 * Get all AI-generated pages for the current user
 */
export async function getUserAIPages() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return [];
        }

        const pages = await prisma.aIGeneratedPage.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: "desc" },
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

        return pages;
    } catch (error) {
        console.error("Failed to fetch user AI pages:", error);
        return [];
    }
}

/**
 * Delete an AI-generated page
 */
export async function deleteAIGeneratedPage(id: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" };
        }

        // Verify ownership
        const page = await prisma.aIGeneratedPage.findUnique({
            where: { id },
        });

        if (!page) {
            return { success: false, error: "Page not found" };
        }

        if (page.userId !== session.user.id) {
            return { success: false, error: "You don't have permission to delete this page" };
        }

        await prisma.aIGeneratedPage.delete({
            where: { id },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to delete AI page:", error);
        return { success: false, error: "Failed to delete page" };
    }
}
