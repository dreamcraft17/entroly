"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkType, Profile } from "@/types";
import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { MoreVertical, Share2, Facebook, Linkedin, Mail, Copy, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LinkCardProps {
  link: LinkType;
  profile: Profile;
  highlightId?: string | null;
}

export const LinkCard: React.FC<LinkCardProps> = ({ link, profile, highlightId }) => {
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Check if this link should be highlighted
  useEffect(() => {
    if (highlightId === link.id) {
      setIsHighlighted(true);
      // Scroll to this link
      const element = document.getElementById(`link-${link.id}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
      // Remove highlight after 3 seconds
      setTimeout(() => setIsHighlighted(false), 3000);
    }
  }, [highlightId, link.id]);

  // Dynamically get the icon component
  const IconComponent = (Icons[link.icon as keyof typeof Icons] as React.ElementType) || Icons.Link;

  // Use link-specific styles, fallback to profile defaults
  const buttonColor = link.buttonColor || profile.linkButtonColor;
  const textColor = link.textColor || profile.linkButtonTextColor;
  const borderColor = link.borderColor || profile.linkButtonBorderColor;
  const borderStyle = link.borderStyle || profile.linkButtonBorder;
  const buttonStyle = link.buttonStyle || profile.linkButtonStyle;
  const shadow = link.shadow || profile.linkButtonShadow;
  const shadowColor = link.shadowColor || profile.linkButtonShadowColor || '#000000';
  const animation = link.animation || profile.linkButtonAnimation;
  const iconColor = link.iconColor || profile.profileAccentColor;
  const borderWidth = link.borderWidth ?? profile.linkButtonBorderWidth ?? 0;

  // Map button styles to border radius
  const getBorderRadius = () => {
    switch (buttonStyle) {
      case "square":
        return "0px";
      case "pill":
        return "9999px";
      case "rounded":
      default:
        return "12px";
    }
  };

  // Map shadow values
  const getBoxShadow = () => {
    switch (shadow) {
      case "none":
        return "none";
      case "sm":
        return "0 1px 2px 0 rgb(0 0 0 / 0.05)";
      case "md":
        return "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
      case "lg":
        return "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)";
      case "xl":
        return "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)";
      case "hard":
        return `4px 4px 0px 0px ${shadowColor}`;
      default:
        return "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)";
    }
  };

  // Animation class
  const getAnimationClass = () => {
    switch (animation) {
      case "scale":
        return "hover:scale-[1.02] active:scale-[0.98]";
      case "slide":
        return "hover:translate-x-1";
      case "glow":
        return "hover:shadow-lg";
      case "none":
      default:
        return "";
    }
  };

  // Border style
  const getBorderStyle = () => {
    if (borderStyle === "none") {
      return { border: "none" };
    }
    const width = borderWidth > 0 ? borderWidth : 2; // Default to 2px if solid/gradient but 0 width

    if (borderStyle === "solid") {
      return { border: `${width}px solid ${borderColor}` };
    }
    if (borderStyle === "gradient") {
      return {
        border: `${width}px solid transparent`,
        backgroundClip: "padding-box",
        position: "relative" as const
      };
    }
    return { border: "none" };
  };

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${profile.username}?highlight=${link.id}`
    : `https://yourdomain.com/${profile.username}?highlight=${link.id}`;
  const shareMessage = `Check out my link: ${link.title} on my Entro.ly profile!`;

  return (
    <>
      <div className="relative" id={`link-${link.id}`}>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`block w-full transition-all duration-200 ${getAnimationClass()}`}
        >
          <div
            className={`flex min-h-[64px] items-center p-4 relative overflow-hidden transition-all duration-300 ${isHighlighted ? 'ring-4 ring-emerald-400 ring-opacity-50 animate-pulse' : ''
              }`}
            style={{
              backgroundColor: buttonColor,
              borderRadius: getBorderRadius(),
              boxShadow: isHighlighted ? '0 0 30px rgba(52, 211, 153, 0.5), ' + getBoxShadow() : getBoxShadow(),
              ...getBorderStyle(),
            }}
          >
            {/* Gradient border overlay if needed */}
            {borderStyle === "gradient" && (
              <div
                className="absolute inset-0 rounded-[inherit] pointer-events-none"
                style={{
                  padding: "2px",
                  background: `linear-gradient(135deg, ${borderColor}, ${profile.profileAccentColor})`,
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              />
            )}

            <div
              className="mr-4 flex h-10 w-10 items-center justify-center rounded-full overflow-hidden"
              style={{
                backgroundColor: link.thumbnail ? 'transparent' : `${iconColor}20`,
                color: iconColor
              }}
            >
              {link.thumbnail ? (
                <img
                  src={link.thumbnail}
                  alt=""
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // Fallback to Google Favicon API
                    try {
                      const domain = new URL(link.url).hostname;
                      (e.target as HTMLImageElement).src = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
                    } catch {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }
                  }}
                />
              ) : (
                <IconComponent size={20} />
              )}
            </div>

            <div
              className="flex-1 text-center font-medium"
              style={{ color: textColor }}
            >
              {link.title}
            </div>

            {/* Share button instead of spacer */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShareMenuOpen(!shareMenuOpen);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              style={{ color: textColor }}
            >
              <MoreVertical size={18} />
            </button>
          </div>
        </a>
      </div>

      {/* Share Popup */}
      {shareMenuOpen && (
        <div
          className="fixed z-[110] inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center"
          onClick={() => setShareMenuOpen(false)}
        >
          <Card
            className="border-white/10 bg-slate-900 backdrop-blur-md p-6 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">Share Link Button</h3>
              <button
                onClick={() => setShareMenuOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-400 mb-2">Share this profile where people can click this link:</p>
              <div className="bg-slate-800 rounded-lg p-3 flex items-center space-x-2">
                <span className="text-sm text-slate-300 flex-1 truncate">{profileUrl}</span>
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(profileUrl);
                    setLinkCopied(true);
                    setTimeout(() => setLinkCopied(false), 2000);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 transition"
                >
                  {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-400 mb-3">Share via</p>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`, '_blank')}
                  className="flex flex-col items-center p-3 rounded-lg bg-slate-800 hover:bg-blue-500/20 border border-white/10 hover:border-blue-500/50 transition flex-shrink-0 min-w-[90px]"
                >
                  <Facebook className="w-6 h-6 text-blue-400 mb-1.5" />
                  <span className="text-xs text-slate-300">Facebook</span>
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareMessage)}`, '_blank')}
                  className="flex flex-col items-center p-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-white/10 hover:border-white/30 transition flex-shrink-0 min-w-[90px]"
                >
                  <X className="w-6 h-6 text-white mb-1.5" />
                  <span className="text-xs text-slate-300">X</span>
                </button>
                <button
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`, '_blank')}
                  className="flex flex-col items-center p-3 rounded-lg bg-slate-800 hover:bg-blue-600/20 border border-white/10 hover:border-blue-600/50 transition flex-shrink-0 min-w-[90px]"
                >
                  <Linkedin className="w-6 h-6 text-blue-600 mb-1.5" />
                  <span className="text-xs text-slate-300">LinkedIn</span>
                </button>
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`${shareMessage} ${profileUrl}`)}`, '_blank')}
                  className="flex flex-col items-center p-3 rounded-lg bg-slate-800 hover:bg-green-500/20 border border-white/10 hover:border-green-500/50 transition flex-shrink-0 min-w-[90px]"
                >
                  <svg className="w-6 h-6 text-green-400 mb-1.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  <span className="text-xs text-slate-300">WhatsApp</span>
                </button>
                <button
                  onClick={() => window.open(`mailto:?subject=${encodeURIComponent(shareMessage)}&body=${encodeURIComponent(`${shareMessage}\n\n${profileUrl}`)}`, '_blank')}
                  className="flex flex-col items-center p-3 rounded-lg bg-slate-800 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/50 transition flex-shrink-0 min-w-[90px]"
                >
                  <Mail className="w-6 h-6 text-emerald-400 mb-1.5" />
                  <span className="text-xs text-slate-300">Email</span>
                </button>
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Share2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-400 mb-1">Love Entro.ly?</p>
                  <p className="text-xs text-slate-300 mb-2">Create your own link hub and share all your important links in one place!</p>
                  <Button
                    onClick={() => window.open('/', '_blank')}
                    size="sm"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white"
                  >
                    Join Entro.ly
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};
