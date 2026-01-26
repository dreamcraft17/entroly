"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Wand2, Loader2, Image, Palette, Trash2, Type, Copy, ArrowUp, ArrowDown, Sparkles } from "lucide-react";

interface ElementEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    elementHtml: string;
    onSubmit: (prompt: string) => Promise<void>;
    onDelete?: () => Promise<void>;
    onDuplicate?: () => Promise<void>;
    onMoveUp?: () => Promise<void>;
    onMoveDown?: () => Promise<void>;
    onDirectEdit?: (newHtml: string) => void;
    onGenerateImage?: (prompt: string) => Promise<string>;
}

type EditMode = "ai" | "direct" | "image";

// Detect element type from HTML
function detectElementType(html: string): {
    type: 'text' | 'heading' | 'image' | 'button' | 'link' | 'list' | 'section' | 'input' | 'other';
    tagName: string;
    textContent: string;
    attributes: Record<string, string>;
} {
    if (typeof window === 'undefined') {
        return { type: 'other', tagName: 'unknown', textContent: '', attributes: {} };
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
    const element = doc.body.firstChild?.firstChild as HTMLElement;

    if (!element) {
        return { type: 'other', tagName: 'unknown', textContent: '', attributes: {} };
    }

    const tagName = element.tagName?.toLowerCase() || 'unknown';
    const textContent = element.textContent?.trim() || '';
    const attributes: Record<string, string> = {};

    if (element.attributes) {
        for (let i = 0; i < element.attributes.length; i++) {
            const attr = element.attributes[i];
            attributes[attr.name] = attr.value;
        }
    }

    let type: 'text' | 'heading' | 'image' | 'button' | 'link' | 'list' | 'section' | 'input' | 'other' = 'other';

    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) {
        type = 'heading';
    } else if (['p', 'span', 'strong', 'em', 'b', 'i', 'label'].includes(tagName)) {
        type = 'text';
    } else if (tagName === 'img') {
        type = 'image';
    } else if (tagName === 'button' || (tagName === 'a' && element.classList?.contains('btn'))) {
        type = 'button';
    } else if (tagName === 'a') {
        type = 'link';
    } else if (['ul', 'ol', 'li'].includes(tagName)) {
        type = 'list';
    } else if (['section', 'article', 'header', 'footer', 'nav', 'aside', 'main', 'div'].includes(tagName)) {
        type = 'section';
    } else if (['input', 'textarea', 'select'].includes(tagName)) {
        type = 'input';
    }

    return { type, tagName, textContent, attributes };
}

// Get contextual quick actions based on element type
function getQuickActions(elementType: string): string[] {
    const commonActions = ["Make it bigger", "Make it smaller"];

    switch (elementType) {
        case 'heading':
            return [...commonActions, "Make it bold", "Add gradient text", "Center align", "Change to uppercase"];
        case 'text':
            return [...commonActions, "Make it bold", "Change font color", "Add emphasis", "Make it italic"];
        case 'image':
            return ["Make it larger", "Add rounded corners", "Add border", "Add shadow", "Make it circular"];
        case 'button':
            return ["Make it larger", "Add hover effect", "Change colors", "Add icon", "Make it rounded", "Add gradient"];
        case 'link':
            return ["Add underline", "Change color", "Add hover effect", "Make it bold"];
        case 'list':
            return ["Add bullet styling", "Add numbers", "Add spacing", "Add icons to items"];
        case 'section':
            return ["Add background color", "Add padding", "Add border", "Add shadow", "Center content", "Add animation"];
        default:
            return [...commonActions, "Change colors", "Add animation", "Add shadow"];
    }
}

export function ElementEditDialog({
    isOpen,
    onClose,
    elementHtml,
    onSubmit,
    onDelete,
    onDuplicate,
    onMoveUp,
    onMoveDown,
    onDirectEdit,
    onGenerateImage
}: ElementEditDialogProps) {
    const [prompt, setPrompt] = useState("");
    const [directEditText, setDirectEditText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeMode, setActiveMode] = useState<EditMode>("ai");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Detect element type
    const elementInfo = useMemo(() => detectElementType(elementHtml), [elementHtml]);
    const quickActions = useMemo(() => getQuickActions(elementInfo.type), [elementInfo.type]);

    // Initialize direct edit text when dialog opens
    useEffect(() => {
        if (isOpen && elementInfo.textContent) {
            setDirectEditText(elementInfo.textContent);
        }
    }, [isOpen, elementInfo.textContent]);

    // Reset state when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setPrompt("");
            setShowDeleteConfirm(false);
            setActiveMode("ai");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (activeMode === "direct" && onDirectEdit) {
            // Direct text edit
            const updatedHtml = elementHtml.replace(elementInfo.textContent, directEditText);
            onDirectEdit(updatedHtml);
            onClose();
            return;
        }

        if (!prompt.trim()) return;

        setIsLoading(true);
        try {
            if (activeMode === "image" && onGenerateImage) {
                await onGenerateImage(prompt);
            } else {
                await onSubmit(prompt);
            }
            setPrompt("");
            onClose();
        } catch (error) {
            console.error("Edit failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!onDelete) return;
        setIsLoading(true);
        try {
            await onDelete();
            onClose();
        } catch (error) {
            console.error("Delete failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (action: 'duplicate' | 'moveUp' | 'moveDown') => {
        const handlers = { duplicate: onDuplicate, moveUp: onMoveUp, moveDown: onMoveDown };
        const handler = handlers[action];
        if (!handler) return;

        setIsLoading(true);
        try {
            await handler();
        } catch (error) {
            console.error(`${action} failed:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    // Truncate element preview
    const truncatedHtml = elementHtml.length > 300
        ? elementHtml.substring(0, 300) + "..."
        : elementHtml;

    const canDirectEdit = ['text', 'heading', 'button', 'link'].includes(elementInfo.type) && elementInfo.textContent;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                className="relative w-full max-w-xl mx-4 rounded-xl shadow-2xl border max-h-[90vh] overflow-y-auto"
                style={{
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderColor: 'var(--color-border)'
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b sticky top-0 z-10" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-purple-400" />
                            <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                                Edit Element
                            </h3>
                        </div>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {elementInfo.type} • {elementInfo.tagName}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Quick action buttons */}
                        {onDuplicate && (
                            <button
                                onClick={() => handleAction('duplicate')}
                                disabled={isLoading}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Duplicate"
                            >
                                <Copy className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                            </button>
                        )}
                        {onMoveUp && (
                            <button
                                onClick={() => handleAction('moveUp')}
                                disabled={isLoading}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Move Up"
                            >
                                <ArrowUp className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                            </button>
                        )}
                        {onMoveDown && (
                            <button
                                onClick={() => handleAction('moveDown')}
                                disabled={isLoading}
                                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                title="Move Down"
                            >
                                <ArrowDown className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={isLoading}
                                className="p-2 rounded-lg hover:bg-red-500/20 transition-colors"
                                title="Delete"
                            >
                                <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors ml-2"
                        >
                            <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                        </button>
                    </div>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="p-4 bg-red-500/10 border-b border-red-500/30">
                        <p className="text-sm text-red-300 mb-3">Are you sure you want to delete this element?</p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Mode Tabs */}
                <div className="flex border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                        onClick={() => setActiveMode("ai")}
                        className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeMode === "ai"
                            ? "text-purple-400 border-b-2 border-purple-400 bg-purple-500/5"
                            : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                            }`}
                    >
                        <Sparkles className="w-4 h-4" />
                        AI Edit
                    </button>
                    {canDirectEdit && (
                        <button
                            onClick={() => setActiveMode("direct")}
                            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeMode === "direct"
                                ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                                : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                                }`}
                        >
                            <Type className="w-4 h-4" />
                            Direct Edit
                        </button>
                    )}
                    {onGenerateImage && elementInfo.type === 'image' && (
                        <button
                            onClick={() => setActiveMode("image")}
                            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${activeMode === "image"
                                ? "text-pink-400 border-b-2 border-pink-400 bg-pink-500/5"
                                : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                                }`}
                        >
                            <Image className="w-4 h-4" />
                            Generate Image
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Selected Element Preview */}
                    <div>
                        <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-tertiary)' }}>
                            Selected Element Preview
                        </label>
                        {/* Visual Preview with Tailwind */}
                        <iframe
                            srcDoc={`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 16px; background: white; display: flex; align-items: center; justify-content: center; min-height: 80px; }
    </style>
</head>
<body>${elementHtml}</body>
</html>`}
                            className="w-full rounded-lg border-0"
                            style={{
                                height: '100px',
                                backgroundColor: '#ffffff',
                                border: '2px solid var(--color-border)',
                                borderRadius: '8px'
                            }}
                            title="Element Preview"
                        />
                        {/* HTML Code Preview (collapsed by default) */}
                        <details className="group mt-2">
                            <summary
                                className="text-xs cursor-pointer select-none px-2 py-1 rounded hover:bg-white/5 transition-colors"
                                style={{ color: 'var(--color-text-tertiary)' }}
                            >
                                View HTML code
                            </summary>
                            <div
                                className="p-3 rounded-lg text-xs font-mono overflow-x-auto max-h-24 overflow-y-auto mt-2"
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    color: 'var(--color-text-secondary)'
                                }}
                            >
                                {truncatedHtml}
                            </div>
                        </details>
                    </div>

                    {/* Direct Edit Mode */}
                    {activeMode === "direct" && canDirectEdit && (
                        <div>
                            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-primary)' }}>
                                Edit Text Directly
                            </label>
                            {elementInfo.textContent.length > 100 ? (
                                <Textarea
                                    value={directEditText}
                                    onChange={(e) => setDirectEditText(e.target.value)}
                                    className="min-h-[100px]"
                                    style={{
                                        backgroundColor: 'var(--color-bg-tertiary)',
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-text-primary)'
                                    }}
                                />
                            ) : (
                                <Input
                                    value={directEditText}
                                    onChange={(e) => setDirectEditText(e.target.value)}
                                    style={{
                                        backgroundColor: 'var(--color-bg-tertiary)',
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-text-primary)'
                                    }}
                                />
                            )}
                            <p className="text-xs mt-2" style={{ color: 'var(--color-text-tertiary)' }}>
                                Changes will be applied immediately without AI processing
                            </p>
                        </div>
                    )}

                    {/* AI Edit Mode */}
                    {activeMode === "ai" && (
                        <>
                            <div>
                                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-primary)' }}>
                                    What would you like to change?
                                </label>
                                <Textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={`e.g., ${quickActions[0].toLowerCase()}...`}
                                    className="min-h-[80px]"
                                    style={{
                                        backgroundColor: 'var(--color-bg-tertiary)',
                                        borderColor: 'var(--color-border)',
                                        color: 'var(--color-text-primary)'
                                    }}
                                />
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <label className="text-xs font-medium mb-2 block" style={{ color: 'var(--color-text-tertiary)' }}>
                                    Quick Actions for {elementInfo.type}
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {quickActions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => setPrompt(suggestion)}
                                            className="px-3 py-1.5 text-xs rounded-full border transition-all hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-purple-300"
                                            style={{
                                                borderColor: 'var(--color-border)',
                                                color: 'var(--color-text-secondary)'
                                            }}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}

                    {/* Image Generation Mode */}
                    {activeMode === "image" && (
                        <div>
                            <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-primary)' }}>
                                Describe the image you want
                            </label>
                            <Textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A beautiful sunset over mountains with vibrant orange and purple colors..."
                                className="min-h-[100px]"
                                style={{
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    borderColor: 'var(--color-border)',
                                    color: 'var(--color-text-primary)'
                                }}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-between gap-2 p-4 border-t sticky bottom-0" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                    <div className="text-xs flex items-center gap-2" style={{ color: 'var(--color-text-tertiary)' }}>
                        <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Ctrl+Z</kbd>
                        <span>to undo</span>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isLoading || (activeMode !== "direct" && !prompt.trim())}
                            className={
                                activeMode === "direct"
                                    ? "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
                                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                            }
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : activeMode === "direct" ? (
                                <>
                                    <Type className="w-4 h-4 mr-2" />
                                    Update Text
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Apply with AI
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

