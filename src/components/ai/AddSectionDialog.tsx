"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Plus, Loader2, LayoutGrid, Image, MessageSquare, Link2, Users } from "lucide-react";

interface AddSectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (sectionType: string, sectionPrompt: string) => Promise<void>;
}

const SECTION_TYPES = [
    { id: 'links', label: 'Links', icon: Link2, description: 'Add more link buttons' },
    { id: 'gallery', label: 'Gallery', icon: Image, description: 'Image gallery or portfolio' },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, description: 'Customer reviews or quotes' },
    { id: 'team', label: 'Team/About', icon: Users, description: 'Team members or about section' },
    { id: 'custom', label: 'Custom', icon: LayoutGrid, description: 'Describe your own section' },
];

export function AddSectionDialog({ isOpen, onClose, onSubmit }: AddSectionDialogProps) {
    const [selectedType, setSelectedType] = useState<string>('custom');
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            await onSubmit(selectedType, prompt);
            setPrompt("");
            setSelectedType('custom');
            onClose();
        } catch (error) {
            console.error("Add section failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setPrompt("");
        setSelectedType('custom');
        onClose();
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
                className="relative w-full max-w-lg mx-4 rounded-xl shadow-2xl border"
                style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <div className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-emerald-400" />
                        <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                            Add New Section
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Section Type Selection */}
                    <div>
                        <label className="text-sm font-medium mb-3 block" style={{ color: 'var(--color-text-primary)' }}>
                            Section Type
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {SECTION_TYPES.map((type) => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className="flex flex-col items-center gap-1 p-3 rounded-lg transition-all text-center"
                                        style={{
                                            backgroundColor: selectedType === type.id ? 'rgba(16, 185, 129, 0.2)' : 'var(--color-bg-tertiary)',
                                            border: selectedType === type.id ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid var(--color-border)',
                                            color: selectedType === type.id ? '#10b981' : 'var(--color-text-secondary)'
                                        }}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-xs font-medium">{type.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Prompt Input */}
                    <div>
                        <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-primary)' }}>
                            Describe what you want
                        </label>
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder={
                                selectedType === 'links' ? "e.g., Add social media links for Twitter, Instagram, and YouTube with colorful icons..."
                                    : selectedType === 'gallery' ? "e.g., A 3-column photo gallery showcasing my recent work..."
                                        : selectedType === 'testimonials' ? "e.g., Customer testimonials in cards with star ratings..."
                                            : selectedType === 'team' ? "e.g., Team member cards with photos, names, and roles..."
                                                : "e.g., A contact form section with email and message fields..."
                            }
                            className="min-h-[100px]"
                            style={{
                                backgroundColor: 'var(--color-bg-tertiary)',
                                borderColor: 'var(--color-border)',
                                color: 'var(--color-text-primary)'
                            }}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading || !prompt.trim()}
                        className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Section
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
