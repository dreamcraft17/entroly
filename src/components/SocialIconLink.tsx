"use client";

import React, { useState } from "react";

interface SocialIconLinkProps {
    id: string;
    title: string;
    url: string;
    thumbnail?: string | null;
    icon?: string | null;
    accentColor: string;
}

/**
 * Client Component for social icon links with:
 * - Favicon fetching from Google
 * - Error fallback to letter initial
 * - Hover animations
 */
export function SocialIconLink({
    id,
    title,
    url,
    thumbnail,
    icon,
    accentColor,
}: SocialIconLinkProps) {
    const [hasError, setHasError] = useState(false);

    // Try to get favicon URL from the link's domain
    let faviconUrl = "";
    try {
        const domain = new URL(url).hostname;
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
        faviconUrl = "";
    }

    // Priority: thumbnail > icon URL > favicon > letter fallback
    const iconSrc = thumbnail || (icon?.startsWith("http") ? icon : faviconUrl);
    const showImage = iconSrc && !hasError;

    return (
        <a
            key={id}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
            style={{ color: accentColor }}
            title={title}
        >
            {showImage ? (
                <img
                    src={iconSrc}
                    alt={title}
                    className="w-6 h-6 object-contain"
                    onError={() => setHasError(true)}
                />
            ) : (
                <div
                    className="w-8 h-8 rounded-full border border-current flex items-center justify-center"
                >
                    <span className="text-xs font-bold">{title.charAt(0)}</span>
                </div>
            )}
        </a>
    );
}
