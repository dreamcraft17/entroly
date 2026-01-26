"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { profileCache } from "@/lib/profile-cache";

const LinkSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().url("Invalid URL"),
  icon: z.string().min(1, "Icon is required"),
  buttonColor: z.string().optional(),
  textColor: z.string().optional(),
  borderColor: z.string().optional(),
  borderStyle: z.string().optional(),
  buttonStyle: z.string().optional(),
  shadow: z.string().optional(),
  animation: z.string().optional(),
  iconColor: z.string().optional(),
});

const ProfileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens"),
  displayName: z.string().min(1, "Display name is required"),
  bio: z.string().optional(),
  avatarUrl: z.string().url("Invalid Avatar URL").optional().or(z.literal("")),

  // Background customization
  backgroundColor: z.string().default("#0f172a"),
  backgroundType: z.string().default("solid"),
  backgroundGradient: z.string().optional(),
  backgroundImage: z.string().url("Invalid Background Image URL").optional().or(z.literal("")),

  // Profile card customization
  profileTextColor: z.string().default("#f1f5f9"),
  profileAccentColor: z.string().default("#10b981"),
  profileBioColor: z.string().default("#94a3b8"),

  // Font customization
  fontFamily: z.string().default("Inter"),

  // Avatar customization
  avatarBorderColor: z.string().default("#10b981"),
  avatarBorderWidth: z.number().int().min(0).max(20).default(4),

  // Global link button style defaults
  linkButtonStyle: z.string().default("rounded"),
  linkButtonColor: z.string().default("#ffffff"),
  linkButtonTextColor: z.string().default("#0f172a"),
  linkButtonBorder: z.string().default("none"),
  linkButtonBorderColor: z.string().default("#10b981"),
  linkButtonShadow: z.string().default("md"),
  linkButtonAnimation: z.string().default("scale"),

  links: z.array(LinkSchema),
});

export type CreateProfileState = {
  errors?: {
    username?: string[];
    displayName?: string[];
    bio?: string[];
    avatarUrl?: string[];
    backgroundColor?: string[];
    backgroundType?: string[];
    backgroundGradient?: string[];
    backgroundImage?: string[];
    profileTextColor?: string[];
    profileAccentColor?: string[];
    profileBioColor?: string[];
    fontFamily?: string[];
    avatarBorderColor?: string[];
    avatarBorderWidth?: string[];
    linkButtonStyle?: string[];
    linkButtonColor?: string[];
    linkButtonTextColor?: string[];
    linkButtonBorder?: string[];
    linkButtonBorderColor?: string[];
    linkButtonShadow?: string[];
    linkButtonAnimation?: string[];
    links?: string[];
    _form?: string[];
  };
  message?: string;
};

export async function createProfile(prevState: CreateProfileState, formData: FormData): Promise<CreateProfileState> {
  // Parse links from formData
  const linksRaw = formData.get("links");
  let linksData = [];
  try {
    linksData = linksRaw ? JSON.parse(linksRaw as string) : [];
  } catch (error) {
    console.error("Error parsing links:", error);
    return {
      message: "Invalid links data",
    };
  }

  const avatarBorderWidthValue = formData.get("avatarBorderWidth");

  const validatedFields = ProfileSchema.safeParse({
    username: formData.get("username"),
    displayName: formData.get("displayName"),
    bio: formData.get("bio"),
    avatarUrl: formData.get("avatarUrl"),

    // Background customization
    backgroundColor: formData.get("backgroundColor") || "#0f172a",
    backgroundType: formData.get("backgroundType") || "solid",
    backgroundGradient: formData.get("backgroundGradient"),
    backgroundImage: formData.get("backgroundImage"),

    // Profile card customization
    profileTextColor: formData.get("profileTextColor") || "#f1f5f9",
    profileAccentColor: formData.get("profileAccentColor") || "#10b981",
    profileBioColor: formData.get("profileBioColor") || "#94a3b8",

    // Font customization
    fontFamily: formData.get("fontFamily") || "Inter",

    // Avatar customization
    avatarBorderColor: formData.get("avatarBorderColor") || "#10b981",
    avatarBorderWidth: avatarBorderWidthValue ? parseInt(avatarBorderWidthValue as string) : 4,

    // Global link button style defaults
    linkButtonStyle: formData.get("linkButtonStyle") || "rounded",
    linkButtonColor: formData.get("linkButtonColor") || "#ffffff",
    linkButtonTextColor: formData.get("linkButtonTextColor") || "#0f172a",
    linkButtonBorder: formData.get("linkButtonBorder") || "none",
    linkButtonBorderColor: formData.get("linkButtonBorderColor") || "#10b981",
    linkButtonShadow: formData.get("linkButtonShadow") || "md",
    linkButtonAnimation: formData.get("linkButtonAnimation") || "scale",

    links: linksData,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Profile.",
    };
  }

  const {
    username,
    displayName,
    bio,
    avatarUrl,
    backgroundColor,
    backgroundType,
    backgroundGradient,
    backgroundImage,
    profileTextColor,
    profileAccentColor,
    profileBioColor,
    fontFamily,
    avatarBorderColor,
    avatarBorderWidth,
    linkButtonStyle,
    linkButtonColor,
    linkButtonTextColor,
    linkButtonBorder,
    linkButtonBorderColor,
    linkButtonShadow,
    linkButtonAnimation,
    links
  } = validatedFields.data;

  try {
    // Security: Get authenticated user
    const session = await auth();

    if (!session?.user?.id) {
      return {
        errors: {},
        message: "You must be logged in to create a profile",
      };
    }

    // Check if username exists
    const existingProfile = await prisma.profile.findUnique({
      where: { username },
    });

    if (existingProfile) {
      return {
        errors: {
          username: ["Username already taken"],
        },
        message: "Username already taken",
      };
    }

    await prisma.profile.create({
      data: {
        username,
        displayName,
        bio: bio || "",
        userId: session.user.id,
        avatarUrl: avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`,

        // Background customization
        backgroundColor,
        backgroundType,
        backgroundGradient: backgroundGradient || null,
        backgroundImage: backgroundImage || null,

        // Profile card customization
        profileTextColor,
        profileAccentColor,
        profileBioColor,

        // Font customization
        fontFamily,

        // Avatar customization
        avatarBorderColor,
        avatarBorderWidth,

        // Global link button style defaults
        linkButtonStyle,
        linkButtonColor,
        linkButtonTextColor,
        linkButtonBorder,
        linkButtonBorderColor,
        linkButtonShadow,
        linkButtonAnimation,

        links: {
          create: links.map((link, index) => ({
            title: link.title,
            url: link.url,
            icon: link.icon,
            order: index,
            buttonColor: link.buttonColor || null,
            textColor: link.textColor || null,
            borderColor: link.borderColor || null,
            borderStyle: link.borderStyle || null,
            buttonStyle: link.buttonStyle || null,
            shadow: link.shadow || null,
            animation: link.animation || null,
            iconColor: link.iconColor || null,
          })),
        },
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return {
      message: "Database Error: Failed to Create Profile.",
    };
  }

  revalidatePath("/");
  redirect(`/${username}`);
}

// Internal function that fetches from database
async function fetchProfileFromDb(username: string) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        links: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
    return profile;
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    throw new Error("Failed to fetch profile.");
  }
}

// Cached version with 60-second revalidation
const getCachedProfile = unstable_cache(
  async (username: string) => fetchProfileFromDb(username),
  ["profile"],
  { revalidate: 60, tags: ["profile"] }
);

// React cache() wrapper for request-level deduplication
// This ensures generateMetadata and page component share the same data
export const getProfile = cache(async (username: string) => {
  // Check in-memory cache first (fastest)
  const memCached = profileCache.get<Awaited<ReturnType<typeof getCachedProfile>>>(username);
  if (memCached) {
    return memCached;
  }

  // Fall back to unstable_cache + database
  const profile = await getCachedProfile(username);

  // Store in memory cache for future requests
  if (profile) {
    profileCache.set(username, profile);
  }

  return profile;
});

export async function getAllProfiles() {
  try {
    const profiles = await prisma.profile.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        links: true, // Include links if needed for preview, or remove for performance
      },
    });
    return profiles;
  } catch (error) {
    console.error("Failed to fetch profiles:", error);
    throw new Error("Failed to fetch profiles.");
  }
}
