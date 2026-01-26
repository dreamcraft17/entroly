"use client";

import dynamic from "next/dynamic";
import { ProfileSkeleton } from "@/components/ProfileSkeleton";

/**
 * Client Component wrapper for AIPageRenderer.
 * Required because next/dynamic with ssr: false only works in Client Components.
 */
const AIPageRendererDynamic = dynamic(
    () => import("@/components/ai/AIPageRenderer").then(m => m.AIPageRenderer),
    {
        ssr: false,
        loading: () => <ProfileSkeleton />
    }
);

interface AIPageViewProps {
    html: string;
}

export function AIPageView({ html }: AIPageViewProps) {
    return <AIPageRendererDynamic html={html} />;
}
