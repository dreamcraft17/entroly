"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProfileAvatarProps {
    avatarUrl?: string | null;
    displayName: string;
    avatarBorderColor: string;
    avatarBorderWidth: number;
    profileAccentColor: string;
}

/**
 * Client Component for profile avatar with:
 * - next/image for LCP optimization
 * - Error fallback handling
 * - Animated gradient border
 */
export function ProfileAvatar({
    avatarUrl,
    displayName,
    avatarBorderColor,
    avatarBorderWidth,
    profileAccentColor,
}: ProfileAvatarProps) {
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative">
            {/* Gradient glow behind avatar */}
            <div
                className="absolute -inset-1 rounded-full opacity-75 blur"
                style={{
                    background: `linear-gradient(135deg, ${avatarBorderColor}, ${profileAccentColor})`
                }}
            />
            <div
                className="relative h-24 w-24 rounded-full overflow-hidden"
                style={{
                    borderWidth: `${avatarBorderWidth}px`,
                    borderColor: avatarBorderColor,
                    borderStyle: "solid",
                }}
            >
                {avatarUrl && !hasError ? (
                    <Image
                        src={avatarUrl}
                        alt={displayName}
                        width={96}
                        height={96}
                        priority // LCP optimization - avatar is above the fold
                        className="object-cover w-full h-full"
                        onError={() => setHasError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <span className="text-2xl font-bold text-slate-500">
                            {displayName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
