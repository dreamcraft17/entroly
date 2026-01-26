import React from "react";
import Image from "next/image";
import Script from "next/script";

interface SocialProfileCardProps {
  platform: "instagram" | "tiktok";
  username: string;
  url: string;
}

// Mock data generator for Instagram since official profile embeds are not supported
const getInstagramStats = (username: string) => {
  // Deterministic pseudo-random numbers based on username length
  const seed = username.length;
  
  return {
    posts: 42 + seed * 2,
    followers: `${(1.2 + seed / 10).toFixed(1)}k`,
    following: 200 + seed * 5,
    displayName: username,
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`,
  };
};

export function SocialProfileCard({ platform, username, url }: SocialProfileCardProps) {
  if (platform === "tiktok") {
    return (
      <div className="w-full flex justify-center bg-white/5 rounded-xl overflow-hidden">
        <blockquote
          className="tiktok-embed"
          cite={`https://www.tiktok.com/@${username}`}
          data-unique-id={username}
          data-embed-type="creator"
          style={{ maxWidth: "780px", minWidth: "288px", margin: 0 }}
        >
          <section>
            <a
              target="_blank"
              href={`https://www.tiktok.com/@${username}?refer=creator_embed`}
            >
              @{username}
            </a>
          </section>
        </blockquote>
        <Script src="https://www.tiktok.com/embed.js" strategy="lazyOnload" />
      </div>
    );
  }

  // Instagram Custom Card
  const stats = getInstagramStats(username);

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all duration-300 group">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 rounded-full border-2 border-white/10 overflow-hidden">
              <Image
                src={stats.avatar}
                alt={stats.displayName}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-50">{stats.displayName}</h3>
              <p className="text-slate-400 text-sm">@{username}</p>
            </div>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-sm font-medium transition-colors bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
          >
            Follow
          </a>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center border-t border-white/5 pt-4">
          <div>
            <p className="font-bold text-slate-50">{stats.posts}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Posts</p>
          </div>
          <div>
            <p className="font-bold text-slate-50">{stats.followers}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Followers</p>
          </div>
          <div>
            <p className="font-bold text-slate-50">{stats.following}</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Following</p>
          </div>
        </div>
      </div>
      
      {/* Decorative bottom bar */}
      <div className="h-1 w-full bg-gradient-to-r from-yellow-400 via-red-500 to-purple-500" />
    </div>
  );
}
