"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Wand2, Loader2, Eye, Edit3, Trash2, Plus, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { AIPageEditor } from "./AIPageEditor";
import ConfirmDialog from "@/components/ConfirmDialog";

interface AIPage {
    id: string;
    slug: string;
    prompt: string;
    style: string | null;
    colorScheme: string | null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export function AIPagesList() {
    const [pages, setPages] = useState<AIPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPage, setEditingPage] = useState<AIPage | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: "", message: "", onConfirm: () => { } });

    const fetchPages = async () => {
        try {
            const response = await fetch("/api/ai/pages");
            if (response.ok) {
                const data = await response.json();
                setPages(data);
            }
        } catch (error) {
            console.error("Error fetching AI pages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const handleDelete = (pageId: string, slug: string) => {
        setConfirmDialog({
            isOpen: true,
            title: "Delete AI Page",
            message: `Are you sure you want to delete "/${slug}"? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    const response = await fetch(`/api/ai/pages/${pageId}`, {
                        method: "DELETE",
                    });
                    if (response.ok) {
                        await fetchPages();
                    }
                } catch (error) {
                    console.error("Error deleting page:", error);
                }
                setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => { } });
            },
        });
    };

    if (editingPage) {
        return (
            <AIPageEditor
                page={editingPage}
                onBack={() => setEditingPage(null)}
                onSave={() => {
                    fetchPages();
                }}
            />
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
                        AI Generated Pages
                    </h2>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                        Manage your AI-generated link-in-bio pages
                    </p>
                </div>
                <Link href="/create/ai-generated">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Create New
                    </Button>
                </Link>
            </div>

            {/* Pages Grid */}
            {pages.length === 0 ? (
                <Card className="p-12 text-center" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                    <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        No AI Pages Yet
                    </h3>
                    <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                        Create your first AI-generated link-in-bio page
                    </p>
                    <Link href="/create/ai-generated">
                        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Create with AI
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pages.map((page) => (
                        <Card
                            key={page.id}
                            className="p-4 transition-all hover:shadow-lg"
                            style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate" style={{ color: 'var(--color-text-primary)' }}>
                                        /{page.slug}
                                    </h3>
                                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
                                        {page.prompt || "No description"}
                                    </p>
                                </div>
                                <span
                                    className="px-2 py-1 text-xs rounded-full ml-2"
                                    style={{
                                        backgroundColor: page.isPublished ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                                        color: page.isPublished ? '#10b981' : 'var(--color-text-secondary)'
                                    }}
                                >
                                    {page.isPublished ? "Published" : "Draft"}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--color-text-tertiary)' }}>
                                <span>{page.style || "modern"}</span>
                                <span>•</span>
                                <span>{page.colorScheme || "dark"}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setEditingPage(page)}
                                    className="flex-1"
                                >
                                    <Edit3 className="w-3 h-3 mr-1" />
                                    Edit
                                </Button>
                                <Link href={`/${page.slug}`} target="_blank" className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye className="w-3 h-3 mr-1" />
                                        View
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(page.id, page.slug)}
                                    className="text-red-500 hover:text-red-600 hover:border-red-500"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => { } })}
            />
        </div>
    );
}
