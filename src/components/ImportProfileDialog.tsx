"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Download, Loader2, Check, AlertCircle, Link2, ExternalLink } from "lucide-react";

interface ImportedLink {
    title: string;
    url: string;
    icon: string;
}

interface ImportedProfile {
    displayName: string;
    bio: string;
    avatarUrl: string;
    links: ImportedLink[];
    source: 'linktree' | 'beacons' | 'unknown';
}

interface ImportProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onImport: (profile: ImportedProfile) => void;
}

export function ImportProfileDialog({ isOpen, onClose, onImport }: ImportProfileDialogProps) {
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [importedProfile, setImportedProfile] = useState<ImportedProfile | null>(null);

    if (!isOpen) return null;

    const handleImport = async () => {
        if (!url.trim()) {
            setError("Please enter a URL");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/import-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to import profile");
            }

            setImportedProfile(data.profile);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to import profile");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmImport = () => {
        if (importedProfile) {
            onImport(importedProfile);
            handleClose();
        }
    };

    const handleClose = () => {
        setUrl("");
        setError(null);
        setImportedProfile(null);
        onClose();
    };

    const getSourceLabel = (source: string) => {
        switch (source) {
            case 'linktree': return 'Linktree';
            case 'beacons': return 'Beacons.ai';
            default: return 'Profile';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Dialog */}
            <div
                className="relative w-full max-w-lg mx-4 rounded-xl shadow-2xl border max-h-[85vh] overflow-hidden flex flex-col"
                style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                            <Download className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                Import Profile
                            </h3>
                            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                Import from Linktree or Beacons.ai
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 overflow-y-auto flex-1">
                    {!importedProfile ? (
                        <>
                            {/* URL Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                                    Profile URL
                                </label>
                                <div className="relative">
                                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                                    <Input
                                        value={url}
                                        onChange={(e) => {
                                            setUrl(e.target.value);
                                            setError(null);
                                        }}
                                        placeholder="https://linktr.ee/username or https://beacons.ai/username"
                                        className="pl-10"
                                        style={{
                                            backgroundColor: 'var(--color-bg-tertiary)',
                                            borderColor: error ? '#ef4444' : 'var(--color-border)',
                                            color: 'var(--color-text-primary)'
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleImport();
                                            }
                                        }}
                                    />
                                </div>
                                {error && (
                                    <div className="flex items-center gap-2 text-sm text-red-400">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Supported Platforms */}
                            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                                <p className="text-xs font-medium mb-3" style={{ color: 'var(--color-text-tertiary)' }}>
                                    Supported Platforms
                                </p>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-[#43E660] flex items-center justify-center">
                                            <span className="text-black font-bold text-sm">L</span>
                                        </div>
                                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Linktree</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                                            <span className="text-white font-bold text-sm">B</span>
                                        </div>
                                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Beacons.ai</span>
                                    </div>
                                </div>
                            </div>

                            {/* How it works */}
                            <div className="space-y-2">
                                <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                                    How it works
                                </p>
                                <ol className="text-sm space-y-1" style={{ color: 'var(--color-text-secondary)' }}>
                                    <li>1. Paste your Linktree or Beacons.ai profile URL</li>
                                    <li>2. We&apos;ll extract your profile info and links</li>
                                    <li>3. Review and edit before creating your Entro.ly</li>
                                </ol>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Import Preview */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm text-emerald-300">
                                    Successfully imported from {getSourceLabel(importedProfile.source)}
                                </span>
                            </div>

                            {/* Profile Preview */}
                            <div className="space-y-4">
                                {/* Avatar & Name */}
                                <div className="flex items-center gap-4">
                                    {importedProfile.avatarUrl ? (
                                        <img
                                            src={importedProfile.avatarUrl}
                                            alt="Profile"
                                            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                                            <span className="text-2xl font-bold text-white">
                                                {importedProfile.displayName?.[0]?.toUpperCase() || '?'}
                                            </span>
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-lg" style={{ color: 'var(--color-text-primary)' }}>
                                            {importedProfile.displayName || 'No name found'}
                                        </h4>
                                        {importedProfile.bio && (
                                            <p className="text-sm line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                                                {importedProfile.bio}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Links Preview */}
                                {importedProfile.links.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
                                            {importedProfile.links.length} Links Found
                                        </p>
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {importedProfile.links.map((link, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-3 rounded-lg"
                                                    style={{ backgroundColor: 'var(--color-bg-tertiary)' }}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-tertiary)' }} />
                                                        <div className="min-w-0">
                                                            <p className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                                                                {link.title}
                                                            </p>
                                                            <p className="text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                                                                {link.url}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    {!importedProfile ? (
                        <>
                            <Button variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button
                                onClick={handleImport}
                                disabled={isLoading || !url.trim()}
                                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        Import Profile
                                    </>
                                )}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setImportedProfile(null);
                                    setUrl("");
                                }}
                            >
                                Import Different
                            </Button>
                            <Button
                                onClick={handleConfirmImport}
                                className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Use This Profile
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
