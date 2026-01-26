"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import ConfirmDialog from "@/components/ConfirmDialog";
import {
  Plus, GripVertical, Pencil, Trash2, Image as ImageIcon,
  Palette, Type, Square, LogOut, Link2, ExternalLink,
  ChevronDown, Copy, Check, Eye, Search, MoreVertical, Share2,
  Facebook, Twitter, Linkedin, Mail, MessageCircle, Wand2,
  BarChart2
} from "lucide-react";
import * as Icons from "lucide-react";
import React from "react";
import { AIPagesList } from "@/components/ai/AIPagesList";
import { AnalyticsView } from "@/components/dashboard/AnalyticsView";
import { TAPView } from "@/components/dashboard/TAPView";

interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  order: number;
  enabled: boolean;
  buttonColor?: string;
  textColor?: string;
  iconColor?: string;
  borderColor?: string;
  buttonStyle?: string;
  borderStyle?: string;
  shadow?: string;
  animation?: string;
  glowColor?: string;
}

interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  backgroundColor?: string;
  backgroundType?: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientDirection?: string;
  profileTextColor?: string;
  profileBioColor?: string;
  profileAccentColor?: string;
  fontFamily?: string;
  linkButtonStyle?: string;
  linkButtonColor?: string;
  linkButtonTextColor?: string;
  linkButtonBorder?: string;
  linkButtonBorderColor?: string;
  linkButtonShadow?: string;
  linkButtonAnimation?: string;
  linkButtonGlowColor?: string;
  avatarBorderColor?: string;
  avatarBorderWidth?: number;
  links: Link[];
}

type DesignTab = "header" | "theme" | "wallpaper" | "text" | "buttons" | "colors" | "footer";

export default function DashboardPage() {
  const router = useRouter();
  const [activeMainTab, setActiveMainTab] = useState<"links" | "design" | "ai-pages" | "analytics" | "tap">("links");
  const [activeDesignTab, setActiveDesignTab] = useState<DesignTab>("header");
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [showAddLink, setShowAddLink] = useState(false);
  const [linkForm, setLinkForm] = useState({ title: "", url: "", icon: "" });
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [customizingLinkIndex, setCustomizingLinkIndex] = useState<number | null>(null);
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState<number | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState<number | null>(null);
  const [iconSearchQuery, setIconSearchQuery] = useState("");
  const [draggedLinkId, setDraggedLinkId] = useState<string | null>(null);
  const [dragOverLinkId, setDragOverLinkId] = useState<string | null>(null);
  const [previewLinks, setPreviewLinks] = useState<Link[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => { } });
  const [shareMenuOpen, setShareMenuOpen] = useState<string | null>(null);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  // Helper to get CSS variable value as hex
  const getCSSVar = (varName: string, fallback: string = "#000000"): string => {
    if (typeof window === "undefined") return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || fallback;
  };

  // Appearance form
  const [appearanceForm, setAppearanceForm] = useState({
    displayName: "",
    bio: "",
    avatarUrl: "",
    backgroundColor: "#ffffff",
    backgroundType: "solid",
    backgroundGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    backgroundImage: "",
    gradientColor1: "#667eea",
    gradientColor2: "#764ba2",
    gradientDirection: "135deg",
    profileTextColor: "#000000",
    profileBioColor: "#64748b",
    profileAccentColor: "#8129d9",
    fontFamily: "Inter",
    linkButtonStyle: "rounded",
    linkButtonColor: "#8129d9",
    linkButtonTextColor: "#ffffff",
    linkButtonBorder: "none",
    linkButtonBorderColor: "#8129d9",
    linkButtonShadow: "none",
    linkButtonAnimation: "none",
    linkButtonGlowColor: "#8129d9",
    avatarBorderColor: "#ffffff",
    avatarBorderWidth: 0,
  });

  // Get all available lucide icons
  const availableIcons = useMemo(() => {
    const iconNames = Object.keys(Icons).filter(
      (key) => key !== "createReactComponent" && typeof Icons[key as keyof typeof Icons] === "object"
    );
    return iconNames;
  }, []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!iconSearchQuery) return availableIcons.slice(0, 100);
    return availableIcons.filter((name) =>
      name.toLowerCase().includes(iconSearchQuery.toLowerCase())
    ).slice(0, 100);
  }, [iconSearchQuery, availableIcons]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  useEffect(() => {
    if (selectedProfile) {
      console.log('=== useEffect triggered by selectedProfile change ===');
      console.log('Selected profile ID:', selectedProfile.id);
      console.log('Setting preview links from selectedProfile:', JSON.stringify(selectedProfile.links.map(l => ({ id: l.id, title: l.title, enabled: l.enabled }))));
      setPreviewLinks(selectedProfile.links);
      setAppearanceForm({
        displayName: selectedProfile.displayName || "",
        bio: selectedProfile.bio || "",
        avatarUrl: selectedProfile.avatarUrl || "",
        backgroundColor: selectedProfile.backgroundColor || "#ffffff",
        backgroundType: selectedProfile.backgroundType || "solid",
        backgroundGradient: selectedProfile.backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        backgroundImage: selectedProfile.backgroundImage || "",
        gradientColor1: selectedProfile.gradientColor1 || "#667eea",
        gradientColor2: selectedProfile.gradientColor2 || "#764ba2",
        gradientDirection: selectedProfile.gradientDirection || "135deg",
        profileTextColor: selectedProfile.profileTextColor || "#000000",
        profileBioColor: selectedProfile.profileBioColor || "#64748b",
        profileAccentColor: selectedProfile.profileAccentColor || "#8129d9",
        fontFamily: selectedProfile.fontFamily || "Inter",
        linkButtonStyle: selectedProfile.linkButtonStyle || "rounded",
        linkButtonColor: selectedProfile.linkButtonColor || "#8129d9",
        linkButtonTextColor: selectedProfile.linkButtonTextColor || "#ffffff",
        linkButtonBorder: selectedProfile.linkButtonBorder || "none",
        linkButtonBorderColor: selectedProfile.linkButtonBorderColor || "#8129d9",
        linkButtonShadow: selectedProfile.linkButtonShadow || "none",
        linkButtonAnimation: selectedProfile.linkButtonAnimation || "none",
        linkButtonGlowColor: selectedProfile.linkButtonGlowColor || "#8129d9",
        avatarBorderColor: selectedProfile.avatarBorderColor || "#ffffff",
        avatarBorderWidth: selectedProfile.avatarBorderWidth || 0,
      });
    }
  }, [selectedProfile]);

  // Debug: Track when previewLinks changes
  useEffect(() => {
    console.log('=== previewLinks state updated ===');
    console.log('Preview links:', JSON.stringify(previewLinks.map(l => ({ id: l.id, title: l.title, enabled: l.enabled }))));
  }, [previewLinks]);

  const fetchProfiles = async () => {
    try {
      const response = await fetch("/api/profiles");
      if (response.ok) {
        const data = await response.json();
        console.log('=== fetchProfiles called ===');
        console.log('Raw API response:', JSON.stringify(data, null, 2));
        setProfiles(data);
        if (data.length > 0) {
          if (!selectedProfile) {
            console.log('No selected profile, setting first profile');
            setSelectedProfile(data[0]);
          } else {
            // Update the selected profile with fresh data
            // IMPORTANT: Create a new object to trigger React re-render
            const updated = data.find((p: Profile) => p.id === selectedProfile.id);
            if (updated) {
              console.log('Found updated profile. Links:', JSON.stringify(updated.links.map((l: Link) => ({ id: l.id, title: l.title, enabled: l.enabled }))));
              setSelectedProfile(updated);
            } else {
              console.log('Selected profile not found in response');
            }
          }
        }
      } else {
        console.error('Failed to fetch profiles, status:', response.status);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    try {
      const response = await fetch(`/api/profiles/${selectedProfile.id}/links`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkForm),
      });

      if (response.ok) {
        await fetchProfiles();
        setShowAddLink(false);
        setLinkForm({ title: "", url: "", icon: "" });
      }
    } catch (error) {
      console.error("Error adding link:", error);
    }
  };

  const handleUpdateLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(linkForm),
      });

      if (response.ok) {
        await fetchProfiles();
        setEditingLinkId(null);
        setLinkForm({ title: "", url: "", icon: "" });
      }
    } catch (error) {
      console.error("Error updating link:", error);
    }
  };

  const handleDeleteLink = (linkId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "Delete Link",
      message: "Are you sure you want to delete this link? This action cannot be undone.",
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/links/${linkId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            await fetchProfiles();
          }
        } catch (error) {
          console.error("Error deleting link:", error);
        }
        setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => { } });
      },
    });
  };

  const handleDeleteLinkConfirmed = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchProfiles();
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleDragStart = (e: React.DragEvent, linkId: string) => {
    setDraggedLinkId(linkId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", linkId);

    // Create a more polished drag image
    if (e.currentTarget instanceof HTMLElement) {
      const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
      dragImage.style.position = "absolute";
      dragImage.style.top = "-9999px";
      dragImage.style.width = e.currentTarget.offsetWidth + "px";
      dragImage.style.opacity = "0.8";
      dragImage.style.transform = "rotate(2deg)";
      dragImage.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
      document.body.appendChild(dragImage);
      e.dataTransfer.setDragImage(dragImage, e.currentTarget.offsetWidth / 2, 30);
      setTimeout(() => document.body.removeChild(dragImage), 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, linkId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedLinkId || draggedLinkId === linkId) {
      return;
    }

    setDragOverLinkId(linkId);
    e.dataTransfer.dropEffect = "move";

    // Update preview in real-time for smooth reordering
    if (!selectedProfile) return;

    const links = [...previewLinks];
    const draggedIndex = links.findIndex(l => l.id === draggedLinkId);
    const targetIndex = links.findIndex(l => l.id === linkId);

    if (draggedIndex === -1 || targetIndex === -1) return;
    if (draggedIndex === targetIndex) return;

    const [removed] = links.splice(draggedIndex, 1);
    links.splice(targetIndex, 0, removed);
    setPreviewLinks(links);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedLinkId(null);
    setDragOverLinkId(null);
  };

  const handleDrop = async (e: React.DragEvent, targetLinkId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedProfile || !draggedLinkId) {
      setDraggedLinkId(null);
      setDragOverLinkId(null);
      return;
    }

    const links = [...previewLinks];
    const updates = links.map((link, index) => ({
      id: link.id,
      order: index
    }));

    // Clear drag state
    setDraggedLinkId(null);
    setDragOverLinkId(null);

    try {
      // Update all link orders
      await Promise.all(
        updates.map(update =>
          fetch(`/api/links/${update.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: update.order }),
          })
        )
      );
      await fetchProfiles();
    } catch (error) {
      console.error("Error reordering links:", error);
      // Revert on error
      if (selectedProfile) {
        setPreviewLinks(selectedProfile.links);
      }
    }
  };

  const handleUpdateAppearance = async () => {
    if (!selectedProfile) return;

    try {
      const response = await fetch(`/api/profiles/${selectedProfile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appearanceForm),
      });

      if (response.ok) {
        await fetchProfiles();
      }
    } catch (error) {
      console.error("Error updating appearance:", error);
    }
  };

  const handleSignOut = () => {
    setConfirmDialog({
      isOpen: true,
      title: "Sign Out",
      message: "Are you sure you want to sign out?",
      onConfirm: () => {
        const ssoUrl = process.env.NEXT_PUBLIC_SSO_URL || "https://sso.entro.ly";
        window.location.href = `${ssoUrl}/api/auth/logout?callbackUrl=${encodeURIComponent("https://entro.ly")}`;
      },
    });
  };

  const copyProfileUrl = async () => {
    if (!selectedProfile) return;
    const url = `${window.location.origin}/${selectedProfile.username}`;
    await navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const openProfilePreview = () => {
    if (!selectedProfile) return;
    window.open(`/${selectedProfile.username}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-base)' }}>
        <div style={{ color: 'var(--color-success)' }}>Loading...</div>
      </div>
    );
  }

  const getBackgroundStyle = () => {
    if (appearanceForm.backgroundType === "gradient") {
      return { background: appearanceForm.backgroundGradient };
    } else if (appearanceForm.backgroundType === "image" && appearanceForm.backgroundImage) {
      return {
        backgroundImage: `url(${appearanceForm.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      };
    }
    return { backgroundColor: appearanceForm.backgroundColor };
  };

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const getButtonStyle = (isHovered = false, link?: Link) => {
    const buttonColor = link?.buttonColor || appearanceForm.linkButtonColor;
    const textColor = link?.textColor || appearanceForm.linkButtonTextColor;
    const borderStyle = link?.borderStyle || appearanceForm.linkButtonBorder;
    const borderColor = link?.borderColor || appearanceForm.linkButtonBorderColor;
    const buttonShape = link?.buttonStyle || appearanceForm.linkButtonStyle;
    const shadowSize = link?.shadow || appearanceForm.linkButtonShadow;
    const animation = link?.animation || appearanceForm.linkButtonAnimation;
    const glowColor = link?.glowColor || appearanceForm.linkButtonGlowColor;

    const style: React.CSSProperties = {
      backgroundColor: buttonColor,
      color: textColor,
    };

    // Handle border styles
    if (borderStyle === "solid") {
      style.border = `2px solid ${borderColor}`;
    } else if (borderStyle === "gradient") {
      style.border = "2px solid transparent";
      style.backgroundImage = `linear-gradient(${buttonColor}, ${buttonColor}), linear-gradient(135deg, ${borderColor}, ${appearanceForm.profileAccentColor})`;
      style.backgroundOrigin = "border-box";
      style.backgroundClip = "padding-box, border-box";
    }

    if (buttonShape === "pill") {
      style.borderRadius = "9999px";
    } else if (buttonShape === "square") {
      style.borderRadius = "4px";
    } else {
      style.borderRadius = "12px";
    }

    // Add shadow
    const shadowMap = {
      "none": "none",
      "sm": isHovered ? "0 2px 4px 0 rgb(0 0 0 / 0.1)" : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
      "md": isHovered ? "0 6px 10px -1px rgb(0 0 0 / 0.15)" : "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      "lg": isHovered ? "0 15px 20px -3px rgb(0 0 0 / 0.15)" : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
      "xl": isHovered ? "0 25px 35px -5px rgb(0 0 0 / 0.15)" : "0 20px 25px -5px rgb(0 0 0 / 0.1)",
    };
    style.boxShadow = shadowMap[shadowSize as keyof typeof shadowMap] || shadowMap["md"];

    // Add glow effect if animation is glow and hovered
    if (animation === "glow" && isHovered) {
      const rgbaGlow = hexToRgba(glowColor || "#8129d9", 0.5);
      style.filter = `drop-shadow(0 0 20px ${rgbaGlow})`;
    }

    return style;
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--color-bg-base)' }}>
      {/* Top Navigation */}
      <header className="h-16 px-6 flex items-center justify-between backdrop-blur-xl sticky top-0 z-50 shadow-sm" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              onClick={() => setShowProfileSelector(!showProfileSelector)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl transition-all"
              style={{ backgroundColor: showProfileSelector ? 'var(--color-bg-tertiary)' : 'transparent' }}
              onMouseEnter={(e) => !showProfileSelector && (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)')}
              onMouseLeave={(e) => !showProfileSelector && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {selectedProfile?.avatarUrl ? (
                <img
                  src={selectedProfile.avatarUrl}
                  alt={selectedProfile.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                  <Type className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{selectedProfile?.displayName || selectedProfile?.username}</span>
              <ChevronDown className="w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
            </button>

            {showProfileSelector && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                {profiles.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => {
                      setSelectedProfile(profile);
                      setShowProfileSelector(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 transition-all"
                    style={{ backgroundColor: selectedProfile?.id === profile.id ? 'var(--color-success)/0.1' : 'transparent' }}
                    onMouseEnter={(e) => selectedProfile?.id !== profile.id && (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)')}
                    onMouseLeave={(e) => selectedProfile?.id !== profile.id && (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt={profile.username} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-success), var(--color-primary))' }}>
                        <Type className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{profile.displayName || profile.username}</div>
                      <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>@{profile.username}</div>
                    </div>
                    {selectedProfile?.id === profile.id && (
                      <Check className="w-4 h-4" style={{ color: 'var(--color-success)' }} />
                    )}
                  </button>
                ))}
                <div style={{ borderTop: '1px solid var(--color-border)' }}>
                  <button
                    onClick={() => {
                      router.push("/create");
                      setShowProfileSelector(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 transition-all"
                    style={{ color: 'var(--color-success)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-semibold">New Profile</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            onClick={copyProfileUrl}
            variant="outline"
            size="sm"
          >
            {copiedUrl ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
            {copiedUrl ? "Copied!" : "Copy URL"}
          </Button>
          <Button
            onClick={openProfilePreview}
            variant="outline"
            size="sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        </div>
      </header>

      <div className="flex-1 flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-56 flex-shrink-0 backdrop-blur-xl p-4 flex flex-col shadow-sm overflow-y-auto" style={{ borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
          <div className="space-y-2">
            <button
              onClick={() => setActiveMainTab("links")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg"
              style={{
                background: activeMainTab === "links" ? 'linear-gradient(135deg, var(--color-success), var(--color-primary))' : 'transparent',
                color: activeMainTab === "links" ? '#ffffff' : 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => activeMainTab !== "links" && (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)', e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => activeMainTab !== "links" && (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <Link2 className="w-5 h-5" />
              <span>Links</span>
            </button>
            <button
              onClick={() => setActiveMainTab("design")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg"
              style={{
                background: activeMainTab === "design" ? 'linear-gradient(135deg, var(--color-primary), var(--color-success))' : 'transparent',
                color: activeMainTab === "design" ? '#ffffff' : 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => activeMainTab !== "design" && (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)', e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => activeMainTab !== "design" && (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <Palette className="w-5 h-5" />
              <span>Appearance</span>
            </button>
            <button
              onClick={() => setActiveMainTab("ai-pages")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg"
              style={{
                background: activeMainTab === "ai-pages" ? 'linear-gradient(135deg, #8b5cf6, #ec4899)' : 'transparent',
                color: activeMainTab === "ai-pages" ? '#ffffff' : 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => activeMainTab !== "ai-pages" && (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)', e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => activeMainTab !== "ai-pages" && (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <Wand2 className="w-5 h-5" />
              <span>AI Pages</span>
            </button>
            <button
              onClick={() => setActiveMainTab("analytics")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg"
              style={{
                background: activeMainTab === "analytics" ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'transparent',
                color: activeMainTab === "analytics" ? '#ffffff' : 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => activeMainTab !== "analytics" && (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)', e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => activeMainTab !== "analytics" && (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <BarChart2 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
            <button
              onClick={() => setActiveMainTab("tap")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg"
              style={{
                background: activeMainTab === "tap" ? 'linear-gradient(135deg, #FF0050, #D60043)' : 'transparent',
                color: activeMainTab === "tap" ? '#ffffff' : 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => activeMainTab !== "tap" && (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)', e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => activeMainTab !== "tap" && (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <Icons.ShoppingBag className="w-5 h-5" />
              <span>TAP</span>
            </button>
          </div>

          {/* Bottom Section - Commission, Leaderboard, Sign Out */}
          <div className="mt-auto pt-4 space-y-2" style={{ borderTop: '1px solid var(--color-border)' }}>
            {/* Commission Button */}
            {/* <button
              onClick={() => router.push("/commission")}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: 'transparent',
                color: 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)', e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <Icons.DollarSign className="w-5 h-5" />
              <span>Commission</span>
            </button> */}
            <a
              href="https://rank.entro.ly"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: 'transparent',
                color: 'var(--color-text-secondary)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-bg-tertiary)', e.currentTarget.style.color = 'var(--color-text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <Icons.Trophy className="w-5 h-5" />
              <span>Leaderboard</span>
              <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
            </a>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full transition-all"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-error)/0.1', e.currentTarget.style.borderColor = 'var(--color-error)', e.currentTarget.style.color = 'var(--color-error)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.borderColor = 'var(--color-border)', e.currentTarget.style.color = 'var(--color-text-secondary)')}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex overflow-hidden">
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            {activeMainTab === "links" && selectedProfile && (
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Manage Links</h1>
                  <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    <span className="font-bold" style={{ color: 'var(--color-success)' }}>{selectedProfile.links.length}</span> links
                  </div>
                </div>

                {/* Profile Info Card */}
                <Card className="p-6 mb-6">
                  <div className="flex items-center space-x-4">
                    {appearanceForm.avatarUrl ? (
                      <img
                        src={appearanceForm.avatarUrl}
                        alt={appearanceForm.displayName}
                        className="w-16 h-16 rounded-full object-cover"
                        style={{ border: '2px solid var(--color-success)/0.3' }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-success), var(--color-primary))' }}>
                        <Type className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{appearanceForm.displayName || selectedProfile.username}</h2>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>@{selectedProfile.username}</p>
                      {appearanceForm.bio && (
                        <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>{appearanceForm.bio}</p>
                      )}
                    </div>
                    <Button
                      onClick={openProfilePreview}
                      variant="outline"
                      size="sm"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live
                    </Button>
                  </div>
                </Card>

                {/* Add Link Button */}
                <Button
                  onClick={() => setShowAddLink(true)}
                  className="w-full py-6 mb-6 font-semibold flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Link
                </Button>

                {/* Links List */}
                <div className="space-y-3">
                  {previewLinks.length === 0 ? (
                    <Card className="p-12 text-center">
                      <Link2 className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-border)' }} />
                      <p className="mb-2 font-semibold" style={{ color: 'var(--color-text-secondary)' }}>No links yet</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-tertiary)' }}>Click "Add New Link" above to get started!</p>
                    </Card>
                  ) : (
                    previewLinks.map((link, index) => (
                      <div key={link.id} className="space-y-2">
                        <div
                          draggable
                          onDragStart={(e) => handleDragStart(e, link.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, link.id)}
                          onDrop={(e) => handleDrop(e, link.id)}
                          className={`cursor-move transition-all duration-200 ease-out ${draggedLinkId === link.id ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
                            }`}
                        >
                          <Card
                            className="p-4 transition-all duration-200 ease-out"
                            style={{
                              border: dragOverLinkId === link.id && draggedLinkId !== link.id ? '1px solid var(--color-success)' : '1px solid var(--color-border)',
                              boxShadow: dragOverLinkId === link.id && draggedLinkId !== link.id ? '0 25px 50px -12px var(--color-success)/0.25' : 'none',
                              transform: dragOverLinkId === link.id && draggedLinkId !== link.id ? 'translateY(-4px)' : 'translateY(0)',
                              opacity: (link.enabled !== undefined ? !link.enabled : false) ? 0.5 : 1
                            }}
                            onMouseEnter={(e) => dragOverLinkId !== link.id && (e.currentTarget.style.borderColor = 'var(--color-success)/0.3')}
                            onMouseLeave={(e) => dragOverLinkId !== link.id && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="cursor-grab active:cursor-grabbing transition-all p-1 -ml-1" style={{ color: 'var(--color-text-tertiary)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-success)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}>
                                <GripVertical className="w-5 h-5" />
                              </div>

                              <div className="flex-1">
                                {editingLinkId === link.id ? (
                                  <div className="space-y-3">
                                    <div>
                                      <Label className="text-xs">Link Title</Label>
                                      <Input
                                        value={linkForm.title}
                                        onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                                        placeholder="My Website"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-xs">URL</Label>
                                      <Input
                                        value={linkForm.url}
                                        onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                                        placeholder="https://example.com"
                                      />
                                    </div>
                                    <div className="relative">
                                      <Label className="text-xs">Icon</Label>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIconPickerOpen(iconPickerOpen === -1 ? null : -1)}
                                        className="w-full justify-between h-9 mt-1"
                                      >
                                        <span className="flex items-center gap-2">
                                          {linkForm.icon ? (
                                            React.createElement(
                                              (Icons[linkForm.icon as keyof typeof Icons] as React.ElementType) || Icons.Link2,
                                              { size: 16 }
                                            )
                                          ) : (
                                            <span className="text-lg">{linkForm.icon || "🔗"}</span>
                                          )}
                                          <span>{linkForm.icon || "Select Icon"}</span>
                                        </span>
                                        <span className="text-gray-400">▼</span>
                                      </Button>

                                      {iconPickerOpen === -1 && (
                                        <div className="fixed z-[100] mt-2 w-96 max-h-96 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl" style={{ backgroundColor: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                                          <div className="p-3 sticky top-0 backdrop-blur-sm" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                                            <div className="relative">
                                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-text-tertiary)' }} />
                                              <Input
                                                type="text"
                                                placeholder="Search icons..."
                                                value={iconSearchQuery}
                                                onChange={(e) => setIconSearchQuery(e.target.value)}
                                                className="pl-10 h-9"
                                                style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                                              />
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-6 gap-2 p-3 overflow-y-auto max-h-80">
                                            {filteredIcons.map((iconName) => {
                                              const IconComponent = Icons[iconName as keyof typeof Icons] as React.ElementType;
                                              return (
                                                <button
                                                  key={iconName}
                                                  type="button"
                                                  onClick={() => {
                                                    setLinkForm({ ...linkForm, icon: iconName });
                                                    setIconPickerOpen(null);
                                                    setIconSearchQuery("");
                                                  }}
                                                  className="flex flex-col items-center justify-center p-3 rounded-lg transition-colors"
                                                  style={{ border: '1px solid transparent', color: 'var(--color-text-primary)' }}
                                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-success)/0.1', e.currentTarget.style.borderColor = 'var(--color-success)/0.3')}
                                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent', e.currentTarget.style.borderColor = 'transparent')}
                                                  title={iconName}
                                                >
                                                  <IconComponent size={20} />
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex space-x-2 pt-2">
                                      <Button
                                        onClick={() => handleUpdateLink(link.id)}
                                      >
                                        <Check className="w-4 h-4 mr-2" />
                                        Save Changes
                                      </Button>
                                      <Button
                                        onClick={() => {
                                          setEditingLinkId(null);
                                          setLinkForm({ title: "", url: "", icon: "" });
                                        }}
                                        variant="outline"
                                      >
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-center space-x-2 mb-1">
                                      {link.icon && (
                                        Icons[link.icon as keyof typeof Icons] ? (
                                          React.createElement(
                                            Icons[link.icon as keyof typeof Icons] as React.ElementType,
                                            { size: 18, className: "text-[#FF0050]" }
                                          )
                                        ) : (
                                          <span className="text-lg">{link.icon}</span>
                                        )
                                      )}
                                      <span className="font-semibold text-[#1A1A2E]">{link.title}</span>
                                    </div>
                                    <div className="text-sm text-slate-400 truncate">{link.url}</div>
                                  </>
                                )}
                              </div>

                              {editingLinkId !== link.id && (
                                <div className="flex flex-col items-end space-y-4">
                                  {/* Toggle Enable/Disable - Top */}
                                  <button
                                    onClick={async (e) => {
                                      e.stopPropagation();
                                      e.preventDefault();

                                      console.log('\n=== TOGGLE BUTTON CLICKED ===');
                                      console.log('Link object:', JSON.stringify(link, null, 2));

                                      // Get current enabled state (defaulting to true if undefined)
                                      const currentState = link.enabled !== undefined ? link.enabled : true;
                                      const newEnabledState = !currentState;

                                      console.log('Current enabled state:', currentState);
                                      console.log('New enabled state:', newEnabledState);
                                      console.log('Sending PATCH to /api/links/' + link.id);

                                      try {
                                        const response = await fetch(`/api/links/${link.id}`, {
                                          method: "PATCH",
                                          headers: { "Content-Type": "application/json" },
                                          body: JSON.stringify({ enabled: newEnabledState }),
                                        });

                                        console.log('Response status:', response.status, response.statusText);

                                        if (response.ok) {
                                          const result = await response.json();
                                          console.log('API returned updated link:', JSON.stringify(result, null, 2));
                                          console.log('Calling fetchProfiles to refresh data...');
                                          await fetchProfiles();
                                          console.log('fetchProfiles completed');
                                        } else {
                                          const error = await response.json();
                                          console.error("Failed to update link enabled state:", error);
                                        }
                                      } catch (error) {
                                        console.error("Error toggling link:", error);
                                      }
                                    }}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF0050] focus:ring-offset-2 focus:ring-offset-white ${(link.enabled !== undefined ? link.enabled : true) ? 'bg-gradient-to-r from-[#FF0050] to-[#6F3FF5]' : 'bg-gray-300'
                                      }`}
                                    title={(link.enabled !== undefined ? link.enabled : true) ? 'Disable link' : 'Enable link'}
                                  >
                                    <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(link.enabled !== undefined ? link.enabled : true) ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                  </button>

                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      onClick={() => {
                                        setEditingLinkId(link.id);
                                        setLinkForm({
                                          title: link.title,
                                          url: link.url,
                                          icon: link.icon || "",
                                        });
                                      }}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        setEditingLinkId(null);
                                        setCustomizingLinkIndex(customizingLinkIndex === index ? null : index);
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="hover:bg-[#FFF0F7] hover:border-[#FF0050]/50"
                                    >
                                      <Palette className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() => handleDeleteLink(link.id)}
                                      variant="outline"
                                      size="sm"
                                      className="hover:bg-red-50 hover:border-red-400 hover:text-red-600"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                    <div className="relative">
                                      <Button
                                        onClick={() => setShareMenuOpen(shareMenuOpen === link.id ? null : link.id)}
                                        variant="outline"
                                        size="sm"
                                      >
                                        <MoreVertical className="w-4 h-4" />
                                      </Button>

                                      {/* Share Popup */}
                                      {shareMenuOpen === link.id && (() => {
                                        const profileUrl = `${window.location.origin}/${selectedProfile?.username}`;
                                        const shareMessage = `Check out my link: ${link.title} on my Entro.ly profile!`;
                                        return (
                                          <div className="fixed z-[110] inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center" onClick={() => setShareMenuOpen(null)}>
                                            <Card className="p-6 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                                              <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-[#1A1A2E]">Share Link Button</h3>
                                                <button onClick={() => setShareMenuOpen(null)} className="text-gray-400 hover:text-[#1A1A2E]">
                                                  <Type className="w-5 h-5" />
                                                </button>
                                              </div>

                                              <div className="mb-4">
                                                <p className="text-sm text-gray-600 mb-2">Share your profile where people can click this link:</p>
                                                <div className="bg-gray-100 rounded-xl p-3 flex items-center space-x-2">
                                                  <span className="text-sm text-gray-700 flex-1 truncate">{profileUrl}</span>
                                                  <button
                                                    onClick={async () => {
                                                      await navigator.clipboard.writeText(profileUrl);
                                                      setShareLinkCopied(true);
                                                      setTimeout(() => setShareLinkCopied(false), 2000);
                                                    }}
                                                    className="text-[#FF0050] hover:text-[#6F3FF5] transition-all"
                                                  >
                                                    {shareLinkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                                  </button>
                                                </div>
                                              </div>

                                              <div className="mb-4">
                                                <p className="text-sm text-gray-600 font-semibold mb-3">Share via</p>
                                                <div className="grid grid-cols-4 gap-3">
                                                  <button
                                                    onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank')}
                                                    className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-400 transition-all"
                                                  >
                                                    <Facebook className="w-5 h-5 text-blue-600 mb-1" />
                                                    <span className="text-xs text-gray-700 font-medium">Facebook</span>
                                                  </button>
                                                  <button
                                                    onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareMessage)}`, '_blank')}
                                                    className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-sky-50 border border-gray-200 hover:border-sky-400 transition-all"
                                                  >
                                                    <Twitter className="w-5 h-5 text-sky-500 mb-1" />
                                                    <span className="text-xs text-gray-700 font-medium">Twitter</span>
                                                  </button>
                                                  <button
                                                    onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank')}
                                                    className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-700 transition-all"
                                                  >
                                                    <Linkedin className="w-5 h-5 text-blue-700 mb-1" />
                                                    <span className="text-xs text-gray-700 font-medium">LinkedIn</span>
                                                  </button>
                                                  <button
                                                    onClick={() => window.open(`mailto:?subject=${encodeURIComponent(shareMessage)}&body=${encodeURIComponent(`${shareMessage}\n\n${profileUrl}`)}`, '_blank')}
                                                    className="flex flex-col items-center p-3 rounded-xl bg-gray-50 hover:bg-[#FFF0F7] border border-gray-200 hover:border-[#FF0050] transition-all"
                                                  >
                                                    <Mail className="w-5 h-5 text-[#FF0050] mb-1" />
                                                    <span className="text-xs text-gray-700 font-medium">Email</span>
                                                  </button>
                                                </div>
                                              </div>

                                              <div className="bg-gradient-to-r from-[#FFF0F7] to-[#F8F9FF] border-2 border-[#FF0050]/20 rounded-xl p-4">
                                                <div className="flex items-start space-x-3">
                                                  <Share2 className="w-5 h-5 text-[#FF0050] flex-shrink-0 mt-0.5" />
                                                  <div>
                                                    <p className="text-sm font-bold text-[#1A1A2E] mb-1">Love Entro.ly?</p>
                                                    <p className="text-xs text-gray-600 mb-2">Create your own link hub and share all your important links in one place!</p>
                                                    <Button
                                                      onClick={() => window.open('/', '_blank')}
                                                      size="sm"
                                                    >
                                                      Join Entro.ly
                                                    </Button>
                                                  </div>
                                                </div>
                                              </div>
                                            </Card>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Card>
                        </div>

                        {/* Individual Link Customization Panel */}
                        {customizingLinkIndex === index && (
                          <Card className="p-4 mt-2">
                            <h4 className="text-sm font-bold mb-3 flex items-center" style={{ color: 'var(--color-text-primary)' }}>
                              <Palette className="w-4 h-4 mr-2" style={{ color: 'var(--color-success)' }} />
                              Customize This Link
                            </h4>
                            <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>Override default button styles for this link only</p>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-xs">Button Color</Label>
                                <Input
                                  type="color"
                                  value={link.buttonColor || appearanceForm.linkButtonColor}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ buttonColor: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 cursor-pointer mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Text Color</Label>
                                <Input
                                  type="color"
                                  value={link.textColor || appearanceForm.linkButtonTextColor}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ textColor: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 cursor-pointer mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Icon Color</Label>
                                <Input
                                  type="color"
                                  value={link.iconColor || appearanceForm.profileAccentColor}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ iconColor: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 cursor-pointer mt-1"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Border Color</Label>
                                <Input
                                  type="color"
                                  value={link.borderColor || appearanceForm.linkButtonBorderColor}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ borderColor: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 cursor-pointer mt-1"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-3">
                              <div>
                                <Label className="text-xs">Shape</Label>
                                <select
                                  value={link.buttonStyle || appearanceForm.linkButtonStyle}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ buttonStyle: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 px-2 text-xs rounded-md bg-white border-2 border-gray-200 text-[#1A1A2E] mt-1 focus:border-[#FF0050] focus:outline-none"
                                >
                                  <option value="rounded">Rounded</option>
                                  <option value="pill">Pill</option>
                                  <option value="square">Square</option>
                                </select>
                              </div>
                              <div>
                                <Label className="text-xs">Border Style</Label>
                                <select
                                  value={link.borderStyle || appearanceForm.linkButtonBorder}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ borderStyle: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 px-2 text-xs rounded-md bg-white border-2 border-gray-200 text-[#1A1A2E] mt-1 focus:border-[#FF0050] focus:outline-none"
                                >
                                  <option value="none">None</option>
                                  <option value="solid">Solid</option>
                                  <option value="gradient">Gradient</option>
                                </select>
                              </div>
                              <div>
                                <Label className="text-xs">Shadow</Label>
                                <select
                                  value={link.shadow || appearanceForm.linkButtonShadow}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ shadow: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 px-2 text-xs rounded-md bg-white border-2 border-gray-200 text-[#1A1A2E] mt-1 focus:border-[#FF0050] focus:outline-none"
                                >
                                  <option value="none">None</option>
                                  <option value="sm">Small</option>
                                  <option value="md">Medium</option>
                                  <option value="lg">Large</option>
                                  <option value="xl">Extra Large</option>
                                </select>
                              </div>
                              <div>
                                <Label className="text-xs">Animation</Label>
                                <select
                                  value={link.animation || appearanceForm.linkButtonAnimation}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ animation: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 px-2 text-xs rounded-md bg-white border-2 border-gray-200 text-[#1A1A2E] mt-1 focus:border-[#FF0050] focus:outline-none"
                                >
                                  <option value="none">None</option>
                                  <option value="scale">Scale</option>
                                  <option value="slide">Slide</option>
                                  <option value="glow">Glow</option>
                                </select>
                              </div>
                            </div>

                            {(link.animation === "glow" || (!link.animation && appearanceForm.linkButtonAnimation === "glow")) && (
                              <div className="mt-3">
                                <Label className="text-xs">Glow Color</Label>
                                <Input
                                  type="color"
                                  value={link.glowColor || appearanceForm.linkButtonGlowColor}
                                  onChange={async (e) => {
                                    await fetch(`/api/links/${link.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({ glowColor: e.target.value }),
                                    });
                                    await fetchProfiles();
                                  }}
                                  className="w-full h-8 cursor-pointer mt-1"
                                />
                              </div>
                            )}

                            <Button
                              onClick={() => setCustomizingLinkIndex(null)}
                              variant="outline"
                              size="sm"
                              className="w-full mt-4"
                            >
                              Done Customizing
                            </Button>
                          </Card>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Add Link Modal */}
                {showAddLink && (
                  <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
                    <Card className="p-6 w-full max-w-md">
                      <h3 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text-primary)' }}>Add New Link</h3>
                      <form onSubmit={handleAddLink} className="space-y-4">
                        <div>
                          <Label htmlFor="title">Link Title *</Label>
                          <Input
                            id="title"
                            value={linkForm.title}
                            onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                            placeholder="My Website"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="url">URL *</Label>
                          <Input
                            id="url"
                            type="url"
                            value={linkForm.url}
                            onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                            placeholder="https://example.com"
                            required
                          />
                        </div>
                        <div className="relative">
                          <Label htmlFor="icon">Icon</Label>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIconPickerOpen(iconPickerOpen === -2 ? null : -2)}
                            className="w-full justify-between h-10 mt-1"
                          >
                            <span className="flex items-center gap-2">
                              {linkForm.icon ? (
                                React.createElement(
                                  (Icons[linkForm.icon as keyof typeof Icons] as React.ElementType) || Icons.Link2,
                                  { size: 16 }
                                )
                              ) : (
                                <span className="text-lg">{linkForm.icon || "🔗"}</span>
                              )}
                              <span>{linkForm.icon || "Select Icon"}</span>
                            </span>
                            <span className="text-gray-400">▼</span>
                          </Button>

                          {iconPickerOpen === -2 && (
                            <div className="fixed z-[100] mt-2 w-96 max-h-96 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                              <div className="p-3 border-b border-gray-200 sticky top-0 bg-white/90 backdrop-blur-sm">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                  <Input
                                    type="text"
                                    placeholder="Search icons..."
                                    value={iconSearchQuery}
                                    onChange={(e) => setIconSearchQuery(e.target.value)}
                                    className="pl-10 h-9"
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-6 gap-2 p-3 overflow-y-auto max-h-80">
                                {filteredIcons.map((iconName) => {
                                  const IconComponent = Icons[iconName as keyof typeof Icons] as React.ElementType;
                                  return (
                                    <button
                                      key={iconName}
                                      type="button"
                                      onClick={() => {
                                        setLinkForm({ ...linkForm, icon: iconName });
                                        setIconPickerOpen(null);
                                        setIconSearchQuery("");
                                      }}
                                      className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-[#FFF0F7] transition-colors border border-transparent hover:border-[#FF0050]/30"
                                      title={iconName}
                                    >
                                      <IconComponent size={20} className="text-gray-700" />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 pt-4">
                          <Button
                            type="submit"
                            className="flex-1"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Link
                          </Button>
                          <Button
                            type="button"
                            onClick={() => {
                              setShowAddLink(false);
                              setLinkForm({ title: "", url: "", icon: "" });
                            }}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {activeMainTab === "design" && selectedProfile && (
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 tracking-tight" style={{ color: 'var(--color-text-primary)' }}>Customize Appearance</h1>

                <div className="grid grid-cols-3 gap-6">
                  {/* Design Cards */}
                  <button
                    onClick={() => setActiveDesignTab("header")}
                    className="col-span-1 rounded-2xl p-6 text-left transition-all shadow-lg"
                    style={{
                      background: activeDesignTab === "header" ? 'linear-gradient(135deg, var(--color-success)/0.1, var(--color-primary)/0.1)' : 'var(--color-bg-secondary)',
                      border: activeDesignTab === "header" ? '2px solid var(--color-success)' : '2px solid var(--color-border)'
                    }}
                    onMouseEnter={(e) => activeDesignTab !== "header" && (e.currentTarget.style.borderColor = 'var(--color-success)/0.3')}
                    onMouseLeave={(e) => activeDesignTab !== "header" && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  >
                    <ImageIcon className="w-8 h-8 mb-3" style={{ color: activeDesignTab === "header" ? 'var(--color-success)' : 'var(--color-text-tertiary)' }} />
                    <div className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Profile Header</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Avatar, name & bio</div>
                  </button>

                  <button
                    onClick={() => setActiveDesignTab("wallpaper")}
                    className="col-span-1 rounded-2xl p-6 text-left transition-all shadow-lg"
                    style={{
                      background: activeDesignTab === "wallpaper" ? 'linear-gradient(135deg, var(--color-primary)/0.1, var(--color-success)/0.1)' : 'var(--color-bg-secondary)',
                      border: activeDesignTab === "wallpaper" ? '2px solid var(--color-primary)' : '2px solid var(--color-border)'
                    }}
                    onMouseEnter={(e) => activeDesignTab !== "wallpaper" && (e.currentTarget.style.borderColor = 'var(--color-primary)/0.3')}
                    onMouseLeave={(e) => activeDesignTab !== "wallpaper" && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  >
                    <Square className="w-8 h-8 mb-3" style={{ color: activeDesignTab === "wallpaper" ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }} />
                    <div className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Background</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Colors & gradients</div>
                  </button>

                  <button
                    onClick={() => setActiveDesignTab("buttons")}
                    className="col-span-1 rounded-2xl p-6 text-left transition-all shadow-lg"
                    style={{
                      background: activeDesignTab === "buttons" ? 'linear-gradient(135deg, var(--color-primary)/0.1, var(--color-success)/0.1)' : 'var(--color-bg-secondary)',
                      border: activeDesignTab === "buttons" ? '2px solid var(--color-primary)' : '2px solid var(--color-border)'
                    }}
                    onMouseEnter={(e) => activeDesignTab !== "buttons" && (e.currentTarget.style.borderColor = 'var(--color-primary)/0.3')}
                    onMouseLeave={(e) => activeDesignTab !== "buttons" && (e.currentTarget.style.borderColor = 'var(--color-border)')}
                  >
                    <Palette className="w-8 h-8 mb-3" style={{ color: activeDesignTab === "buttons" ? 'var(--color-primary)' : 'var(--color-text-tertiary)' }} />
                    <div className="font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>Link Buttons</div>
                    <div className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Style & colors</div>
                  </button>

                  {/* Settings Content */}
                  <div className="col-span-3">
                    <Card className="p-6">
                      {activeDesignTab === "header" && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Profile Header</h3>
                            <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Customize your profile picture, display name, and bio</p>
                          </div>

                          <div>
                            <Label htmlFor="avatarUrl">Avatar URL</Label>
                            <Input
                              id="avatarUrl"
                              type="url"
                              value={appearanceForm.avatarUrl}
                              onChange={(e) => {
                                setAppearanceForm({ ...appearanceForm, avatarUrl: e.target.value });
                              }}
                              onBlur={handleUpdateAppearance}
                              placeholder="https://example.com/avatar.jpg"
                            />
                          </div>

                          <div>
                            <Label htmlFor="displayName">Display Name</Label>
                            <Input
                              id="displayName"
                              value={appearanceForm.displayName}
                              onChange={(e) => {
                                setAppearanceForm({ ...appearanceForm, displayName: e.target.value });
                              }}
                              onBlur={handleUpdateAppearance}
                              placeholder="Your Name"
                            />
                          </div>

                          <div>
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                              id="bio"
                              value={appearanceForm.bio}
                              onChange={(e) => {
                                setAppearanceForm({ ...appearanceForm, bio: e.target.value });
                              }}
                              placeholder="Tell people about yourself"
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor="avatarBorderColor">Avatar Border Color</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="avatarBorderColor"
                                type="color"
                                value={appearanceForm.avatarBorderColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, avatarBorderColor: e.target.value });
                                }}
                                onBlur={handleUpdateAppearance}
                                className="w-20 h-12 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={appearanceForm.avatarBorderColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, avatarBorderColor: e.target.value });
                                }}
                                onBlur={handleUpdateAppearance}
                                placeholder="#FF0050"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="avatarBorderWidth">
                              Avatar Border Width: <span className="text-[#FF0050] font-bold">{appearanceForm.avatarBorderWidth}px</span>
                            </Label>
                            <input
                              id="avatarBorderWidth"
                              type="range"
                              min="0"
                              max="10"
                              value={appearanceForm.avatarBorderWidth}
                              onChange={(e) => {
                                setAppearanceForm({ ...appearanceForm, avatarBorderWidth: parseInt(e.target.value) });
                              }}
                              onMouseUp={handleUpdateAppearance}
                              onTouchEnd={handleUpdateAppearance}
                              className="w-full accent-[#FF0050]"
                            />
                          </div>

                          <Button
                            onClick={handleUpdateAppearance}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      )}

                      {activeDesignTab === "wallpaper" && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-bold text-[#1A1A2E] mb-4">Background Style</h3>
                            <p className="text-gray-600 text-sm mb-6">Choose a solid color or gradient background</p>
                          </div>

                          <div>
                            <Label className="mb-3 block">Background Type</Label>
                            <div className="grid grid-cols-3 gap-3">
                              <button
                                onClick={() => {
                                  setAppearanceForm({ ...appearanceForm, backgroundType: "solid" });
                                }}
                                className={`px-6 py-4 border-2 rounded-xl transition-all ${appearanceForm.backgroundType === "solid"
                                  ? "border-[#FF0050] bg-[#FFF0F7] text-[#FF0050] shadow-md"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-[#FF0050]/30"
                                  }`}
                              >
                                <Square className="w-5 h-5 mx-auto mb-2" />
                                <div className="text-sm font-semibold">Solid</div>
                              </button>
                              <button
                                onClick={() => {
                                  setAppearanceForm({ ...appearanceForm, backgroundType: "gradient" });
                                }}
                                className={`px-6 py-4 border-2 rounded-xl transition-all ${appearanceForm.backgroundType === "gradient"
                                  ? "border-[#00F2EA] bg-[#F8F9FF] text-[#00F2EA] shadow-md"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-[#00F2EA]/30"
                                  }`}
                              >
                                <Palette className="w-5 h-5 mx-auto mb-2" />
                                <div className="text-sm font-semibold">Gradient</div>
                              </button>
                              <button
                                onClick={() => {
                                  setAppearanceForm({ ...appearanceForm, backgroundType: "image" });
                                }}
                                className={`px-6 py-4 border-2 rounded-xl transition-all ${appearanceForm.backgroundType === "image"
                                  ? "border-[#6F3FF5] bg-[#FFF0F7] text-[#6F3FF5] shadow-md"
                                  : "border-gray-200 bg-white text-gray-600 hover:border-[#6F3FF5]/30"
                                  }`}
                              >
                                <ImageIcon className="w-5 h-5 mx-auto mb-2" />
                                <div className="text-sm font-semibold">Image</div>
                              </button>
                            </div>
                          </div>

                          {appearanceForm.backgroundType === "solid" ? (
                            <div>
                              <Label htmlFor="backgroundColor">Background Color</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="backgroundColor"
                                  type="color"
                                  value={appearanceForm.backgroundColor}
                                  onChange={(e) => {
                                    setAppearanceForm({ ...appearanceForm, backgroundColor: e.target.value });
                                  }}
                                  className="w-20 h-12 cursor-pointer"
                                />
                                <Input
                                  type="text"
                                  value={appearanceForm.backgroundColor}
                                  onChange={(e) => {
                                    setAppearanceForm({ ...appearanceForm, backgroundColor: e.target.value });
                                  }}
                                  placeholder="#ffffff"
                                />
                              </div>
                            </div>
                          ) : appearanceForm.backgroundType === "image" ? (
                            <div>
                              <Label htmlFor="backgroundImage">Background Image URL</Label>
                              <Input
                                id="backgroundImage"
                                type="url"
                                value={appearanceForm.backgroundImage}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, backgroundImage: e.target.value });
                                }}
                                placeholder="https://example.com/image.jpg"
                              />
                              <p className="text-xs text-gray-500 mt-2">Recommended: High-resolution images work best</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <Label className="mb-3 block">Custom Gradient Colors</Label>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label htmlFor="gradientColor1" className="text-xs">Color 1</Label>
                                    <div className="flex space-x-2 mt-1">
                                      <Input
                                        id="gradientColor1"
                                        type="color"
                                        value={appearanceForm.gradientColor1}
                                        onChange={(e) => {
                                          const newGradient = `linear-gradient(${appearanceForm.gradientDirection}, ${e.target.value} 0%, ${appearanceForm.gradientColor2} 100%)`;
                                          setAppearanceForm({
                                            ...appearanceForm,
                                            gradientColor1: e.target.value,
                                            backgroundGradient: newGradient
                                          });
                                        }}
                                        className="w-16 h-10 cursor-pointer"
                                      />
                                      <Input
                                        type="text"
                                        value={appearanceForm.gradientColor1}
                                        onChange={(e) => {
                                          const newGradient = `linear-gradient(${appearanceForm.gradientDirection}, ${e.target.value} 0%, ${appearanceForm.gradientColor2} 100%)`;
                                          setAppearanceForm({
                                            ...appearanceForm,
                                            gradientColor1: e.target.value,
                                            backgroundGradient: newGradient
                                          });
                                        }}
                                        className="flex-1 h-10 text-xs"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <Label htmlFor="gradientColor2" className="text-xs">Color 2</Label>
                                    <div className="flex space-x-2 mt-1">
                                      <Input
                                        id="gradientColor2"
                                        type="color"
                                        value={appearanceForm.gradientColor2}
                                        onChange={(e) => {
                                          const newGradient = `linear-gradient(${appearanceForm.gradientDirection}, ${appearanceForm.gradientColor1} 0%, ${e.target.value} 100%)`;
                                          setAppearanceForm({
                                            ...appearanceForm,
                                            gradientColor2: e.target.value,
                                            backgroundGradient: newGradient
                                          });
                                        }}
                                        className="w-16 h-10 cursor-pointer"
                                      />
                                      <Input
                                        type="text"
                                        value={appearanceForm.gradientColor2}
                                        onChange={(e) => {
                                          const newGradient = `linear-gradient(${appearanceForm.gradientDirection}, ${appearanceForm.gradientColor1} 0%, ${e.target.value} 100%)`;
                                          setAppearanceForm({
                                            ...appearanceForm,
                                            gradientColor2: e.target.value,
                                            backgroundGradient: newGradient
                                          });
                                        }}
                                        className="flex-1 h-10 text-xs"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="gradientDirection">Gradient Direction</Label>
                                <select
                                  id="gradientDirection"
                                  value={appearanceForm.gradientDirection}
                                  onChange={(e) => {
                                    const newGradient = `linear-gradient(${e.target.value}, ${appearanceForm.gradientColor1} 0%, ${appearanceForm.gradientColor2} 100%)`;
                                    setAppearanceForm({
                                      ...appearanceForm,
                                      gradientDirection: e.target.value,
                                      backgroundGradient: newGradient
                                    });
                                  }}
                                  className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF0050] focus:border-[#FF0050] mt-2"
                                >
                                  <option value="45deg">45° (Top-Left to Bottom-Right)</option>
                                  <option value="90deg">90° (Top to Bottom)</option>
                                  <option value="135deg">135° (Top-Right to Bottom-Left)</option>
                                  <option value="180deg">180° (Right to Left)</option>
                                  <option value="225deg">225° (Bottom-Right to Top-Left)</option>
                                  <option value="270deg">270° (Bottom to Top)</option>
                                </select>
                              </div>

                              <div>
                                <Label className="mb-3 block">Gradient Presets</Label>
                                <div className="grid grid-cols-2 gap-3">
                                  {[
                                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                                    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                                    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                                    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
                                    "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
                                    "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
                                  ].map((gradient, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        setAppearanceForm({ ...appearanceForm, backgroundGradient: gradient });
                                      }}
                                      className={`h-20 rounded-xl border-2 transition-all ${appearanceForm.backgroundGradient === gradient
                                        ? "border-[#FF0050] ring-2 ring-[#FF0050]/50 shadow-lg"
                                        : "border-gray-200 hover:border-[#FF0050]/30"
                                        }`}
                                      style={{ background: gradient }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <div>
                            <Label htmlFor="profileTextColor">Text Color</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="profileTextColor"
                                type="color"
                                value={appearanceForm.profileTextColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, profileTextColor: e.target.value });
                                }}
                                className="w-20 h-12 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={appearanceForm.profileTextColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, profileTextColor: e.target.value });
                                }}
                                placeholder="#1A1A2E"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="profileBioColor" className="text-slate-400">Bio Color</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="profileBioColor"
                                type="color"
                                value={appearanceForm.profileBioColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, profileBioColor: e.target.value });
                                }}
                                className="w-20 h-12 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={appearanceForm.profileBioColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, profileBioColor: e.target.value });
                                }}
                                placeholder="#64748b"
                                className="bg-slate-800 border-white/10 text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="profileAccentColor">Accent Color</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="profileAccentColor"
                                type="color"
                                value={appearanceForm.profileAccentColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, profileAccentColor: e.target.value });
                                }}
                                className="w-20 h-12 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={appearanceForm.profileAccentColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, profileAccentColor: e.target.value });
                                }}
                                placeholder="#FF0050"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="fontFamily">Font Family</Label>
                            <select
                              id="fontFamily"
                              value={appearanceForm.fontFamily}
                              onChange={(e) => {
                                setAppearanceForm({ ...appearanceForm, fontFamily: e.target.value });
                              }}
                              className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-[#1A1A2E] focus:outline-none focus:ring-2 focus:ring-[#FF0050] focus:border-[#FF0050] mt-2"
                            >
                              <option value="Inter">Inter</option>
                              <option value="Space Grotesk">Space Grotesk</option>
                              <option value="Poppins">Poppins</option>
                              <option value="Roboto">Roboto</option>
                              <option value="Montserrat">Montserrat</option>
                            </select>
                          </div>

                          <Button
                            onClick={handleUpdateAppearance}
                            className="w-full bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      )}

                      {activeDesignTab === "buttons" && (
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Link Button Style</h3>
                            <p className="text-slate-400 text-sm mb-6">Customize how your links look</p>
                          </div>

                          <div>
                            <Label className="text-slate-400 mb-3 block">Button Shape</Label>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { value: "rounded", label: "Rounded", icon: "◗" },
                                { value: "pill", label: "Pill", icon: "⬭" },
                                { value: "square", label: "Square", icon: "▭" }
                              ].map((style) => (
                                <button
                                  key={style.value}
                                  onClick={async () => {
                                    const updatedForm = { ...appearanceForm, linkButtonStyle: style.value };
                                    setAppearanceForm(updatedForm);
                                    if (!selectedProfile) return;
                                    try {
                                      const response = await fetch(`/api/profiles/${selectedProfile.id}`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(updatedForm),
                                      });
                                      if (response.ok) {
                                        await fetchProfiles();
                                      }
                                    } catch (error) {
                                      console.error("Error updating appearance:", error);
                                    }
                                  }}
                                  className={`px-6 py-4 border-2 rounded-xl transition ${appearanceForm.linkButtonStyle === style.value
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                    : "border-white/10 bg-slate-800 text-slate-400 hover:border-white/20"
                                    }`}
                                >
                                  <div className="text-2xl mb-2">{style.icon}</div>
                                  <div className="text-sm font-medium capitalize">{style.label}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="linkButtonColor" className="text-slate-400">Button Color</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="linkButtonColor"
                                type="color"
                                value={appearanceForm.linkButtonColor}
                                onChange={async (e) => {
                                  const updatedForm = { ...appearanceForm, linkButtonColor: e.target.value };
                                  setAppearanceForm(updatedForm);
                                  if (!selectedProfile) return;
                                  try {
                                    const response = await fetch(`/api/profiles/${selectedProfile.id}`, {
                                      method: "PATCH",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify(updatedForm),
                                    });
                                    if (response.ok) {
                                      await fetchProfiles();
                                    }
                                  } catch (error) {
                                    console.error("Error updating appearance:", error);
                                  }
                                }}
                                className="w-20 h-12 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={appearanceForm.linkButtonColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, linkButtonColor: e.target.value });
                                }}
                                onBlur={handleUpdateAppearance}
                                placeholder="#8129d9"
                                className="bg-slate-800 border-white/10 text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="linkButtonTextColor" className="text-slate-400">Button Text Color</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="linkButtonTextColor"
                                type="color"
                                value={appearanceForm.linkButtonTextColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, linkButtonTextColor: e.target.value });
                                }}
                                onBlur={handleUpdateAppearance}
                                className="w-20 h-12 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={appearanceForm.linkButtonTextColor}
                                onChange={(e) => {
                                  setAppearanceForm({ ...appearanceForm, linkButtonTextColor: e.target.value });
                                }}
                                onBlur={handleUpdateAppearance}
                                placeholder="#ffffff"
                                className="bg-slate-800 border-white/10 text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-slate-400 mb-3 block">Button Border</Label>
                            <div className="grid grid-cols-3 gap-3">
                              {["none", "solid", "gradient"].map((borderStyle) => (
                                <button
                                  key={borderStyle}
                                  onClick={async () => {
                                    const updatedForm = { ...appearanceForm, linkButtonBorder: borderStyle };
                                    setAppearanceForm(updatedForm);
                                    if (!selectedProfile) return;
                                    try {
                                      const response = await fetch(`/api/profiles/${selectedProfile.id}`, {
                                        method: "PATCH",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify(updatedForm),
                                      });
                                      if (response.ok) {
                                        await fetchProfiles();
                                      }
                                    } catch (error) {
                                      console.error("Error updating appearance:", error);
                                    }
                                  }}
                                  className={`px-6 py-4 border-2 rounded-xl transition capitalize ${appearanceForm.linkButtonBorder === borderStyle
                                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                                    : "border-white/10 bg-slate-800 text-slate-400 hover:border-white/20"
                                    }`}
                                >
                                  <div className="text-sm font-medium">{borderStyle}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {appearanceForm.linkButtonBorder !== "none" && (
                            <div>
                              <Label htmlFor="linkButtonBorderColor" className="text-slate-400">Border Color</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="linkButtonBorderColor"
                                  type="color"
                                  value={appearanceForm.linkButtonBorderColor}
                                  onChange={(e) => {
                                    setAppearanceForm({ ...appearanceForm, linkButtonBorderColor: e.target.value });
                                  }}
                                  onBlur={handleUpdateAppearance}
                                  className="w-20 h-12 cursor-pointer"
                                />
                                <Input
                                  type="text"
                                  value={appearanceForm.linkButtonBorderColor}
                                  onChange={(e) => {
                                    setAppearanceForm({ ...appearanceForm, linkButtonBorderColor: e.target.value });
                                  }}
                                  onBlur={handleUpdateAppearance}
                                  placeholder="#8129d9"
                                  className="bg-slate-800 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          )}

                          <div>
                            <Label htmlFor="linkButtonShadow" className="text-slate-400">Shadow</Label>
                            <select
                              id="linkButtonShadow"
                              value={appearanceForm.linkButtonShadow || "none"}
                              onChange={async (e) => {
                                const updatedForm = { ...appearanceForm, linkButtonShadow: e.target.value };
                                setAppearanceForm(updatedForm);
                                if (!selectedProfile) return;
                                try {
                                  const response = await fetch(`/api/profiles/${selectedProfile.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(updatedForm),
                                  });
                                  if (response.ok) {
                                    await fetchProfiles();
                                  }
                                } catch (error) {
                                  console.error("Error updating appearance:", error);
                                }
                              }}
                              className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="none">No Shadow</option>
                              <option value="sm">Small</option>
                              <option value="md">Medium</option>
                              <option value="lg">Large</option>
                              <option value="xl">Extra Large</option>
                            </select>
                          </div>

                          <div>
                            <Label htmlFor="linkButtonAnimation" className="text-slate-400">Animation</Label>
                            <select
                              id="linkButtonAnimation"
                              value={appearanceForm.linkButtonAnimation || "none"}
                              onChange={async (e) => {
                                const updatedForm = { ...appearanceForm, linkButtonAnimation: e.target.value };
                                setAppearanceForm(updatedForm);
                                if (!selectedProfile) return;
                                try {
                                  const response = await fetch(`/api/profiles/${selectedProfile.id}`, {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(updatedForm),
                                  });
                                  if (response.ok) {
                                    await fetchProfiles();
                                  }
                                } catch (error) {
                                  console.error("Error updating appearance:", error);
                                }
                              }}
                              className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              <option value="none">No Animation</option>
                              <option value="scale">Scale on Hover</option>
                              <option value="slide">Slide on Hover</option>
                              <option value="glow">Glow on Hover</option>
                            </select>
                          </div>

                          {appearanceForm.linkButtonAnimation === "glow" && (
                            <div>
                              <Label htmlFor="linkButtonGlowColor" className="text-slate-400">Glow Color</Label>
                              <div className="flex space-x-2">
                                <Input
                                  id="linkButtonGlowColor"
                                  type="color"
                                  value={appearanceForm.linkButtonGlowColor || "#8129d9"}
                                  onChange={(e) => {
                                    setAppearanceForm({ ...appearanceForm, linkButtonGlowColor: e.target.value });
                                  }}
                                  onBlur={handleUpdateAppearance}
                                  className="w-20 h-12 cursor-pointer"
                                />
                                <Input
                                  type="text"
                                  value={appearanceForm.linkButtonGlowColor || "#8129d9"}
                                  onChange={(e) => {
                                    setAppearanceForm({ ...appearanceForm, linkButtonGlowColor: e.target.value });
                                  }}
                                  onBlur={handleUpdateAppearance}
                                  placeholder="#8129d9"
                                  className="bg-slate-800 border-white/10 text-white"
                                />
                              </div>
                            </div>
                          )}

                          <Button
                            onClick={handleUpdateAppearance}
                            className="bg-emerald-500 hover:bg-emerald-600"
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Save Changes
                          </Button>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {/* AI Pages Tab */}
            {activeMainTab === "ai-pages" && (
              <div className="max-w-6xl mx-auto">
                <AIPagesList />
              </div>
            )}

            {/* No Profile State */}
            {!selectedProfile && (activeMainTab === "links" || activeMainTab === "design") && (
              <div className="max-w-xl mx-auto">
                <Card className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--color-success), var(--color-primary))' }}>
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>Create Your First Profile</h2>
                  <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    Get started by creating a profile to manage your links and customize your page appearance.
                  </p>
                  <Button onClick={() => router.push("/create")} className="px-8 py-3">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Profile
                  </Button>
                </Card>
              </div>
            )}

            {activeMainTab === "analytics" && (
              <AnalyticsView />
            )}

            {activeMainTab === "tap" && (
              <TAPView />
            )}
          </div>

          {/* Right Preview Panel */}
          {(activeMainTab !== "analytics" && activeMainTab !== "tap") && (
            <aside className="w-96 backdrop-blur-sm p-4 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg-secondary)/0.5', borderLeft: '1px solid var(--color-border)' }}>
              <div className="sticky top-6">
                <div className="text-center mb-4">
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Live Preview</h3>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Real-time preview of your profile</p>
                </div>

                <Card className="backdrop-blur-md overflow-hidden" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                  <div
                    className="p-8 min-h-[700px] flex flex-col items-center"
                    style={getBackgroundStyle()}
                  >
                    {/* Profile Header */}
                    <div className="flex flex-col items-center text-center space-y-4 mb-8">
                      <div className="relative">
                        <div
                          className="absolute -inset-1 rounded-full opacity-75 blur"
                          style={{
                            background: `linear-gradient(135deg, ${appearanceForm.avatarBorderColor || "#10b981"}, ${appearanceForm.profileAccentColor || "#10b981"})`
                          }}
                        />
                        {appearanceForm.avatarUrl ? (
                          <img
                            src={appearanceForm.avatarUrl}
                            alt={appearanceForm.displayName}
                            className="relative w-20 h-20 rounded-full mx-auto object-cover"
                            style={{
                              borderWidth: `${appearanceForm.avatarBorderWidth || 2}px`,
                              borderColor: appearanceForm.avatarBorderColor || "#10b981",
                              borderStyle: "solid",
                            }}
                          />
                        ) : (
                          <div
                            className="relative w-20 h-20 rounded-full bg-slate-800 mx-auto flex items-center justify-center"
                            style={{
                              borderWidth: `${appearanceForm.avatarBorderWidth || 2}px`,
                              borderColor: appearanceForm.avatarBorderColor || "#10b981",
                              borderStyle: "solid",
                            }}
                          >
                            <Type className="w-10 h-10 text-slate-400" />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h1
                          className="text-xl font-bold tracking-tight"
                          style={{
                            color: appearanceForm.profileTextColor || "#f1f5f9",
                            fontFamily: appearanceForm.fontFamily || "Inter"
                          }}
                        >
                          {appearanceForm.displayName || selectedProfile?.username || "Your Name"}
                        </h1>
                        <p
                          className="font-medium text-sm"
                          style={{ color: appearanceForm.profileAccentColor || "#10b981" }}
                        >
                          @{selectedProfile?.username || "username"}
                        </p>
                        {appearanceForm.bio && (
                          <p
                            className="max-w-xs mx-auto leading-relaxed text-sm px-4"
                            style={{
                              color: appearanceForm.profileBioColor || "#94a3b8",
                              fontFamily: appearanceForm.fontFamily || "Inter"
                            }}
                          >
                            {appearanceForm.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Preview Links */}
                    <div className="space-y-3 w-full max-w-sm">
                      {previewLinks.length === 0 ? (
                        <>
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className="flex min-h-[56px] items-center justify-center p-3 transition-all duration-300"
                              style={getButtonStyle(false)}
                            >
                              <span className="font-medium text-sm">Example Link {i}</span>
                            </div>
                          ))}
                        </>
                      ) : (
                        previewLinks.filter(link => link.enabled !== undefined ? link.enabled : true).map((link, index) => {
                          const isHovered = hoveredLinkIndex === index;
                          const animation = link.animation || appearanceForm.linkButtonAnimation || "scale";
                          const iconColor = link.iconColor || appearanceForm.profileAccentColor || "#10b981";

                          const getAnimationClass = () => {
                            switch (animation) {
                              case "scale": return "hover:scale-105";
                              case "slide": return "hover:translate-x-1";
                              default: return "";
                            }
                          };

                          return (
                            <button
                              key={link.id}
                              onMouseEnter={() => setHoveredLinkIndex(index)}
                              onMouseLeave={() => setHoveredLinkIndex(null)}
                              className={`flex min-h-[56px] items-center p-3 transition-all duration-300 cursor-pointer w-full ${getAnimationClass()}`}
                              style={getButtonStyle(isHovered, link)}
                            >
                              {link.icon && (
                                <div
                                  className="mr-3 flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-200"
                                  style={{
                                    backgroundColor: `${iconColor}20`,
                                    color: iconColor
                                  }}
                                >
                                  {Icons[link.icon as keyof typeof Icons] ? (
                                    React.createElement(
                                      Icons[link.icon as keyof typeof Icons] as React.ElementType,
                                      { size: 18 }
                                    )
                                  ) : (
                                    <span className="text-lg">{link.icon}</span>
                                  )}
                                </div>
                              )}
                              <div className="flex-1 text-center font-medium text-sm">
                                {link.title}
                              </div>
                              {link.icon && <div className="w-8" />}
                            </button>
                          );
                        })
                      )}
                    </div>

                    <div className="text-center mt-8">
                      <div
                        className="inline-flex items-center space-x-2 px-6 py-2 backdrop-blur-sm rounded-full text-sm font-medium shadow-lg"
                        style={{ backgroundColor: 'var(--color-bg-secondary)', color: appearanceForm.linkButtonColor || "#10b981" }}
                      >
                        <span>Entro.ly</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </aside>
          )}
        </main>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, title: "", message: "", onConfirm: () => { } })}
        variant="danger"
      />
    </div>
  );
}
