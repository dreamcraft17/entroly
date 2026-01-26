import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getProfile } from "@/actions/profile";
import { getAIGeneratedPage } from "@/actions/ai-page";
import { Metadata } from "next";
import { ProfileRenderer } from "@/components/ProfileRenderer";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";
import { AIPageView } from "@/components/ai/AIPageView";

// Enable ISR with 60-second revalidation
export const revalidate = 60;

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;

  // Parallel fetch both profile and AI page
  const [profile, aiPage] = await Promise.all([
    getProfile(username),
    getAIGeneratedPage(username)
  ]);

  if (profile) {
    return {
      title: `${profile.displayName} (@${profile.username}) | Entro.ly`,
      description: profile.bio || "",
    };
  }

  if (aiPage) {
    return {
      title: `${username} | Entro.ly`,
      description: aiPage.prompt.substring(0, 160),
    };
  }

  return {
    title: "Profile Not Found",
  };
}

interface SearchParams {
  highlight?: string;
}

/**
 * Public Profile Page with Suspense streaming.
 * 
 * Architecture:
 * - Suspense boundary wraps async ProfileContent for streaming
 * - ProfileRenderer is a Server Component (minimal client JS)
 * - AIPageView is a Client Component wrapper for the iframe-based AI renderer
 */
export default async function PublicProfilePage({
  params,
  searchParams
}: {
  params: Promise<{ username: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { username } = await params;
  const { highlight } = await searchParams;

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent username={username} highlight={highlight} />
    </Suspense>
  );
}

/**
 * Async component that fetches and renders profile data.
 * Wrapped in Suspense for streaming.
 */
async function ProfileContent({
  username,
  highlight
}: {
  username: string;
  highlight?: string;
}) {
  // Parallel fetch both profile and AI page
  // Thanks to React cache(), these will reuse the results from generateMetadata
  const [profile, aiPage] = await Promise.all([
    getProfile(username),
    getAIGeneratedPage(username)
  ]);

  if (profile) {
    // Render regular profile (Server Component)
    return <ProfileRenderer profile={profile} highlight={highlight} />;
  }

  if (aiPage && aiPage.isPublished) {
    // Render AI-generated page (Client Component with iframe)
    return <AIPageView html={aiPage.generatedHtml} />;
  }

  // Neither found
  notFound();
}
