import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Profile } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  return (
    <Link href={`/${profile.username}`} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full overflow-hidden border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all">
        <CardHeader className="flex flex-row items-center gap-4 pb-2">
          <div className="relative h-16 w-16 rounded-full border-2 border-emerald-500/20 bg-slate-800 overflow-hidden">
            <Image
              src={profile.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${profile.username}`}
              alt={profile.displayName}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <h3 className="truncate text-lg font-bold text-slate-100 font-space-grotesk">
              {profile.displayName}
            </h3>
            <p className="truncate text-sm text-emerald-400">@{profile.username}</p>
          </div>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-slate-400 mb-4 h-10">
            {profile.bio}
          </p>
          <div className="flex items-center text-sm font-medium text-emerald-400 group">
            View Profile 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
