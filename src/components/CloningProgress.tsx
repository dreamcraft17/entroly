"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Globe, Palette, Image, Sparkles, Check } from "lucide-react";

interface CloningProgressProps {
    isVisible: boolean;
    sourceUrl: string;
}

const STAGES = [
    { id: 'launching', label: 'Launching browser', icon: Globe, duration: 3 },
    { id: 'loading', label: 'Loading profile', icon: Globe, duration: 8 },
    { id: 'capturing', label: 'Capturing styles', icon: Palette, duration: 10 },
    { id: 'processing', label: 'Processing images', icon: Image, duration: 6 },
    { id: 'finalizing', label: 'Finalizing', icon: Sparkles, duration: 3 },
];

const TOTAL_DURATION = STAGES.reduce((sum, stage) => sum + stage.duration, 0);

export function CloningProgress({ isVisible, sourceUrl }: CloningProgressProps) {
    const [currentStage, setCurrentStage] = useState(0);
    const [stageProgress, setStageProgress] = useState(0);
    const [countdown, setCountdown] = useState(TOTAL_DURATION);
    const [startTime, setStartTime] = useState(Date.now());

    useEffect(() => {
        if (!isVisible) {
            setCurrentStage(0);
            setStageProgress(0);
            setCountdown(TOTAL_DURATION);
            return;
        }

        // Reset start time when becoming visible
        setStartTime(Date.now());
    }, [isVisible]);

    useEffect(() => {
        if (!isVisible) return;

        // Countdown timer
        const countdownInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const remaining = Math.max(0, TOTAL_DURATION - elapsed);
            setCountdown(remaining);
        }, 1000);

        // Stage progression
        let stageStartTime = Date.now();
        let currentStageIndex = 0;

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - stageStartTime;
            const currentStageDuration = STAGES[currentStageIndex].duration * 1000;
            const progress = Math.min(100, (elapsed / currentStageDuration) * 100);

            setStageProgress(progress);

            if (elapsed >= currentStageDuration && currentStageIndex < STAGES.length - 1) {
                currentStageIndex++;
                setCurrentStage(currentStageIndex);
                stageStartTime = Date.now();
                setStageProgress(0);
            }
        }, 50);

        return () => {
            clearInterval(countdownInterval);
            clearInterval(progressInterval);
        };
    }, [isVisible, startTime]);

    if (!isVisible) return null;

    // Extract username from URL for display
    const username = sourceUrl.match(/linktr\.ee\/([^/?#]+)/i)?.[1] || 'profile';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Semi-transparent backdrop - keeps page visible */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                style={{ backdropFilter: 'blur(4px)' }}
            />

            {/* Popup Modal */}
            <div
                className="relative z-10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
                style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    border: '1px solid var(--color-border)'
                }}
            >
                {/* Gradient header bar */}
                <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />

                {/* Content */}
                <div className="p-6">
                    {/* Header row with timer */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center animate-pulse">
                                <Globe className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                    Cloning Profile
                                </h3>
                                <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                    @{username}
                                </p>
                            </div>
                        </div>

                        {/* Compact countdown */}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                            <div className="relative w-5 h-5">
                                <svg className="w-full h-full -rotate-90" viewBox="0 0 20 20">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="8"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="text-cyan-500/20"
                                    />
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="8"
                                        fill="none"
                                        stroke="url(#popupGradient)"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeDasharray={`${((TOTAL_DURATION - countdown) / TOTAL_DURATION) * 50} 50`}
                                        className="transition-all duration-1000"
                                    />
                                    <defs>
                                        <linearGradient id="popupGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stopColor="#06b6d4" />
                                            <stop offset="100%" stopColor="#a855f7" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <span className="text-sm font-medium tabular-nums text-cyan-400">
                                {countdown}s
                            </span>
                        </div>
                    </div>

                    {/* Progress Stages - Compact list */}
                    <div className="space-y-2">
                        {STAGES.map((stage, index) => {
                            const StageIcon = stage.icon;
                            const isActive = index === currentStage;
                            const isComplete = index < currentStage;

                            return (
                                <div
                                    key={stage.id}
                                    className={`flex items-center gap-3 p-2.5 rounded-lg transition-all duration-300 ${isActive ? 'bg-cyan-500/10' :
                                            isComplete ? 'bg-emerald-500/5' :
                                                'opacity-50'
                                        }`}
                                    style={{
                                        border: isActive ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent'
                                    }}
                                >
                                    {/* Icon */}
                                    <div className={`flex items-center justify-center w-6 h-6 rounded-md ${isComplete ? 'bg-emerald-500' :
                                            isActive ? 'bg-cyan-500' :
                                                'bg-slate-600'
                                        }`}>
                                        {isComplete ? (
                                            <Check className="w-3.5 h-3.5 text-white" />
                                        ) : isActive ? (
                                            <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                                        ) : (
                                            <StageIcon className="w-3.5 h-3.5 text-slate-300" />
                                        )}
                                    </div>

                                    {/* Label & Progress */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className={`text-sm ${isComplete ? 'text-emerald-400' :
                                                    isActive ? 'text-cyan-400' :
                                                        ''
                                                }`} style={{
                                                    color: !isComplete && !isActive ? 'var(--color-text-tertiary)' : undefined
                                                }}>
                                                {stage.label}
                                            </p>
                                            {isComplete && (
                                                <span className="text-xs text-emerald-400">✓</span>
                                            )}
                                        </div>

                                        {/* Progress bar for active stage */}
                                        {isActive && (
                                            <div className="mt-1.5 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                                                <div
                                                    className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-100 rounded-full"
                                                    style={{ width: `${stageProgress}%` }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <p className="text-center text-xs mt-4" style={{ color: 'var(--color-text-tertiary)' }}>
                        Please wait while we clone your profile...
                    </p>
                </div>
            </div>
        </div>
    );
}
