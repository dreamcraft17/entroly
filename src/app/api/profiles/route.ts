import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Profile } from "@/types";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profiles = await prisma.profile.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        links: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Debug: Log to verify enabled field is present
    console.log('API /api/profiles - Returning profiles:', profiles.map((p: { id: string; username: string; links: { id: string; title: string; enabled: boolean }[] }) => ({
      id: p.id,
      username: p.username,
      links: p.links.map((l: { id: string; title: string; enabled: boolean }) => ({ id: l.id, title: l.title, enabled: l.enabled }))
    })));

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: Profile = await request.json();

    if (!data.username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Check availability
    const existing = await prisma.profile.findUnique({
      where: { username: data.username },
    });

    if (existing) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }

    // Create Profile
    const newProfile = await prisma.profile.create({
      data: {
        userId: session.user.id,
        username: data.username,
        displayName: data.displayName,
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || '',

        // Background
        backgroundColor: data.backgroundColor || '#0f172a',
        backgroundType: data.backgroundType || 'solid',
        backgroundGradient: data.backgroundGradient,
        backgroundImage: data.backgroundImage,

        // Theme Colors
        profileTextColor: data.profileTextColor || '#f1f5f9',
        profileAccentColor: data.profileAccentColor || '#10b981',
        profileBioColor: data.profileBioColor || '#94a3b8',

        // Fonts & Avatar
        fontFamily: data.fontFamily || 'Inter',
        avatarBorderColor: data.avatarBorderColor || '#10b981',
        avatarBorderWidth: data.avatarBorderWidth ?? 4,

        // Global Button Styles
        linkButtonStyle: data.linkButtonStyle || 'rounded',
        linkButtonColor: data.linkButtonColor || '#ffffff',
        linkButtonTextColor: data.linkButtonTextColor || '#0f172a',
        linkButtonBorder: data.linkButtonBorder || 'none',
        linkButtonBorderColor: data.linkButtonBorderColor || '#10b981',
        linkButtonShadow: data.linkButtonShadow || 'md',
        linkButtonShadowColor: data.linkButtonShadowColor || '#000000',
        linkButtonAnimation: data.linkButtonAnimation || 'scale',
        linkButtonBorderWidth: data.linkButtonBorderWidth ?? 0,

        // Create Links
        links: {
          create: (data.links || []).map((link, index) => ({
            title: link.title,
            url: link.url,
            icon: link.icon || '',
            type: link.type || 'classic',
            order: index,
            enabled: link.enabled !== false, // default true

            // Link overrides
            buttonColor: link.buttonColor,
            textColor: link.textColor,
            borderColor: link.borderColor,
            borderStyle: link.borderStyle,
            borderWidth: link.borderWidth,
            buttonStyle: link.buttonStyle,
            shadow: link.shadow,
            shadowColor: link.shadowColor,
            animation: link.animation,
            iconColor: link.iconColor,
            thumbnail: link.thumbnail
          }))
        }
      },
      include: {
        links: true
      }
    });

    return NextResponse.json(newProfile);

  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
