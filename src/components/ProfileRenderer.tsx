import React from "react";
import Link from "next/link";
import { Profile, Link as LinkType } from "@/types";
import { LinkCard } from "@/components/LinkCard";
import { SocialProfileCard } from "@/components/SocialProfileCard";
import { ProfileAvatar } from "@/components/ProfileAvatar";
import { SocialIconLink } from "@/components/SocialIconLink";

interface ProfileRendererProps {
    profile: Profile;
    highlight?: string;
    previewMode?: boolean; // If true, disable some interactive features or links
}

/**
 * Server Component for rendering profile pages.
 * Uses Client Component islands (ProfileAvatar, SocialIconLink) for interactivity.
 */
export function ProfileRenderer({
    profile,
    highlight,
    previewMode = false
}: ProfileRendererProps) {
    const getBackgroundStyle = (): React.CSSProperties => {
        if (profile.backgroundType === "gradient" && profile.backgroundGradient) {
            return { background: profile.backgroundGradient };
        }
        if (profile.backgroundType === "image" && profile.backgroundImage) {
            return {
                backgroundImage: `url(${profile.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            };
        }
        return { backgroundColor: profile.backgroundColor };
    };

    const fontFamilyClass = profile.fontFamily === "Space Grotesk"
        ? "font-display"
        : profile.fontFamily === "Inter"
            ? "font-sans"
            : "";

    // Split links into types
    const socialLinks = profile.links.filter(l => l.type === 'icon');
    const standardLinks = profile.links.filter(l => l.type !== 'icon');

    return (
        <main
            className={`min-h-screen flex flex-col items-center py-16 px-4 ${fontFamilyClass}`}
            style={getBackgroundStyle()}
        >
            <div className="w-full max-w-[680px] space-y-8">
                {/* Profile Header */}
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* Avatar - Client Component for image optimization */}
                    <ProfileAvatar
                        avatarUrl={profile.avatarUrl}
                        displayName={profile.displayName}
                        avatarBorderColor={profile.avatarBorderColor}
                        avatarBorderWidth={profile.avatarBorderWidth}
                        profileAccentColor={profile.profileAccentColor}
                    />

                    <div className="space-y-2">
                        <h1
                            className="text-2xl font-bold tracking-tight"
                            style={{ color: profile.profileTextColor }}
                        >
                            {profile.displayName}
                        </h1>
                        <p
                            className="font-medium"
                            style={{ color: profile.profileAccentColor }}
                        >
                            @{profile.username}
                        </p>
                        {profile.bio && (
                            <p
                                className="max-w-xs mx-auto leading-relaxed"
                                style={{ color: profile.profileBioColor }}
                            >
                                {profile.bio}
                            </p>
                        )}

                        {/* Social Icons Row - Client Components for error handling */}
                        {socialLinks.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-6 mt-6">
                                {socialLinks
                                    .filter(l => l.enabled !== false)
                                    .map(link => (
                                        <SocialIconLink
                                            key={link.id}
                                            id={link.id}
                                            title={link.title}
                                            url={link.url}
                                            thumbnail={link.thumbnail}
                                            icon={link.icon}
                                            accentColor={profile.profileAccentColor}
                                        />
                                    ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Standard Links List (Buttons) */}
                <div className="space-y-4 w-full">
                    {standardLinks
                        .filter((link) => link.enabled !== undefined ? link.enabled : true)
                        .map((link) => {
                            const url = link.url.toLowerCase();
                            const isInstagram = url.includes("instagram.com") && !url.includes("/p/");
                            const isTikTok = url.includes("tiktok.com") && !url.includes("/video/");

                            if (isInstagram || isTikTok) {
                                const cleanUrl = link.url.replace(/\/$/, "");
                                const username = cleanUrl.split("/").pop()?.replace("@", "") || "user";
                                return (
                                    <SocialProfileCard
                                        key={link.id}
                                        platform={isInstagram ? "instagram" : "tiktok"}
                                        username={username}
                                        url={link.url}
                                    />
                                );
                            }

                            return (
                                <LinkCard key={link.id} link={link} profile={profile} highlightId={highlight} />
                            );
                        })}
                </div>

                {/* Footer */}
                <div className="pt-8 text-center">
                    <Link
                        href="/"
                        className="text-xs font-medium opacity-50 hover:opacity-100 transition-opacity uppercase tracking-widest"
                        style={{ color: profile.profileBioColor }}
                    >
                        Powered by Entroly
                    </Link>
                </div>
            </div>
        </main>
    );
}
