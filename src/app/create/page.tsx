"use client";

import React, { useActionState, useState, useMemo } from "react";
import { createProfile, CreateProfileState } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, Palette, Layout, Type, Sparkles, User, X, Search, ChevronDown, Wand2, Settings, Download } from "lucide-react";
import Link from "next/link";
import * as Icons from "lucide-react";
import Image from "next/image";
import { ImportProfileDialog } from "@/components/ImportProfileDialog";

// Initial state for the form
const initialState: CreateProfileState = {
  message: "",
  errors: {},
};

interface LinkItem {
  title: string;
  url: string;
  icon: string;
  buttonColor?: string;
  textColor?: string;
  borderColor?: string;
  borderStyle?: string;
  buttonStyle?: string;
  shadow?: string;
  animation?: string;
  iconColor?: string;
  glowColor?: string;
}

type Section = "profile" | "appearance" | "buttons" | "links";
type CreateMode = "self-customized" | "ai-generated";

export default function CreateProfilePage() {
  const [state, formAction, isPending] = useActionState(createProfile, initialState);
  const [activeSection, setActiveSection] = useState<Section>("profile");
  const [customizeDropdownOpen, setCustomizeDropdownOpen] = useState(true);

  // Form values
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Helper to get CSS variable value as hex
  const getCSSVar = (varName: string, fallback: string = "#000000"): string => {
    if (typeof window === "undefined") return fallback;
    const value = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    return value || fallback;
  };

  // Profile customization states - initialized with CSS variables
  const [backgroundColor, setBackgroundColor] = useState(() => getCSSVar("--color-bg-base", "#0f172a"));
  const [backgroundType, setBackgroundType] = useState("solid");
  const [gradientColor1, setGradientColor1] = useState(() => getCSSVar("--color-primary", "#667eea"));
  const [gradientColor2, setGradientColor2] = useState("#764ba2");
  const [gradientDirection, setGradientDirection] = useState("135deg");
  const [backgroundImage, setBackgroundImage] = useState("");

  const [profileTextColor, setProfileTextColor] = useState(() => getCSSVar("--color-text-primary", "#f1f5f9"));
  const [profileAccentColor, setProfileAccentColor] = useState(() => getCSSVar("--color-success", "#10b981"));
  const [profileBioColor, setProfileBioColor] = useState(() => getCSSVar("--color-text-secondary", "#94a3b8"));

  const [fontFamily, setFontFamily] = useState("Inter");

  const [avatarBorderColor, setAvatarBorderColor] = useState(() => getCSSVar("--color-success", "#10b981"));
  const [avatarBorderWidth, setAvatarBorderWidth] = useState(4);

  const [linkButtonStyle, setLinkButtonStyle] = useState("rounded");
  const [linkButtonColor, setLinkButtonColor] = useState("#ffffff");
  const [linkButtonTextColor, setLinkButtonTextColor] = useState("#0f172a");
  const [linkButtonBorder, setLinkButtonBorder] = useState("none");
  const [linkButtonBorderColor, setLinkButtonBorderColor] = useState(() => getCSSVar("--color-success", "#10b981"));
  const [linkButtonShadow, setLinkButtonShadow] = useState("md");
  const [linkButtonAnimation, setLinkButtonAnimation] = useState("scale");
  const [linkButtonGlowColor, setLinkButtonGlowColor] = useState(() => getCSSVar("--color-success", "#10b981"));

  const [links, setLinks] = useState<LinkItem[]>([
    { title: "Instagram", url: "", icon: "Instagram" },
    { title: "TikTok", url: "", icon: "Video" },
  ]);

  const [customizingLinkIndex, setCustomizingLinkIndex] = useState<number | null>(null);
  const [iconPickerOpen, setIconPickerOpen] = useState<number | null>(null);
  const [iconSearchQuery, setIconSearchQuery] = useState("");
  const [hoveredLinkIndex, setHoveredLinkIndex] = useState<number | null>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  // Handle importing profile from Linktree/Beacons
  interface ImportedProfile {
    displayName: string;
    bio: string;
    avatarUrl: string;
    links: { title: string; url: string; icon: string }[];
    source: 'linktree' | 'beacons' | 'unknown';
  }

  const handleImportProfile = (profile: ImportedProfile) => {
    // Populate form fields with imported data
    if (profile.displayName) setDisplayName(profile.displayName);
    if (profile.bio) setBio(profile.bio);
    if (profile.avatarUrl) setAvatarUrl(profile.avatarUrl);

    // Convert imported links to our LinkItem format
    if (profile.links && profile.links.length > 0) {
      const importedLinks: LinkItem[] = profile.links.map(link => ({
        title: link.title,
        url: link.url,
        icon: link.icon || 'Link',
      }));
      setLinks(importedLinks);
    }

    // Generate a username suggestion from display name
    if (profile.displayName && !username) {
      const suggestedUsername = profile.displayName
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 20);
      setUsername(suggestedUsername);
    }
  };

  // Generate gradient CSS from colors and direction
  const backgroundGradient = useMemo(() => {
    return `linear-gradient(${gradientDirection}, ${gradientColor1} 0%, ${gradientColor2} 100%)`;
  }, [gradientDirection, gradientColor1, gradientColor2]);

  // Get all available lucide icons
  const availableIcons = useMemo(() => {
    const iconNames = Object.keys(Icons).filter(
      (key) => key !== "createReactComponent" && typeof Icons[key as keyof typeof Icons] === "object"
    );
    return iconNames;
  }, []);

  // Filter icons based on search
  const filteredIcons = useMemo(() => {
    if (!iconSearchQuery) return availableIcons.slice(0, 100); // Show first 100 by default
    return availableIcons.filter((name) =>
      name.toLowerCase().includes(iconSearchQuery.toLowerCase())
    ).slice(0, 100); // Limit to 100 results
  }, [iconSearchQuery, availableIcons]);

  const addLink = () => {
    setLinks([...links, { title: "", url: "", icon: "Link" }]);
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    setLinks(newLinks);
    if (customizingLinkIndex === index) {
      setCustomizingLinkIndex(null);
    }
  };

  const updateLink = (index: number, field: keyof LinkItem, value: string) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const getPlaceholder = (title: string) => {
    const t = title.toLowerCase();
    if (t === "instagram" || t === "tiktok") return "username";
    return "https://...";
  };

  const getInputValue = (link: LinkItem) => {
    const t = link.title.toLowerCase();
    if (t === "instagram") return link.url.replace("https://instagram.com/", "");
    if (t === "tiktok") return link.url.replace("https://tiktok.com/@", "");
    return link.url;
  };

  const handleUrlChange = (index: number, value: string) => {
    const title = links[index].title.toLowerCase();
    let newUrl = value;

    if (title === "instagram") {
      newUrl = value ? `https://instagram.com/${value.replace(/^@/, "")}` : "";
    } else if (title === "tiktok") {
      newUrl = value ? `https://tiktok.com/@${value.replace(/^@/, "")}` : "";
    }

    updateLink(index, "url", newUrl);
  };

  // Preview background style
  const getPreviewBackgroundStyle = () => {
    if (backgroundType === "gradient") {
      return { background: backgroundGradient };
    }
    if (backgroundType === "image" && backgroundImage) {
      return {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return { backgroundColor };
  };

  const scrollToSection = (section: Section) => {
    setActiveSection(section);
    const element = document.getElementById(`section-${section}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-base)', color: 'var(--color-text-primary)' }}>
      <div className="flex">
        {/* Left Sidebar Navigation */}
        <aside className="hidden lg:block w-64 sticky top-0 h-screen overflow-y-auto" style={{ borderRight: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
              Create Profile
            </h2>
            <nav className="space-y-2">
              {/* Self-customized profile dropdown */}
              <div className="space-y-1">
                <button
                  onClick={() => setCustomizeDropdownOpen(!customizeDropdownOpen)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all"
                  style={{
                    backgroundColor: 'var(--color-success)/0.1',
                    color: 'var(--color-success)',
                    border: '1px solid var(--color-success)/0.2'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Self-customized</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${customizeDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown items */}
                {customizeDropdownOpen && (
                  <div className="ml-4 space-y-1 pt-1">
                    <button
                      onClick={() => scrollToSection("profile")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
                      style={{
                        backgroundColor: activeSection === "profile" ? 'var(--color-success)/0.2' : 'transparent',
                        color: activeSection === "profile" ? 'var(--color-success)' : 'var(--color-text-secondary)',
                        border: activeSection === "profile" ? '1px solid var(--color-success)/0.3' : '1px solid transparent'
                      }}
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Profile Details</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("appearance")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
                      style={{
                        backgroundColor: activeSection === "appearance" ? 'var(--color-success)/0.2' : 'transparent',
                        color: activeSection === "appearance" ? 'var(--color-success)' : 'var(--color-text-secondary)',
                        border: activeSection === "appearance" ? '1px solid var(--color-success)/0.3' : '1px solid transparent'
                      }}
                    >
                      <Palette className="w-4 h-4" />
                      <span className="font-medium">Appearance</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("buttons")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
                      style={{
                        backgroundColor: activeSection === "buttons" ? 'var(--color-success)/0.2' : 'transparent',
                        color: activeSection === "buttons" ? 'var(--color-success)' : 'var(--color-text-secondary)',
                        border: activeSection === "buttons" ? '1px solid var(--color-success)/0.3' : '1px solid transparent'
                      }}
                    >
                      <Layout className="w-4 h-4" />
                      <span className="font-medium">Link Buttons</span>
                    </button>
                    <button
                      onClick={() => scrollToSection("links")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm"
                      style={{
                        backgroundColor: activeSection === "links" ? 'var(--color-success)/0.2' : 'transparent',
                        color: activeSection === "links" ? 'var(--color-success)' : 'var(--color-text-secondary)',
                        border: activeSection === "links" ? '1px solid var(--color-success)/0.3' : '1px solid transparent'
                      }}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span className="font-medium">Links</span>
                    </button>
                  </div>
                )}
              </div>

              {/* AI-generated navigation */}
              <Link
                href="/create/ai-generated"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid transparent'
                }}
              >
                <Wand2 className="w-5 h-5" />
                <span className="font-medium">AI-generated</span>
              </Link>

              {/* Import from Linktree/Beacons */}
              <button
                onClick={() => setIsImportDialogOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-white/5"
                style={{
                  backgroundColor: 'transparent',
                  color: 'var(--color-text-secondary)',
                  border: '1px solid transparent'
                }}
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Import Profile</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:grid lg:grid-cols-2 gap-8 p-4 md:p-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="text-center lg:hidden mb-8">
              <h1 className="text-3xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                Create Your Entro.ly
              </h1>
              <p className="mt-2" style={{ color: 'var(--color-text-secondary)' }}>Fully customize your link-in-bio page</p>
            </div>

            <form action={formAction} className="space-y-6">
              {/* Hidden inputs for customization */}
              <input type="hidden" name="backgroundColor" value={backgroundColor} />
              <input type="hidden" name="backgroundType" value={backgroundType} />
              <input type="hidden" name="backgroundGradient" value={backgroundGradient} />
              <input type="hidden" name="backgroundImage" value={backgroundImage} />
              <input type="hidden" name="profileTextColor" value={profileTextColor} />
              <input type="hidden" name="profileAccentColor" value={profileAccentColor} />
              <input type="hidden" name="profileBioColor" value={profileBioColor} />
              <input type="hidden" name="fontFamily" value={fontFamily} />
              <input type="hidden" name="avatarBorderColor" value={avatarBorderColor} />
              <input type="hidden" name="avatarBorderWidth" value={avatarBorderWidth} />
              <input type="hidden" name="linkButtonStyle" value={linkButtonStyle} />
              <input type="hidden" name="linkButtonColor" value={linkButtonColor} />
              <input type="hidden" name="linkButtonTextColor" value={linkButtonTextColor} />
              <input type="hidden" name="linkButtonBorder" value={linkButtonBorder} />
              <input type="hidden" name="linkButtonBorderColor" value={linkButtonBorderColor} />
              <input type="hidden" name="linkButtonShadow" value={linkButtonShadow} />
              <input type="hidden" name="linkButtonAnimation" value={linkButtonAnimation} />
              <input type="hidden" name="links" value={JSON.stringify(links)} />

              {/* Profile Details */}
              <div id="section-profile">
                <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Profile Details
                    </CardTitle>
                    <CardDescription>Basic information about you</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. alexdev"
                        className="focus:border-[var(--color-primary)]"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                        required
                      />
                      {state.errors?.username && (
                        <p className="text-sm text-red-500">{state.errors.username[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Alex Chen"
                        className="focus:border-[var(--color-primary)]"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                        required
                      />
                      {state.errors?.displayName && (
                        <p className="text-sm text-red-500">{state.errors.displayName[0]}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="min-h-[100px] focus:border-[var(--color-primary)]"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="avatarUrl">Avatar URL (Optional)</Label>
                      <Input
                        id="avatarUrl"
                        name="avatarUrl"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        placeholder="https://..."
                        className="focus:border-[var(--color-primary)]"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                      />
                      <p className="text-xs" style={{ color: 'var(--color-text-tertiary)' }}>Leave empty to generate a random avatar</p>
                      {state.errors?.avatarUrl && (
                        <p className="text-sm text-red-500">{state.errors.avatarUrl[0]}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Appearance Customization */}
              <div id="section-appearance">
                <Card className="backdrop-blur-md" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Appearance
                    </CardTitle>
                    <CardDescription>Customize colors and styling</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Background Type */}
                    <div className="space-y-3">
                      <Label>Background Type</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={backgroundType === "solid" ? "default" : "outline"}
                          onClick={() => setBackgroundType("solid")}
                          className="h-auto py-3"
                        >
                          Solid
                        </Button>
                        <Button
                          type="button"
                          variant={backgroundType === "gradient" ? "default" : "outline"}
                          onClick={() => setBackgroundType("gradient")}
                          className="h-auto py-3"
                        >
                          Gradient
                        </Button>
                        <Button
                          type="button"
                          variant={backgroundType === "image" ? "default" : "outline"}
                          onClick={() => setBackgroundType("image")}
                          className="h-auto py-3"
                        >
                          Image
                        </Button>
                      </div>
                    </div>

                    {/* Background Options */}
                    {backgroundType === "solid" && (
                      <div className="space-y-2">
                        <Label>Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-20 h-10 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="flex-1"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                            placeholder="#000000"
                          />
                        </div>
                      </div>
                    )}

                    {backgroundType === "gradient" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Gradient Direction</Label>
                          <select
                            value={gradientDirection}
                            onChange={(e) => setGradientDirection(e.target.value)}
                            className="w-full h-10 px-3 rounded-md"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                          >
                            <option value="0deg">Top to Bottom (↓)</option>
                            <option value="180deg">Bottom to Top (↑)</option>
                            <option value="90deg">Left to Right (→)</option>
                            <option value="270deg">Right to Left (←)</option>
                            <option value="45deg">Diagonal ↗</option>
                            <option value="135deg">Diagonal ↘</option>
                            <option value="225deg">Diagonal ↙</option>
                            <option value="315deg">Diagonal ↖</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <Label>Start Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={gradientColor1}
                              onChange={(e) => setGradientColor1(e.target.value)}
                              className="w-20 h-10 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={gradientColor1}
                              onChange={(e) => setGradientColor1(e.target.value)}
                              className="flex-1"
                              style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                              placeholder="#667eea"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>End Color</Label>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={gradientColor2}
                              onChange={(e) => setGradientColor2(e.target.value)}
                              className="w-20 h-10 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={gradientColor2}
                              onChange={(e) => setGradientColor2(e.target.value)}
                              className="flex-1"
                              style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                              placeholder="#764ba2"
                            />
                          </div>
                        </div>

                        {/* Gradient Preview */}
                        <div className="space-y-2">
                          <Label>Preview</Label>
                          <div
                            className="w-full h-20 rounded-lg"
                            style={{ background: backgroundGradient, border: '1px solid var(--color-border)' }}
                          />
                        </div>
                      </div>
                    )}

                    {backgroundType === "image" && (
                      <div className="space-y-2">
                        <Label>Background Image URL</Label>
                        <Input
                          type="text"
                          value={backgroundImage}
                          onChange={(e) => setBackgroundImage(e.target.value)}
                          style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                          placeholder="https://..."
                        />
                      </div>
                    )}

                    {/* Text Colors */}
                    <div className="space-y-3">
                      <Label>Profile Colors</Label>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Name Color</span>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={profileTextColor}
                              onChange={(e) => setProfileTextColor(e.target.value)}
                              className="w-16 h-8 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={profileTextColor}
                              onChange={(e) => setProfileTextColor(e.target.value)}
                              className="w-28 h-8 text-xs"
                              style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Accent Color</span>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={profileAccentColor}
                              onChange={(e) => setProfileAccentColor(e.target.value)}
                              className="w-16 h-8 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={profileAccentColor}
                              onChange={(e) => setProfileAccentColor(e.target.value)}
                              className="w-28 h-8 text-xs"
                              style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Bio Color</span>
                          <div className="flex gap-2">
                            <Input
                              type="color"
                              value={profileBioColor}
                              onChange={(e) => setProfileBioColor(e.target.value)}
                              className="w-16 h-8 cursor-pointer"
                            />
                            <Input
                              type="text"
                              value={profileBioColor}
                              onChange={(e) => setProfileBioColor(e.target.value)}
                              className="w-28 h-8 text-xs"
                              style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Font Selection */}
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full h-10 px-3 rounded-md"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      >
                        <option value="Inter">Inter</option>
                        <option value="Space Grotesk">Space Grotesk</option>
                        <option value="Poppins">Poppins</option>
                        <option value="Roboto">Roboto</option>
                        <option value="Montserrat">Montserrat</option>
                      </select>
                    </div>

                    {/* Avatar Customization */}
                    <div className="space-y-3">
                      <Label>Avatar Border</Label>
                      <div className="flex items-center gap-4">
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            type="color"
                            value={avatarBorderColor}
                            onChange={(e) => setAvatarBorderColor(e.target.value)}
                            className="w-16 h-8 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={avatarBorderColor}
                            onChange={(e) => setAvatarBorderColor(e.target.value)}
                            className="flex-1 h-8 text-xs"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs whitespace-nowrap">Width:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={avatarBorderWidth}
                            onChange={(e) => setAvatarBorderWidth(parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-xs"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Link Button Styling */}
              <div id="section-buttons">
                <Card className="backdrop-blur-md" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="w-5 h-5" />
                      Link Button Style
                    </CardTitle>
                    <CardDescription>Default styling for all links</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Button Style */}
                    <div className="space-y-2">
                      <Label>Button Shape</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={linkButtonStyle === "rounded" ? "default" : "outline"}
                          onClick={() => setLinkButtonStyle("rounded")}
                        >
                          Rounded
                        </Button>
                        <Button
                          type="button"
                          variant={linkButtonStyle === "square" ? "default" : "outline"}
                          onClick={() => setLinkButtonStyle("square")}
                        >
                          Square
                        </Button>
                        <Button
                          type="button"
                          variant={linkButtonStyle === "pill" ? "default" : "outline"}
                          onClick={() => setLinkButtonStyle("pill")}
                        >
                          Pill
                        </Button>
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Button Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={linkButtonColor}
                            onChange={(e) => setLinkButtonColor(e.target.value)}
                            className="w-16 h-8 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={linkButtonColor}
                            onChange={(e) => setLinkButtonColor(e.target.value)}
                            className="w-28 h-8 text-xs"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Text Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={linkButtonTextColor}
                            onChange={(e) => setLinkButtonTextColor(e.target.value)}
                            className="w-16 h-8 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={linkButtonTextColor}
                            onChange={(e) => setLinkButtonTextColor(e.target.value)}
                            className="w-28 h-8 text-xs"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Border */}
                    <div className="space-y-2">
                      <Label>Border Style</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          type="button"
                          variant={linkButtonBorder === "none" ? "default" : "outline"}
                          onClick={() => setLinkButtonBorder("none")}
                          size="sm"
                        >
                          None
                        </Button>
                        <Button
                          type="button"
                          variant={linkButtonBorder === "solid" ? "default" : "outline"}
                          onClick={() => setLinkButtonBorder("solid")}
                          size="sm"
                        >
                          Solid
                        </Button>
                        <Button
                          type="button"
                          variant={linkButtonBorder === "gradient" ? "default" : "outline"}
                          onClick={() => setLinkButtonBorder("gradient")}
                          size="sm"
                        >
                          Gradient
                        </Button>
                      </div>
                      {linkButtonBorder !== "none" && (
                        <div className="flex gap-2 mt-2">
                          <Input
                            type="color"
                            value={linkButtonBorderColor}
                            onChange={(e) => setLinkButtonBorderColor(e.target.value)}
                            className="w-16 h-8 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={linkButtonBorderColor}
                            onChange={(e) => setLinkButtonBorderColor(e.target.value)}
                            className="flex-1 h-8 text-xs"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Shadow */}
                    <div className="space-y-2">
                      <Label>Shadow</Label>
                      <select
                        value={linkButtonShadow}
                        onChange={(e) => setLinkButtonShadow(e.target.value)}
                        className="w-full h-10 px-3 rounded-md"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      >
                        <option value="none">None</option>
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                        <option value="xl">Extra Large</option>
                      </select>
                    </div>

                    {/* Animation */}
                    <div className="space-y-2">
                      <Label>Hover Animation</Label>
                      <select
                        value={linkButtonAnimation}
                        onChange={(e) => setLinkButtonAnimation(e.target.value)}
                        className="w-full h-10 px-3 rounded-md"
                        style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', color: 'var(--color-text-primary)' }}
                      >
                        <option value="none">None</option>
                        <option value="scale">Scale Up</option>
                        <option value="slide">Slide Right</option>
                        <option value="glow">Glow</option>
                      </select>
                    </div>

                    {/* Glow Color */}
                    {linkButtonAnimation === "glow" && (
                      <div className="space-y-2">
                        <Label>Glow Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={linkButtonGlowColor}
                            onChange={(e) => setLinkButtonGlowColor(e.target.value)}
                            className="w-20 h-10 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={linkButtonGlowColor}
                            onChange={(e) => setLinkButtonGlowColor(e.target.value)}
                            className="flex-1"
                            style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)' }}
                            placeholder="#10b981"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Links */}
              <div id="section-links">
                <Card className="backdrop-blur-md" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Links
                      </CardTitle>
                      <CardDescription>Add and customize your links</CardDescription>
                    </div>
                    <Button
                      type="button"
                      onClick={addLink}
                      variant="outline"
                      size="sm"
                      style={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
                      className="hover:bg-[var(--color-success)]/10"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Link
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {links.map((link, index) => (
                      <div key={index} className="space-y-3">
                        <div className="flex gap-4 items-start p-4 rounded-lg group" style={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--color-border)', border: '1px solid' }}>
                          <div className="mt-3 cursor-move" style={{ color: 'var(--color-text-tertiary)' }}>
                            <GripVertical className="w-5 h-5" />
                          </div>
                          <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`link-title-${index}`} className="text-xs">Title</Label>
                                <Input
                                  id={`link-title-${index}`}
                                  value={link.title}
                                  onChange={(e) => updateLink(index, "title", e.target.value)}
                                  placeholder="e.g. GitHub"
                                  className="h-9"
                                  style={{ backgroundColor: 'var(--color-bg-base)', borderColor: 'var(--color-border)' }}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`link-icon-${index}`} className="text-xs">Icon</Label>
                                <div className="relative">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIconPickerOpen(iconPickerOpen === index ? null : index)}
                                    className="w-full justify-between h-9"
                                    style={{ backgroundColor: 'var(--color-bg-base)', borderColor: 'var(--color-border)' }}
                                  >
                                    <span className="flex items-center gap-2">
                                      {React.createElement(
                                        (Icons[link.icon as keyof typeof Icons] as React.ElementType) || Icons.Link,
                                        { size: 16 }
                                      )}
                                      {link.icon}
                                    </span>
                                    <span style={{ color: 'var(--color-text-tertiary)' }}>▼</span>
                                  </Button>

                                  {/* Icon Picker Modal */}
                                  {iconPickerOpen === index && (
                                    <div className="absolute z-50 mt-2 w-96 max-h-96 rounded-lg shadow-2xl overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)', borderColor: 'var(--color-border)', border: '1px solid' }}>
                                      <div className="p-3 sticky top-0" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg-secondary)' }}>
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
                                                updateLink(index, "icon", iconName);
                                                setIconPickerOpen(null);
                                                setIconSearchQuery("");
                                              }}
                                              className="flex flex-col items-center justify-center p-3 rounded-lg transition-colors hover:bg-[var(--color-success)]/20"
                                              style={{ border: '1px solid transparent' }}
                                              title={iconName}
                                            >
                                              <IconComponent size={20} style={{ color: 'var(--color-text-secondary)' }} />
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`link-url-${index}`} className="text-xs">
                                {links[index].title.toLowerCase() === "instagram" || links[index].title.toLowerCase() === "tiktok"
                                  ? "Username"
                                  : "URL"}
                              </Label>
                              <Input
                                id={`link-url-${index}`}
                                value={getInputValue(link)}
                                onChange={(e) => handleUrlChange(index, e.target.value)}
                                placeholder={getPlaceholder(link.title)}
                                className="h-9"
                                style={{ backgroundColor: 'var(--color-bg-base)', borderColor: 'var(--color-border)' }}
                                required
                              />
                            </div>

                            {/* Individual Link Customization */}
                            <div className="pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setCustomizingLinkIndex(customizingLinkIndex === index ? null : index)}
                                className="text-xs hover:text-[var(--color-success)]"
                                style={{ color: 'var(--color-text-secondary)' }}
                              >
                                <Palette className="w-3 h-3 mr-1" />
                                {customizingLinkIndex === index ? "Hide" : "Customize"} This Link
                              </Button>

                              {customizingLinkIndex === index && (
                                <div className="mt-3 p-3 bg-slate-900/30 rounded-lg space-y-3">
                                  <p className="text-xs text-slate-400">Override default button styles for this link</p>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs">Button Color</Label>
                                      <Input
                                        type="color"
                                        value={link.buttonColor || linkButtonColor}
                                        onChange={(e) => updateLink(index, "buttonColor", e.target.value)}
                                        className="w-full h-8 cursor-pointer"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Text Color</Label>
                                      <Input
                                        type="color"
                                        value={link.textColor || linkButtonTextColor}
                                        onChange={(e) => updateLink(index, "textColor", e.target.value)}
                                        className="w-full h-8 cursor-pointer"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Icon Color</Label>
                                      <Input
                                        type="color"
                                        value={link.iconColor || profileAccentColor}
                                        onChange={(e) => updateLink(index, "iconColor", e.target.value)}
                                        className="w-full h-8 cursor-pointer"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Border Color</Label>
                                      <Input
                                        type="color"
                                        value={link.borderColor || linkButtonBorderColor}
                                        onChange={(e) => updateLink(index, "borderColor", e.target.value)}
                                        className="w-full h-8 cursor-pointer"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs">Shape</Label>
                                      <select
                                        value={link.buttonStyle || linkButtonStyle}
                                        onChange={(e) => updateLink(index, "buttonStyle", e.target.value)}
                                        className="w-full h-8 px-2 text-xs rounded-md bg-slate-900/50 border border-white/10 text-slate-100"
                                      >
                                        <option value="rounded">Rounded</option>
                                        <option value="square">Square</option>
                                        <option value="pill">Pill</option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Shadow</Label>
                                      <select
                                        value={link.shadow || linkButtonShadow}
                                        onChange={(e) => updateLink(index, "shadow", e.target.value)}
                                        className="w-full h-8 px-2 text-xs rounded-md bg-slate-900/50 border border-white/10 text-slate-100"
                                      >
                                        <option value="none">None</option>
                                        <option value="sm">Small</option>
                                        <option value="md">Medium</option>
                                        <option value="lg">Large</option>
                                        <option value="xl">Extra Large</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs">Border Style</Label>
                                      <select
                                        value={link.borderStyle || linkButtonBorder}
                                        onChange={(e) => updateLink(index, "borderStyle", e.target.value)}
                                        className="w-full h-8 px-2 text-xs rounded-md bg-slate-900/50 border border-white/10 text-slate-100"
                                      >
                                        <option value="none">None</option>
                                        <option value="solid">Solid</option>
                                        <option value="gradient">Gradient</option>
                                      </select>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Animation</Label>
                                      <select
                                        value={link.animation || linkButtonAnimation}
                                        onChange={(e) => updateLink(index, "animation", e.target.value)}
                                        className="w-full h-8 px-2 text-xs rounded-md bg-slate-900/50 border border-white/10 text-slate-100"
                                      >
                                        <option value="none">None</option>
                                        <option value="scale">Scale</option>
                                        <option value="slide">Slide</option>
                                        <option value="glow">Glow</option>
                                      </select>
                                    </div>
                                  </div>

                                  {(link.animation === "glow" || (!link.animation && linkButtonAnimation === "glow")) && (
                                    <div className="space-y-1">
                                      <Label className="text-xs">Glow Color</Label>
                                      <Input
                                        type="color"
                                        value={link.glowColor || linkButtonGlowColor}
                                        onChange={(e) => updateLink(index, "glowColor", e.target.value)}
                                        className="w-full h-8 cursor-pointer"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLink(index)}
                            className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 mt-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {state.errors?.links && (
                      <p className="text-sm text-red-500">{state.errors.links[0]}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {state.message && (
                <div className={`p-4 rounded-lg ${state.message.includes("Success") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                  {state.message}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium h-12 text-lg"
                disabled={isPending}
              >
                {isPending ? "Creating Profile..." : "Create Profile"}
              </Button>
            </form>
          </div>

          {/* Live Preview Section */}
          <div className="hidden lg:block lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <Card className="border-white/10 bg-white/5 backdrop-blur-md h-full overflow-hidden">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your page will look</CardDescription>
              </CardHeader>
              <CardContent className="h-[calc(100%-5rem)] overflow-y-auto">
                <div
                  className="rounded-lg p-8 min-h-full flex flex-col items-center"
                  style={getPreviewBackgroundStyle()}
                >
                  {/* Preview Profile Header */}
                  <div className="flex flex-col items-center text-center space-y-4 mb-8">
                    <div className="relative">
                      <div
                        className="absolute -inset-1 rounded-full opacity-75 blur"
                        style={{
                          background: `linear-gradient(135deg, ${avatarBorderColor}, ${profileAccentColor})`
                        }}
                      />
                      <div
                        className="relative h-20 w-20 rounded-full overflow-hidden bg-slate-800 flex items-center justify-center"
                        style={{
                          borderWidth: `${avatarBorderWidth}px`,
                          borderColor: avatarBorderColor,
                          borderStyle: "solid",
                        }}
                      >
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={displayName || "Avatar"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-3xl">👤</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h1
                        className="text-xl font-bold tracking-tight"
                        style={{
                          color: profileTextColor,
                          fontFamily: fontFamily
                        }}
                      >
                        {displayName || "Your Name"}
                      </h1>
                      <p
                        className="font-medium text-sm"
                        style={{ color: profileAccentColor }}
                      >
                        @{username || "username"}
                      </p>
                      {bio && (
                        <p
                          className="max-w-xs mx-auto leading-relaxed text-sm"
                          style={{ color: profileBioColor }}
                        >
                          {bio}
                        </p>
                      )}
                      {!bio && (
                        <p
                          className="max-w-xs mx-auto leading-relaxed text-sm opacity-50"
                          style={{ color: profileBioColor }}
                        >
                          Your bio will appear here
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Preview Links */}
                  <div className="space-y-3 w-full max-w-sm">
                    {links.map((link, index) => {
                      const IconComponent = (Icons[link.icon as keyof typeof Icons] as React.ElementType) || Icons.Link;
                      const buttonColor = link.buttonColor || linkButtonColor;
                      const textColor = link.textColor || linkButtonTextColor;
                      const borderColor = link.borderColor || linkButtonBorderColor;
                      const borderStyle = link.borderStyle || linkButtonBorder;
                      const buttonStyle = link.buttonStyle || linkButtonStyle;
                      const shadow = link.shadow || linkButtonShadow;
                      const animation = link.animation || linkButtonAnimation;
                      const iconColor = link.iconColor || profileAccentColor;
                      const glowColor = link.glowColor || linkButtonGlowColor;

                      const getBorderRadius = () => {
                        switch (buttonStyle) {
                          case "square": return "0px";
                          case "pill": return "9999px";
                          default: return "12px";
                        }
                      };

                      const getBoxShadow = (isHover = false) => {
                        const shadowMap = {
                          "none": "none",
                          "sm": isHover ? "0 2px 4px 0 rgb(0 0 0 / 0.1)" : "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                          "md": isHover ? "0 6px 10px -1px rgb(0 0 0 / 0.15)" : "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          "lg": isHover ? "0 15px 20px -3px rgb(0 0 0 / 0.15)" : "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                          "xl": isHover ? "0 25px 35px -5px rgb(0 0 0 / 0.15)" : "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                        };
                        return shadowMap[shadow as keyof typeof shadowMap] || shadowMap["md"];
                      };

                      const getBorderStyle = () => {
                        if (borderStyle === "none") return { border: "none" };
                        if (borderStyle === "solid") return { border: `2px solid ${borderColor}` };
                        return { border: "none" };
                      };

                      const getAnimationClass = () => {
                        switch (animation) {
                          case "none": return "";
                          case "scale": return "hover:scale-105";
                          case "slide": return "hover:translate-x-1";
                          case "glow": return "";
                          default: return "hover:scale-105";
                        }
                      };

                      const hexToRgba = (hex: string, alpha: number) => {
                        const r = parseInt(hex.slice(1, 3), 16);
                        const g = parseInt(hex.slice(3, 5), 16);
                        const b = parseInt(hex.slice(5, 7), 16);
                        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                      };

                      const isHovered = hoveredLinkIndex === index;

                      return (
                        <button
                          key={index}
                          onClick={() => {
                            if (link.url) {
                              window.open(link.url.startsWith('http') ? link.url : `https://${link.url}`, '_blank');
                            }
                          }}
                          onMouseEnter={() => setHoveredLinkIndex(index)}
                          onMouseLeave={() => setHoveredLinkIndex(null)}
                          className={`flex min-h-[56px] items-center p-3 relative transition-all duration-300 active:scale-95 cursor-pointer w-full ${getAnimationClass()}`}
                          style={{
                            backgroundColor: buttonColor,
                            borderRadius: getBorderRadius(),
                            boxShadow: getBoxShadow(isHovered),
                            ...getBorderStyle(),
                            ...(animation === "glow" && isHovered ? {
                              filter: `drop-shadow(0 0 12px ${hexToRgba(glowColor, 0.6)}) drop-shadow(0 0 24px ${hexToRgba(glowColor, 0.3)})`,
                            } : {}),
                          }}
                          disabled={!link.url}
                        >
                          <div
                            className="mr-3 flex h-8 w-8 items-center justify-center rounded-full text-sm transition-transform duration-200"
                            style={{
                              backgroundColor: `${iconColor}20`,
                              color: iconColor
                            }}
                          >
                            <IconComponent size={16} />
                          </div>
                          <div
                            className="flex-1 text-center font-medium text-sm"
                            style={{ color: textColor }}
                          >
                            {link.title || "Link Title"}
                          </div>
                          <div className="w-8" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Import Profile Dialog */}
      <ImportProfileDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportProfile}
      />
    </main>
  );
}
