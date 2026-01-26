"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Loader2, GripVertical, Move, MousePointer, Trash2, Copy, ArrowUp, ArrowDown, Wand2 } from "lucide-react";

interface AIPagePreviewProps {
    html: string;
    onElementClick?: (element: HTMLElement, elementHtml: string, elementPath: string) => void;
    onElementDelete?: (elementPath: string) => void;
    onElementDuplicate?: (elementPath: string) => void;
    onElementMove?: (elementPath: string, direction: 'up' | 'down') => void;
    onHtmlChange?: (newHtml: string) => void;
    isEditing?: boolean;
}

// Context menu state
interface ContextMenuState {
    isOpen: boolean;
    x: number;
    y: number;
    element: HTMLElement | null;
    elementPath: string;
    elementHtml: string;
}

// Define which elements are considered "draggable sections" (grouped elements)
const DRAGGABLE_SECTION_TAGS = ['SECTION', 'ARTICLE', 'HEADER', 'FOOTER', 'NAV', 'ASIDE', 'MAIN'];
const POTENTIALLY_DRAGGABLE_TAGS = ['DIV', 'UL', 'OL', 'FIGURE', 'FORM'];

// Elements that should only be clickable for AI editing, not draggable
const CLICK_ONLY_TAGS = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'A', 'BUTTON', 'IMG', 'INPUT', 'TEXTAREA', 'LABEL', 'LI', 'STRONG', 'EM', 'B', 'I', 'CODE', 'PRE'];

export function AIPagePreview({ html, onElementClick, onElementDelete, onElementDuplicate, onElementMove, onHtmlChange, isEditing = false }: AIPagePreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const [hoveredElementType, setHoveredElementType] = useState<'draggable' | 'editable' | null>(null);
    const [iframeHeight, setIframeHeight] = useState(600);
    const [isDragging, setIsDragging] = useState(false);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        isOpen: false,
        x: 0,
        y: 0,
        element: null,
        elementPath: '',
        elementHtml: ''
    });

    // Check if an element is a draggable section/group
    const isDraggableSection = useCallback((element: HTMLElement): boolean => {
        const tagName = element.tagName;

        // Always draggable: semantic section tags
        if (DRAGGABLE_SECTION_TAGS.includes(tagName)) {
            return true;
        }

        // Potentially draggable: divs and lists with multiple children or significant content
        if (POTENTIALLY_DRAGGABLE_TAGS.includes(tagName)) {
            const childCount = element.children.length;
            const hasSignificantContent = Boolean(element.textContent && element.textContent.trim().length > 50);
            const hasMultipleBlockChildren = Array.from(element.children).filter(
                child => getComputedStyle(child).display === 'block' ||
                    DRAGGABLE_SECTION_TAGS.includes(child.tagName) ||
                    POTENTIALLY_DRAGGABLE_TAGS.includes(child.tagName)
            ).length >= 2;

            // A div is draggable if it has multiple children or is a substantial container
            return childCount >= 2 || hasMultipleBlockChildren || (childCount >= 1 && hasSignificantContent);
        }

        return false;
    }, []);

    // Find the nearest draggable parent section
    const findDraggableParent = useCallback((element: HTMLElement, body: HTMLElement): HTMLElement | null => {
        let current: HTMLElement | null = element;

        while (current && current !== body && current.tagName !== 'BODY' && current.tagName !== 'HTML') {
            if (isDraggableSection(current)) {
                return current;
            }
            current = current.parentElement;
        }

        return null;
    }, [isDraggableSection]);

    // Generate a unique path for an element
    const getElementPath = useCallback((element: HTMLElement, container: HTMLElement): string => {
        const path: string[] = [];
        let current: HTMLElement | null = element;

        while (current && current !== container) {
            const parent = current.parentElement;
            if (parent) {
                const siblings = Array.from(parent.children);
                const index = siblings.indexOf(current);
                const tagName = current.tagName.toLowerCase();
                path.unshift(`${tagName}:nth-child(${index + 1})`);
            }
            current = parent as HTMLElement;
        }

        return path.join(" > ");
    }, []);

    // Create the full HTML document for the iframe
    const getIframeContent = useCallback(() => {
        // Check if the HTML is already a complete document (from cloning)
        const trimmedHtml = html.trim().toLowerCase();
        const isFullDocument = trimmedHtml.startsWith('<!doctype') ||
            trimmedHtml.startsWith('<html') ||
            (trimmedHtml.includes('<html') && trimmedHtml.includes('<head'));

        if (isFullDocument) {
            // For cloned pages, use the HTML as-is (it's already a complete document)
            // Just add editing styles if in edit mode
            const editingStyles = isEditing ? `
                <style>
                    /* Editable element hover (click only) */
                    [data-editable-hover="true"] {
                        outline: 2px solid #a855f7 !important;
                        outline-offset: 1px !important;
                        cursor: pointer !important;
                    }
                    
                    /* Draggable section hover */
                    [data-draggable-hover="true"] {
                        outline: 2px solid #3b82f6 !important;
                        outline-offset: 2px !important;
                        cursor: grab !important;
                    }
                    
                    /* Dragging state */
                    [data-dragging="true"] {
                        opacity: 0.6 !important;
                        outline: 3px dashed #3b82f6 !important;
                    }
                    
                    /* Drop target */
                    [data-drop-target="true"] {
                        outline: 3px solid #22c55e !important;
                    }
                </style>
            ` : '';

            // Inject editing styles into the existing document
            if (editingStyles && html.toLowerCase().includes('</head>')) {
                return html.replace(/<\/head>/i, editingStyles + '</head>');
            }
            return html;
        }

        // For generated pages (partial HTML), wrap in a full document with Tailwind
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; min-height: 100vh; }
        
        /* Editable element hover (click only) */
        [data-editable-hover="true"] {
            outline: 2px solid #a855f7 !important;
            outline-offset: 1px !important;
            cursor: pointer !important;
        }
        
        /* Draggable section hover */
        [data-draggable-hover="true"] {
            outline: 2px solid #3b82f6 !important;
            outline-offset: 2px !important;
            cursor: grab !important;
            position: relative !important;
        }
        
        [data-draggable-hover="true"]::before {
            content: '⋮⋮' !important;
            position: absolute !important;
            top: 4px !important;
            left: 4px !important;
            background: rgba(59, 130, 246, 0.9) !important;
            color: white !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            font-size: 10px !important;
            font-weight: bold !important;
            z-index: 9999 !important;
            pointer-events: none !important;
        }
        
        /* Dragging state */
        [data-dragging="true"] {
            opacity: 0.6 !important;
            outline: 3px dashed #3b82f6 !important;
            outline-offset: 4px !important;
            cursor: grabbing !important;
        }
        
        /* Drop target */
        [data-drop-target="true"] {
            outline: 3px solid #22c55e !important;
            outline-offset: 6px !important;
        }
        
        [data-drop-target="true"]::after {
            content: 'Drop here' !important;
            position: absolute !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: rgba(34, 197, 94, 0.9) !important;
            color: white !important;
            padding: 4px 12px !important;
            border-radius: 6px !important;
            font-size: 12px !important;
            font-weight: bold !important;
            z-index: 9999 !important;
            pointer-events: none !important;
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;
    }, [html, isEditing]);

    // Set up iframe content and event handlers
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !html) return;

        const doc = iframe.contentDocument;
        if (!doc) return;

        // Write the content
        doc.open();
        doc.write(getIframeContent());
        doc.close();

        // Adjust iframe height to content
        const adjustHeight = () => {
            if (doc.body) {
                const height = doc.body.scrollHeight || 600;
                setIframeHeight(Math.max(height, 400));
            }
        };
        setTimeout(adjustHeight, 100);
        setTimeout(adjustHeight, 500);

        // Only add interaction handlers if in edit mode
        if (!isEditing) return;

        const body = doc.body;
        if (!body) return;

        let currentDragElement: HTMLElement | null = null;
        let currentDropTarget: HTMLElement | null = null;
        let mouseDownPos = { x: 0, y: 0 };
        let hasMoved = false;
        let clickedElement: HTMLElement | null = null;
        let draggableParent: HTMLElement | null = null;
        const DRAG_THRESHOLD = 8; // Slightly higher threshold to prevent accidental drags

        // Clear all hover states
        const clearHoverStates = () => {
            doc.querySelectorAll('[data-editable-hover="true"]').forEach(el => el.removeAttribute('data-editable-hover'));
            doc.querySelectorAll('[data-draggable-hover="true"]').forEach(el => el.removeAttribute('data-draggable-hover'));
        };

        const handleMouseOver = (e: MouseEvent) => {
            if (currentDragElement) return; // Don't hover while dragging

            const target = e.target as HTMLElement;
            if (!target || target === body || target.tagName === 'BODY' || target.tagName === 'HTML') return;

            e.stopPropagation();
            clearHoverStates();

            const path = getElementPath(target, body);
            setHoveredPath(path);

            // Check if this element is draggable or just editable
            if (isDraggableSection(target)) {
                target.setAttribute('data-draggable-hover', 'true');
                setHoveredElementType('draggable');
            } else {
                target.setAttribute('data-editable-hover', 'true');
                setHoveredElementType('editable');
            }
        };

        const handleMouseOut = (e: MouseEvent) => {
            if (currentDragElement) return; // Don't unhover while dragging

            const target = e.target as HTMLElement;
            if (target) {
                target.removeAttribute('data-editable-hover');
                target.removeAttribute('data-draggable-hover');
            }
            setHoveredPath(null);
            setHoveredElementType(null);
        };

        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target || target === body || target.tagName === 'BODY' || target.tagName === 'HTML') return;

            // Store mouse position and element for potential drag or click
            mouseDownPos = { x: e.clientX, y: e.clientY };
            hasMoved = false;
            clickedElement = target;

            // Pre-calculate draggable parent
            draggableParent = isDraggableSection(target) ? target : findDraggableParent(target, body);
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!clickedElement) return;

            // Calculate distance moved
            const dx = Math.abs(e.clientX - mouseDownPos.x);
            const dy = Math.abs(e.clientY - mouseDownPos.y);

            // Check if we've moved enough to start dragging
            if (!currentDragElement && (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD)) {
                // Only allow dragging if the element or its parent is a draggable section
                if (!draggableParent) {
                    // Not a draggable element - just mark as moved to prevent click
                    hasMoved = true;
                    return;
                }

                hasMoved = true;
                currentDragElement = draggableParent;
                currentDragElement.setAttribute('data-dragging', 'true');
                currentDragElement.removeAttribute('data-draggable-hover');
                currentDragElement.removeAttribute('data-editable-hover');
                setIsDragging(true);
                clearHoverStates();
            }

            if (!currentDragElement) return;

            e.preventDefault();

            // Find other draggable sections as potential drop targets
            const elementsAtPoint = doc.elementsFromPoint(e.clientX, e.clientY);
            let potentialTarget: HTMLElement | null = null;

            for (const elem of elementsAtPoint) {
                const htmlElem = elem as HTMLElement;
                if (htmlElem !== currentDragElement &&
                    htmlElem !== body &&
                    htmlElem.tagName !== 'BODY' &&
                    htmlElem.tagName !== 'HTML') {
                    // Only allow dropping on other draggable sections
                    const targetDraggable: HTMLElement | null = isDraggableSection(htmlElem) ? htmlElem : findDraggableParent(htmlElem, body);
                    if (targetDraggable && targetDraggable !== currentDragElement) {
                        potentialTarget = targetDraggable;
                        break;
                    }
                }
            }

            // Clear previous drop target
            if (currentDropTarget && currentDropTarget !== potentialTarget) {
                currentDropTarget.removeAttribute('data-drop-target');
            }

            if (potentialTarget) {
                currentDropTarget = potentialTarget;
                currentDropTarget.setAttribute('data-drop-target', 'true');
            } else {
                currentDropTarget = null;
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            const wasClick = !hasMoved && clickedElement;
            const wasDrag = currentDragElement !== null;

            // Handle click (no significant movement) - for AI editing
            if (wasClick && clickedElement && onElementClick) {
                const elementPath = getElementPath(clickedElement, body);
                console.log('Element clicked (for AI edit):', clickedElement.tagName, elementPath);
                onElementClick(clickedElement, clickedElement.outerHTML, elementPath);
            }

            // Handle drop (if it was a valid drag of a section)
            if (wasDrag && currentDragElement) {
                if (currentDropTarget && currentDropTarget !== currentDragElement) {
                    const parent = currentDropTarget.parentElement;
                    if (parent) {
                        // Remove the dragged element from its current position
                        currentDragElement.remove();

                        // Determine if we should insert before or after based on mouse position
                        const rect = currentDropTarget.getBoundingClientRect();
                        const midY = rect.top + rect.height / 2;

                        if (e.clientY < midY) {
                            parent.insertBefore(currentDragElement, currentDropTarget);
                        } else {
                            if (currentDropTarget.nextSibling) {
                                parent.insertBefore(currentDragElement, currentDropTarget.nextSibling);
                            } else {
                                parent.appendChild(currentDragElement);
                            }
                        }

                        // Notify parent of HTML change
                        if (onHtmlChange) {
                            onHtmlChange(doc.body.innerHTML);
                        }
                    }
                }

                // Clean up drag state
                currentDragElement.removeAttribute('data-dragging');
            }

            if (currentDropTarget) {
                currentDropTarget.removeAttribute('data-drop-target');
            }

            // Reset all state
            currentDragElement = null;
            currentDropTarget = null;
            clickedElement = null;
            draggableParent = null;
            hasMoved = false;
            setIsDragging(false);
        };

        // Handle right-click for context menu
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
            const target = e.target as HTMLElement;
            if (!target || target === body || target.tagName === 'BODY' || target.tagName === 'HTML') return;

            const path = getElementPath(target, body);
            const rect = containerRef.current?.getBoundingClientRect();
            const iframeRect = iframeRef.current?.getBoundingClientRect();

            if (rect && iframeRect) {
                // Calculate position relative to container
                const x = Math.min(e.clientX - rect.left, rect.width - 180);
                const y = e.clientY - rect.top;

                setContextMenu({
                    isOpen: true,
                    x,
                    y,
                    element: target,
                    elementPath: path,
                    elementHtml: target.outerHTML
                });
            }
        };

        body.addEventListener('mouseover', handleMouseOver);
        body.addEventListener('mouseout', handleMouseOut);
        body.addEventListener('mousedown', handleMouseDown);
        body.addEventListener('mousemove', handleMouseMove);
        body.addEventListener('mouseup', handleMouseUp);
        body.addEventListener('contextmenu', handleContextMenu);

        // Also listen on document for when mouse leaves the body
        doc.addEventListener('mouseup', handleMouseUp);

        return () => {
            body.removeEventListener('mouseover', handleMouseOver);
            body.removeEventListener('mouseout', handleMouseOut);
            body.removeEventListener('mousedown', handleMouseDown);
            body.removeEventListener('mousemove', handleMouseMove);
            body.removeEventListener('mouseup', handleMouseUp);
            body.removeEventListener('contextmenu', handleContextMenu);
            doc.removeEventListener('mouseup', handleMouseUp);
        };
    }, [html, isEditing, onElementClick, onHtmlChange, getElementPath, getIframeContent, isDraggableSection, findDraggableParent]);

    if (!html) {
        return (
            <div className="flex items-center justify-center h-96 rounded-lg border border-dashed"
                style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-tertiary)' }}>
                <div className="text-center space-y-2">
                    <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-400" />
                    <p style={{ color: 'var(--color-text-secondary)' }}>Waiting for AI generation...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative"
            onClick={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
        >
            {/* Enhanced editing mode indicator */}
            {isEditing && (
                <div className="absolute top-2 left-2 z-10 flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-2">
                        <MousePointer className="w-3 h-3" />
                        <span>Click → AI edit</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-2">
                        <Move className="w-3 h-3" />
                        <span>Drag sections → Reorder</span>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-500/20 text-gray-300 border border-gray-500/30 flex items-center gap-2">
                        <span>Right-click → Quick actions</span>
                    </div>
                </div>
            )}

            <iframe
                ref={iframeRef}
                className="w-full rounded-lg overflow-hidden shadow-2xl border-0"
                style={{
                    height: `${iframeHeight}px`,
                    backgroundColor: 'white',
                }}
                title="AI Generated Preview"
                sandbox="allow-scripts allow-same-origin"
            />

            {/* Dragging indicator */}
            {isEditing && isDragging && (
                <div className="absolute top-2 right-2 z-10 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/20 text-green-300 border border-green-500/30 flex items-center gap-2">
                    <GripVertical className="w-3 h-3" />
                    Drop on another section
                </div>
            )}

            {/* Hovered element info with type indicator */}
            {isEditing && hoveredPath && !isDragging && !contextMenu.isOpen && (
                <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${hoveredElementType === 'draggable'
                        ? 'bg-blue-500/30 text-blue-300 border border-blue-500/30'
                        : 'bg-purple-500/30 text-purple-300 border border-purple-500/30'
                        }`}>
                        {hoveredElementType === 'draggable' ? (
                            <><Move className="w-3 h-3 inline mr-1" /> Section (Draggable)</>
                        ) : (
                            <><MousePointer className="w-3 h-3 inline mr-1" /> Element (Click to Edit)</>
                        )}
                    </div>
                    <div className="px-2 py-1 rounded text-xs font-mono bg-black/70 text-green-400 max-w-sm truncate">
                        {hoveredPath}
                    </div>
                </div>
            )}

            {/* Context Menu */}
            {contextMenu.isOpen && (
                <div
                    className="absolute z-50 min-w-[160px] rounded-lg shadow-2xl border overflow-hidden"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                        backgroundColor: 'var(--color-bg-secondary)',
                        borderColor: 'var(--color-border)'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="py-1">
                        <button
                            onClick={() => {
                                if (onElementClick && contextMenu.element) {
                                    onElementClick(contextMenu.element, contextMenu.elementHtml, contextMenu.elementPath);
                                }
                                setContextMenu(prev => ({ ...prev, isOpen: false }));
                            }}
                            className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-purple-500/20 transition-colors"
                            style={{ color: 'var(--color-text-primary)' }}
                        >
                            <Wand2 className="w-4 h-4 text-purple-400" />
                            Edit with AI
                        </button>

                        {onElementDuplicate && (
                            <button
                                onClick={() => {
                                    onElementDuplicate(contextMenu.elementPath);
                                    setContextMenu(prev => ({ ...prev, isOpen: false }));
                                }}
                                className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-white/10 transition-colors"
                                style={{ color: 'var(--color-text-primary)' }}
                            >
                                <Copy className="w-4 h-4 text-blue-400" />
                                Duplicate
                            </button>
                        )}

                        {onElementMove && (
                            <>
                                <button
                                    onClick={() => {
                                        onElementMove(contextMenu.elementPath, 'up');
                                        setContextMenu(prev => ({ ...prev, isOpen: false }));
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-white/10 transition-colors"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    <ArrowUp className="w-4 h-4 text-cyan-400" />
                                    Move Up
                                </button>
                                <button
                                    onClick={() => {
                                        onElementMove(contextMenu.elementPath, 'down');
                                        setContextMenu(prev => ({ ...prev, isOpen: false }));
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-white/10 transition-colors"
                                    style={{ color: 'var(--color-text-primary)' }}
                                >
                                    <ArrowDown className="w-4 h-4 text-cyan-400" />
                                    Move Down
                                </button>
                            </>
                        )}

                        {onElementDelete && (
                            <>
                                <div className="border-t my-1" style={{ borderColor: 'var(--color-border)' }} />
                                <button
                                    onClick={() => {
                                        onElementDelete(contextMenu.elementPath);
                                        setContextMenu(prev => ({ ...prev, isOpen: false }));
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-red-500/20 transition-colors text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
