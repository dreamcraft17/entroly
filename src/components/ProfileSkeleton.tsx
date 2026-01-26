import React from "react";

/**
 * Skeleton loading UI for profile pages.
 * Matches the layout of ProfileRenderer for seamless transitions.
 */
export function ProfileSkeleton() {
    return (
        <main className="min-h-screen flex flex-col items-center py-16 px-4 bg-slate-950 animate-pulse">
            <div className="w-full max-w-[680px] space-y-8">
                {/* Profile Header Skeleton */}
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="h-24 w-24 rounded-full bg-slate-800" />
                    </div>

                    {/* Name and username */}
                    <div className="space-y-2">
                        <div className="h-8 w-48 bg-slate-800 rounded-lg mx-auto" />
                        <div className="h-5 w-32 bg-slate-800 rounded-lg mx-auto" />
                        <div className="h-4 w-64 bg-slate-800 rounded-lg mx-auto mt-2" />
                    </div>

                    {/* Social icons */}
                    <div className="flex justify-center gap-6 mt-6">
                        <div className="w-8 h-8 rounded-full bg-slate-800" />
                        <div className="w-8 h-8 rounded-full bg-slate-800" />
                        <div className="w-8 h-8 rounded-full bg-slate-800" />
                    </div>
                </div>

                {/* Link Cards Skeleton */}
                <div className="space-y-4 w-full">
                    <div className="h-14 w-full bg-slate-800 rounded-xl" />
                    <div className="h-14 w-full bg-slate-800 rounded-xl" />
                    <div className="h-14 w-full bg-slate-800 rounded-xl" />
                    <div className="h-14 w-full bg-slate-800 rounded-xl" />
                </div>

                {/* Footer */}
                <div className="pt-8 text-center">
                    <div className="h-4 w-36 bg-slate-800 rounded-lg mx-auto" />
                </div>
            </div>
        </main>
    );
}
