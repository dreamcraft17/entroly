"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Eye, Edit3, Plus, ArrowLeft, Undo2, Redo2 } from "lucide-react";
import Link from "next/link";
import { AIPagePreview } from "@/components/ai/AIPagePreview";
import { ElementEditDialog } from "@/components/ai/ElementEditDialog";
import { AddSectionDialog } from "@/components/ai/AddSectionDialog";

interface AIPage {
    id: string;
    slug: string;
    prompt: string;
    style: string | null;
    colorScheme: string | null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    generatedHtml?: string;
}

interface AIPageEditorProps {
    page: AIPage;
    onBack: () => void;
    onSave: () => void;
}

export function AIPageEditor({ page, onBack, onSave }: AIPageEditorProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditMode, setIsEditMode] = useState(true);
    const [isEditingElement, setIsEditingElement] = useState(false);
    const [isAddingSectionOpen, setIsAddingSectionOpen] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState("");
    const [slug, setSlug] = useState(page.slug);
    const [hasChanges, setHasChanges] = useState(false);

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
        setHasChanges(true);
    }, [historyIndex]);

    // Undo function
    const handleUndo = useCallback(() => {
        if (historyIndex > 0) {
            isUndoRedoAction.current = true;
            setHistoryIndex(prev => prev - 1);
            setGeneratedHtml(htmlHistory[historyIndex - 1]);
            setHasChanges(true);
        }
    }, [historyIndex, htmlHistory]);

    // Redo function
    const handleRedo = useCallback(() => {
        if (historyIndex < htmlHistory.length - 1) {
            isUndoRedoAction.current = true;
            setHistoryIndex(prev => prev + 1);
            setGeneratedHtml(htmlHistory[historyIndex + 1]);
            setHasChanges(true);
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

    // Fetch full page data with HTML
    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const response = await fetch(`/api/ai/pages/${page.id}`);
                if (response.ok) {
                    const data = await response.json();
                    const html = data.generatedHtml || "";
                    setGeneratedHtml(html);
                    // Initialize history
                    if (html) {
                        setHtmlHistory([html]);
                        setHistoryIndex(0);
                    }
                }
            } catch (error) {
                console.error("Error fetching page data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPageData();
    }, [page.id]);

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

        // Replace the element in the full HTML
        const updatedHtml = generatedHtml.replace(selectedElement.html, newHtml);
        updateHtmlWithHistory(updatedHtml);
        setIsEditingElement(false);
        setSelectedElement(null);
    }, [selectedElement, generatedHtml, updateHtmlWithHistory]);

    // Handle element deletion
    const handleElementDelete = useCallback(async () => {
        if (!selectedElement) return;

        // Remove the element from HTML
        const updatedHtml = generatedHtml.replace(selectedElement.html, '');
        updateHtmlWithHistory(updatedHtml);
        setIsEditingElement(false);
        setSelectedElement(null);
    }, [selectedElement, generatedHtml, updateHtmlWithHistory]);

    // Handle element duplication (from context menu)
    const handleElementDuplicate = useCallback((elementPath: string) => {
        // Parse the HTML to find and duplicate the element
        const parser = new DOMParser();
        const doc = parser.parseFromString(generatedHtml, 'text/html');

        // Use the path to find the element
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
        updateHtmlWithHistory(data.updatedHtml);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch("/api/ai/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: page.id,
                    slug,
                    generatedHtml,
                    isPublished: page.isPublished,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Save failed");
            }

            setHasChanges(false);
            onSave();
        } catch (error) {
            console.error("Save error:", error);
            alert(error instanceof Error ? error.message : "Failed to save page");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" onClick={onBack}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                            Edit AI Page
                        </h2>
                        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                            /{slug}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/${slug}`}
                        target="_blank"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{
                            backgroundColor: 'var(--color-bg-tertiary)',
                            color: 'var(--color-text-primary)',
                            border: '1px solid var(--color-border)'
                        }}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Link>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {hasChanges ? "Save Changes" : "Saved"}
                            </>
                        )}
                    </Button>
                </div>
            </div>

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

                <div className="flex items-center gap-2">
                    <Label htmlFor="slug" className="text-sm whitespace-nowrap">URL:</Label>
                    <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => {
                            setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                            setHasChanges(true);
                        }}
                        className="w-48"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                    />
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

            {/* Element Edit Dialog */}
            <ElementEditDialog
                isOpen={isEditingElement}
                onClose={() => {
                    setIsEditingElement(false);
                    setSelectedElement(null);
                }}
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
        </div>
    );
}
