"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Sparkles, Settings, Loader2, ArrowRight, Save, Eye, Edit3, Plus, ExternalLink, Undo2, Redo2, Download, AlertCircle, Link2, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AIPagePreview } from "@/components/ai/AIPagePreview";
import { Profile } from "@/types";
import { ElementEditDialog } from "@/components/ai/ElementEditDialog";
import { AddSectionDialog } from "@/components/ai/AddSectionDialog";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileRenderer } from "@/components/ProfileRenderer";
import { CloningProgress } from "@/components/CloningProgress";

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

export default function AIGeneratedProfilePage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditingElement, setIsEditingElement] = useState(false);
    const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);

    // Form state
    const [prompt, setPrompt] = useState("");
    const [profession, setProfession] = useState("");
    const [style, setStyle] = useState("modern");
    const [colorScheme, setColorScheme] = useState("dark");
    const [slug, setSlug] = useState("");

    // Import from existing profile state
    const [wantsToImport, setWantsToImport] = useState(false);
    const [importUrl, setImportUrl] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [importedProfile, setImportedProfile] = useState<ImportedProfile | null>(null);
    const [importError, setImportError] = useState<string | null>(null);
    const [importMode, setImportMode] = useState<'clone' | 'generate'>('clone');
    const [isCloning, setIsCloning] = useState(false);
    const [clonedProfile, setClonedProfile] = useState<Profile | null>(null);
    const [clonedCss, setClonedCss] = useState<string>(''); // CSS for cloned pages
    const [clonedSourceUrl, setClonedSourceUrl] = useState<string>(''); // Original URL
    const [isClonedPage, setIsClonedPage] = useState(false); // Track if this is a clone
    const router = useRouter();

    // Generated content state
    const [generatedHtml, setGeneratedHtml] = useState("");
    const [isEditMode, setIsEditMode] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Element editing state
    const [selectedElement, setSelectedElement] = useState<{
        element: HTMLElement;
        html: string;
        path: string;
    } | null>(null);

    // Undo/Redo history
    const [htmlHistory, setHtmlHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const isUndoRedoAction = useRef(false);

    // Track HTML changes for undo/redo
    const updateHtmlWithHistory = useCallback((newHtml: string) => {
        if (isUndoRedoAction.current) {
            isUndoRedoAction.current = false;
            setGeneratedHtml(newHtml);
            return;
        }

        // Add to history, removing any future states if we're not at the end
        setHtmlHistory(prev => {
            const newHistory = prev.slice(0, historyIndex + 1);
            newHistory.push(newHtml);
            // Limit history to 50 states
            if (newHistory.length > 50) {
                newHistory.shift();
                return newHistory;
            }
            return newHistory;
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
        setGeneratedHtml(newHtml);
        setIsSaved(false);
    }, [historyIndex]);

    // Undo function
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            isUndoRedoAction.current = true;
            setHistoryIndex(prev => prev - 1);
            setGeneratedHtml(htmlHistory[historyIndex - 1]);
            setIsSaved(false);
        }
    }, [historyIndex, htmlHistory]);

    // Redo function
    const handleRedo = useCallback(() => {
        if (historyIndex < htmlHistory.length - 1) {
            isUndoRedoAction.current = true;
            setHistoryIndex(prev => prev + 1);
            setGeneratedHtml(htmlHistory[historyIndex + 1]);
            setIsSaved(false);
        }
    }, [historyIndex, htmlHistory]);

    // Keyboard shortcuts for undo/redo
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isEditMode || !generatedHtml) return;

            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                handleUndo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                handleRedo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isEditMode, generatedHtml, handleUndo, handleRedo]);

    // Handle importing profile from Linktree/Beacons
    const handleImportProfile = async () => {
        if (!importUrl.trim()) {
            setImportError("Please enter a URL");
            return;
        }

        setIsImporting(true);
        setImportError(null);

        try {
            const response = await fetch("/api/import-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: importUrl.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to import profile");
            }

            setImportedProfile(data.profile);

            // Auto-populate prompt if empty
            if (!prompt.trim() && data.profile.bio) {
                setPrompt(data.profile.bio);
            }
        } catch (err) {
            setImportError(err instanceof Error ? err.message : "Failed to import profile");
        } finally {
            setIsImporting(false);
        }
    };

    // Handle cloning Linktree profile directly to edit mode
    const handleCloneLinktree = async () => {
        if (!importUrl.trim()) {
            setImportError("Please enter a Linktree URL");
            return;
        }

        setIsCloning(true);
        setImportError(null);

        try {
            const response = await fetch("/api/ai/clone-linktree", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: importUrl.trim() }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to clone profile");
            }

            // New raw HTML approach - use HTML directly instead of ProfileRenderer
            setGeneratedHtml(data.html);
            setClonedCss(data.css || '');
            setClonedSourceUrl(data.sourceUrl || '');
            setIsClonedPage(true);
            setClonedProfile(null); // Clear old profile approach
            setHtmlHistory([data.html]);
            setHistoryIndex(0);
            setSlug(data.suggestedSlug);
            setIsEditMode(true);
        } catch (err) {
            setImportError(err instanceof Error ? err.message : "Failed to clone profile");
        } finally {
            setIsCloning(false);
        }
    };

    const handleGenerate = async () => {
        if (!prompt.trim() && !importedProfile) return;

        setIsGenerating(true);
        setIsSaved(false);

        try {
            const response = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    profession,
                    style,
                    colorScheme,
                    importedProfile: wantsToImport ? importedProfile : null,
                }),
            });

            if (!response.ok) {
                throw new Error("Generation failed");
            }

            const data = await response.json();
            setGeneratedHtml(data.html);
            // Initialize history with the generated HTML
            setHtmlHistory([data.html]);
            setHistoryIndex(0);
            setSlug(data.suggestedSlug);
            setIsEditMode(true);
        } catch (error) {
            console.error("Generation error:", error);
            alert("Failed to generate page. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleElementClick = (element: HTMLElement, html: string, path: string) => {
        setSelectedElement({ element, html, path });
        setIsEditingElement(true);
    };

    const handleElementEdit = async (editPrompt: string) => {
        if (!selectedElement) return;

        const response = await fetch("/api/ai/edit-element", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullPageHtml: generatedHtml,
                elementHtml: selectedElement.html,
                elementPath: selectedElement.path,
                editPrompt,
            }),
        });

        if (!response.ok) {
            throw new Error("Edit failed");
        }

        const data = await response.json();
        updateHtmlWithHistory(data.updatedHtml);
    };

    // Handle direct text edit (without AI)
    const handleDirectEdit = useCallback((newHtml: string) => {
        if (!selectedElement) return;

        const updatedHtml = generatedHtml.replace(selectedElement.html, newHtml);
        updateHtmlWithHistory(updatedHtml);
        setIsEditingElement(false);
        setSelectedElement(null);
    }, [selectedElement, generatedHtml, updateHtmlWithHistory]);

    // Handle element deletion
    const handleElementDelete = useCallback(async () => {
        if (!selectedElement) return;

        const updatedHtml = generatedHtml.replace(selectedElement.html, '');
        updateHtmlWithHistory(updatedHtml);
        setIsEditingElement(false);
        setSelectedElement(null);
    }, [selectedElement, generatedHtml, updateHtmlWithHistory]);

    // Handle element duplication (from context menu)
    const handleElementDuplicate = useCallback((elementPath: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(generatedHtml, 'text/html');

        const pathParts = elementPath.split(' > ');
        let element: Element | null = doc.body;

        for (const part of pathParts) {
            const match = part.match(/(.+):nth-child\((\d+)\)/);
            if (match && element) {
                const [, , index] = match;
                element = element.children[parseInt(index) - 1] || null;
            }
        }

        if (element && element.parentElement) {
            const clone = element.cloneNode(true) as Element;
            element.parentElement.insertBefore(clone, element.nextSibling);
            updateHtmlWithHistory(doc.body.innerHTML);
        }
    }, [generatedHtml, updateHtmlWithHistory]);

    // Handle element move (from context menu)
    const handleElementMove = useCallback((elementPath: string, direction: 'up' | 'down') => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(generatedHtml, 'text/html');

        const pathParts = elementPath.split(' > ');
        let element: Element | null = doc.body;

        for (const part of pathParts) {
            const match = part.match(/(.+):nth-child\((\d+)\)/);
            if (match && element) {
                const [, , index] = match;
                element = element.children[parseInt(index) - 1] || null;
            }
        }

        if (element && element.parentElement) {
            const parent = element.parentElement;
            if (direction === 'up' && element.previousElementSibling) {
                parent.insertBefore(element, element.previousElementSibling);
                updateHtmlWithHistory(doc.body.innerHTML);
            } else if (direction === 'down' && element.nextElementSibling) {
                parent.insertBefore(element.nextElementSibling, element);
                updateHtmlWithHistory(doc.body.innerHTML);
            }
        }
    }, [generatedHtml, updateHtmlWithHistory]);

    // Handle element delete from context menu
    const handleElementDeleteFromPath = useCallback((elementPath: string) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(generatedHtml, 'text/html');

        const pathParts = elementPath.split(' > ');
        let element: Element | null = doc.body;

        for (const part of pathParts) {
            const match = part.match(/(.+):nth-child\((\d+)\)/);
            if (match && element) {
                const [, , index] = match;
                element = element.children[parseInt(index) - 1] || null;
            }
        }

        if (element && element.parentElement) {
            element.remove();
            updateHtmlWithHistory(doc.body.innerHTML);
        }
    }, [generatedHtml, updateHtmlWithHistory]);

    const handleSave = async () => {
        if (!generatedHtml || !slug) return;

        setIsSaving(true);

        try {
            // Both cloned pages and generated pages now save to AI pages table
            const response = await fetch("/api/ai/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    generatedHtml,
                    generatedCss: clonedCss || null, // Include CSS for clones
                    prompt: isClonedPage ? `Cloned from: ${clonedSourceUrl}` : prompt,
                    profession,
                    style,
                    colorScheme,
                    isPublished: true,
                    sourceType: isClonedPage ? 'clone' : 'generated',
                    sourceUrl: clonedSourceUrl || null,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Save failed");
            }

            setIsSaved(true);
            // Redirect to dashboard after saving
            router.push('/dashboard');
        } catch (error) {
            console.error("Save error:", error);
            alert(error instanceof Error ? error.message : "Failed to save page");
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddSection = async (sectionType: string, sectionPrompt: string) => {
        const response = await fetch("/api/ai/add-section", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullPageHtml: generatedHtml,
                sectionType,
                sectionPrompt,
                position: "bottom",
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to add section");
        }

        const data = await response.json();
        setGeneratedHtml(data.updatedHtml);
        setIsSaved(false);
    };

    return (
        <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}>
            {/* Cloning Progress Overlay */}
            <CloningProgress isVisible={isCloning} sourceUrl={importUrl} />

            <div className="flex">
                {/* Left Sidebar Navigation */}
                <aside className="hidden lg:block w-64 sticky top-0 h-screen overflow-y-auto" style={{ borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                    <div className="p-6">
                        <h2 className="text-lg font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                            Create Profile
                        </h2>
                        <nav className="space-y-2">
                            <Link
                                href="/create"
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'transparent',
                                    color: 'var(--color-text-secondary)',
                                    border: '1px solid transparent'
                                }}
                            >
                                <Settings className="w-5 h-5" />
                                <span className="font-medium">Self-customized</span>
                            </Link>

                            <div
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                                style={{
                                    backgroundColor: 'var(--color-success)/0.1',
                                    color: 'var(--color-success)',
                                    border: '1px solid var(--color-success)/0.2'
                                }}
                            >
                                <Wand2 className="w-5 h-5" />
                                <span className="font-medium">AI-generated</span>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-8">
                    <div className="max-w-6xl mx-auto">
                        {!generatedHtml ? (
                            // Generation Form
                            <div className="max-w-2xl mx-auto space-y-8">
                                {/* Header */}
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                                        <Wand2 className="w-8 h-8 text-purple-400" />
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                                        AI-Generated Profile
                                    </h1>
                                    <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
                                        Describe yourself and let AI create a stunning, unique page for you. Full creative freedom!
                                    </p>
                                </div>

                                {/* AI Generation Form */}
                                <Card className="backdrop-blur-md" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-400" />
                                            Generate Your Profile
                                        </CardTitle>
                                        <CardDescription>Tell us about yourself and let AI create a unique profile</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Import from Existing Profile */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <Download className="w-5 h-5 text-cyan-400" />
                                                    <div>
                                                        <Label className="text-base cursor-pointer" htmlFor="import-toggle">
                                                            Import from existing profile
                                                        </Label>
                                                        <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                            Clone your Linktree or Beacons.ai page
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    id="import-toggle"
                                                    type="button"
                                                    onClick={() => {
                                                        setWantsToImport(!wantsToImport);
                                                        if (!wantsToImport) {
                                                            setImportedProfile(null);
                                                            setImportError(null);
                                                        }
                                                    }}
                                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${wantsToImport ? 'bg-cyan-500' : 'bg-gray-600'
                                                        }`}
                                                >
                                                    <span
                                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${wantsToImport ? 'translate-x-6' : 'translate-x-1'
                                                            }`}
                                                    />
                                                </button>
                                            </div>

                                            {wantsToImport && (
                                                <div className="space-y-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
                                                    {/* Import Mode Selection */}
                                                    <div className="space-y-3">
                                                        <Label>Import Mode</Label>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <button
                                                                type="button"
                                                                onClick={() => setImportMode('clone')}
                                                                className="flex flex-col items-start gap-2 p-4 rounded-lg transition-all text-left"
                                                                style={{
                                                                    backgroundColor: importMode === 'clone' ? 'rgba(6, 182, 212, 0.2)' : 'var(--color-bg-base)',
                                                                    borderColor: importMode === 'clone' ? '#06b6d4' : 'var(--color-border)',
                                                                    border: '1px solid',
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Copy className="w-4 h-4" style={{ color: importMode === 'clone' ? '#06b6d4' : 'var(--color-text-secondary)' }} />
                                                                    <span className="font-medium" style={{ color: importMode === 'clone' ? '#06b6d4' : 'var(--color-text-primary)' }}>
                                                                        Clone Design
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                                    Preserve original look & feel
                                                                </span>
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setImportMode('generate')}
                                                                className="flex flex-col items-start gap-2 p-4 rounded-lg transition-all text-left"
                                                                style={{
                                                                    backgroundColor: importMode === 'generate' ? 'rgba(168, 85, 247, 0.2)' : 'var(--color-bg-base)',
                                                                    borderColor: importMode === 'generate' ? '#a855f7' : 'var(--color-border)',
                                                                    border: '1px solid',
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <Wand2 className="w-4 h-4" style={{ color: importMode === 'generate' ? '#a855f7' : 'var(--color-text-secondary)' }} />
                                                                    <span className="font-medium" style={{ color: importMode === 'generate' ? '#a855f7' : 'var(--color-text-primary)' }}>
                                                                        New Design
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                                    Keep links, create fresh style
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* URL Input */}
                                                    <div className="space-y-2">
                                                        <Label htmlFor="import-url">
                                                            {importMode === 'clone' ? 'Linktree URL' : 'Profile URL'}
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            <div className="relative flex-1">
                                                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                                                                <Input
                                                                    id="import-url"
                                                                    value={importUrl}
                                                                    onChange={(e) => {
                                                                        setImportUrl(e.target.value);
                                                                        setImportError(null);
                                                                    }}
                                                                    placeholder={importMode === 'clone'
                                                                        ? "linktr.ee/username or beacons.ai/username"
                                                                        : "linktr.ee/username or beacons.ai/username"
                                                                    }
                                                                    className="pl-10"
                                                                    style={{
                                                                        backgroundColor: 'var(--color-bg-base)',
                                                                        borderColor: importError ? '#ef4444' : 'var(--color-border)',
                                                                        color: 'var(--color-text-primary)'
                                                                    }}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            if (importMode === 'clone') {
                                                                                handleCloneLinktree();
                                                                            } else {
                                                                                handleImportProfile();
                                                                            }
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            {importMode === 'clone' ? (
                                                                <Button
                                                                    type="button"
                                                                    onClick={handleCloneLinktree}
                                                                    disabled={isCloning || !importUrl.trim()}
                                                                    className="bg-cyan-600 hover:bg-cyan-700 text-white min-w-[100px]"
                                                                >
                                                                    {isCloning ? (
                                                                        <>
                                                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                                            Cloning...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Copy className="w-4 h-4 mr-2" />
                                                                            Clone
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    type="button"
                                                                    onClick={handleImportProfile}
                                                                    disabled={isImporting || !importUrl.trim()}
                                                                    className="bg-purple-600 hover:bg-purple-700 text-white"
                                                                >
                                                                    {isImporting ? (
                                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                                    ) : (
                                                                        "Fetch"
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                        {importError && (
                                                            <div className="flex items-center gap-2 text-sm text-red-400">
                                                                <AlertCircle className="w-4 h-4" />
                                                                {importError}
                                                            </div>
                                                        )}
                                                        {importMode === 'clone' && (
                                                            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                                Cloning will convert your Linktree to our format and open the editor directly.
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Imported Profile Preview - only for generate mode */}
                                                    {importMode === 'generate' && importedProfile && (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                                                                <Check className="w-4 h-4 text-emerald-400" />
                                                                <span className="text-sm text-emerald-300">
                                                                    Profile imported from {importedProfile.source === 'linktree' ? 'Linktree' : importedProfile.source === 'beacons' ? 'Beacons.ai' : 'external source'}
                                                                </span>
                                                            </div>

                                                            <div className="flex items-center gap-3">
                                                                {importedProfile.avatarUrl ? (
                                                                    <img
                                                                        src={importedProfile.avatarUrl}
                                                                        alt="Profile"
                                                                        className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
                                                                        <span className="text-lg font-bold text-white">
                                                                            {importedProfile.displayName?.[0]?.toUpperCase() || '?'}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>
                                                                        {importedProfile.displayName || 'No name found'}
                                                                    </p>
                                                                    <p className="text-xs truncate" style={{ color: 'var(--color-text-tertiary)' }}>
                                                                        {importedProfile.links.length} links • {importedProfile.bio?.slice(0, 50) || 'No bio'}...
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                                AI will create a new design inspired by this profile, keeping your links and content.
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Supported Platforms Info - only for generate mode */}
                                                    {importMode === 'generate' && !importedProfile && (
                                                        <div className="flex gap-4 text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-4 h-4 rounded bg-[#43E660] flex items-center justify-center">
                                                                    <span className="text-black font-bold text-[8px]">L</span>
                                                                </div>
                                                                Linktree
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <div className="w-4 h-4 rounded bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center">
                                                                    <span className="text-white font-bold text-[8px]">B</span>
                                                                </div>
                                                                Beacons.ai
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Divider - only show for generate mode */}
                                        {wantsToImport && importMode === 'generate' && (
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
                                                <span className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Additional customization</span>
                                                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
                                            </div>
                                        )}

                                        {/* Form fields - only show when NOT in clone import mode */}
                                        {!(wantsToImport && importMode === 'clone') && (
                                            <>
                                                {/* Description Prompt */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="prompt">{wantsToImport && importedProfile ? 'Additional Instructions (Optional)' : 'Describe Yourself'}</Label>
                                                    <Textarea
                                                        id="prompt"
                                                        value={prompt}
                                                        onChange={(e) => setPrompt(e.target.value)}
                                                        placeholder={wantsToImport && importedProfile
                                                            ? "e.g. Make it more colorful, add a neon theme, use a dark background..."
                                                            : "e.g. I'm a creative photographer based in Tokyo, specializing in street photography and urban landscapes. I love capturing the beauty of everyday life..."
                                                        }
                                                        className="min-h-[120px] focus:border-purple-500"
                                                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                                                    />
                                                    <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>
                                                        {wantsToImport && importedProfile
                                                            ? 'Add any style preferences or changes you want for the new design'
                                                            : 'The more details you provide, the better the AI can personalize your profile'
                                                        }
                                                    </p>
                                                </div>

                                                {/* Profession */}
                                                <div className="space-y-2">
                                                    <Label htmlFor="profession">Your Profession / Role</Label>
                                                    <Input
                                                        id="profession"
                                                        value={profession}
                                                        onChange={(e) => setProfession(e.target.value)}
                                                        placeholder="e.g. Photographer, Developer, Designer, Content Creator..."
                                                        className="focus:border-purple-500"
                                                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                                                    />
                                                </div>

                                                {/* Style Selection */}
                                                <div className="space-y-3">
                                                    <Label>Profile Style</Label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                        {[
                                                            { id: 'modern', label: 'Modern', icon: '✨' },
                                                            { id: 'minimal', label: 'Minimal', icon: '◽' },
                                                            { id: 'creative', label: 'Creative', icon: '🎨' },
                                                            { id: 'professional', label: 'Professional', icon: '💼' },
                                                        ].map((option) => (
                                                            <button
                                                                key={option.id}
                                                                type="button"
                                                                onClick={() => setStyle(option.id)}
                                                                className="flex flex-col items-center gap-2 p-4 rounded-lg transition-all"
                                                                style={{
                                                                    backgroundColor: style === option.id ? 'var(--color-success)/0.2' : 'var(--color-bg-tertiary)',
                                                                    borderColor: style === option.id ? 'var(--color-success)' : 'var(--color-border)',
                                                                    border: '1px solid',
                                                                    color: style === option.id ? 'var(--color-success)' : 'var(--color-text-secondary)'
                                                                }}
                                                            >
                                                                <span className="text-2xl">{option.icon}</span>
                                                                <span className="text-sm font-medium">{option.label}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Color Scheme */}
                                                <div className="space-y-3">
                                                    <Label>Color Scheme</Label>
                                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                                        {[
                                                            { id: 'dark', label: 'Dark', colors: ['#0f172a', '#1e293b'] },
                                                            { id: 'light', label: 'Light', colors: ['#f8fafc', '#e2e8f0'] },
                                                            { id: 'purple', label: 'Purple', colors: ['#7c3aed', '#a855f7'] },
                                                            { id: 'ocean', label: 'Ocean', colors: ['#0ea5e9', '#06b6d4'] },
                                                            { id: 'sunset', label: 'Sunset', colors: ['#f97316', '#ef4444'] },
                                                            { id: 'forest', label: 'Forest', colors: ['#10b981', '#059669'] },
                                                        ].map((option) => (
                                                            <button
                                                                key={option.id}
                                                                type="button"
                                                                onClick={() => setColorScheme(option.id)}
                                                                className="flex flex-col items-center gap-2 p-3 rounded-lg transition-all"
                                                                style={{
                                                                    backgroundColor: colorScheme === option.id ? 'var(--color-success)/0.2' : 'var(--color-bg-tertiary)',
                                                                    borderColor: colorScheme === option.id ? 'var(--color-success)' : 'var(--color-border)',
                                                                    border: '1px solid'
                                                                }}
                                                            >
                                                                <div
                                                                    className="w-8 h-8 rounded-full overflow-hidden"
                                                                    style={{
                                                                        background: `linear-gradient(135deg, ${option.colors[0]}, ${option.colors[1]})`
                                                                    }}
                                                                />
                                                                <span
                                                                    className="text-xs font-medium"
                                                                    style={{ color: colorScheme === option.id ? 'var(--color-success)' : 'var(--color-text-secondary)' }}
                                                                >
                                                                    {option.label}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Generate Button */}
                                                <Button
                                                    onClick={handleGenerate}
                                                    disabled={isGenerating || (!prompt.trim() && !(wantsToImport && importedProfile))}
                                                    className="w-full h-14 text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/25"
                                                >
                                                    {isGenerating ? (
                                                        <>
                                                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                            Generating Your Profile...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Wand2 className="w-5 h-5 mr-2" />
                                                            Generate with AI
                                                            <ArrowRight className="w-5 h-5 ml-2" />
                                                        </>
                                                    )}
                                                </Button>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            // Preview and Edit Mode
                            <div className="space-y-6">
                                {/* Toolbar */}
                                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                                    <div className="flex items-center gap-4">
                                        <Button
                                            variant={isEditMode ? "default" : "outline"}
                                            onClick={() => setIsEditMode(!isEditMode)}
                                            className={isEditMode ? "bg-purple-600 hover:bg-purple-700" : ""}
                                        >
                                            <Edit3 className="w-4 h-4 mr-2" />
                                            {isEditMode ? "Editing Mode" : "Preview Mode"}
                                        </Button>

                                        <Button
                                            variant="outline"
                                            onClick={() => setIsAddingSectionOpen(true)}
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Add Section
                                        </Button>

                                        {/* Undo/Redo Buttons */}
                                        <div className="flex items-center gap-1 border-l pl-4" style={{ borderColor: 'var(--color-border)' }}>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleUndo}
                                                disabled={historyIndex <= 0}
                                                title="Undo (Ctrl+Z)"
                                            >
                                                <Undo2 className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRedo}
                                                disabled={historyIndex >= htmlHistory.length - 1}
                                                title="Redo (Ctrl+Y)"
                                            >
                                                <Redo2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor="slug" className="text-sm whitespace-nowrap">URL:</Label>
                                            <Input
                                                id="slug"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                                className="w-48"
                                                style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                                            />
                                        </div>

                                        <Button
                                            onClick={handleSave}
                                            disabled={isSaving || !slug}
                                            className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            {isSaved ? "Saved!" : "Save & Publish"}
                                        </Button>

                                        {isSaved && (
                                            <Link href={`/${slug}`} target="_blank">
                                                <Button variant="outline">
                                                    <ExternalLink className="w-4 h-4 mr-2" />
                                                    View Page
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>

                                {/* Preview */}
                                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
                                    <AIPagePreview
                                        html={generatedHtml}
                                        onElementClick={handleElementClick}
                                        onElementDelete={handleElementDeleteFromPath}
                                        onElementDuplicate={handleElementDuplicate}
                                        onElementMove={handleElementMove}
                                        onHtmlChange={updateHtmlWithHistory}
                                        isEditing={isEditMode}
                                    />
                                </div>

                                {/* Regenerate Option */}
                                <div className="text-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setGeneratedHtml("");
                                            setIsEditMode(false);
                                            setIsSaved(false);
                                        }}
                                    >
                                        <Wand2 className="w-4 h-4 mr-2" />
                                        Generate New Design
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Element Edit Dialog */}
            <ElementEditDialog
                isOpen={isEditingElement}
                onClose={() => {
                    setIsEditingElement(false);
                    setSelectedElement(null);
                }
                }
                elementHtml={selectedElement?.html || ""}
                onSubmit={handleElementEdit}
                onDelete={handleElementDelete}
                onDirectEdit={handleDirectEdit}
            />

            {/* Add Section Dialog */}
            <AddSectionDialog
                isOpen={isAddingSectionOpen}
                onClose={() => setIsAddingSectionOpen(false)}
                onSubmit={handleAddSection}
            />
        </main>
    );
}
