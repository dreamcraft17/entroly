import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Verify the profile belongs to the user
    const profile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update the profile with all provided fields
    const updatedProfile = await prisma.profile.update({
      where: { id },
      data: {
        ...(body.displayName !== undefined && { displayName: body.displayName }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.avatarUrl !== undefined && { avatarUrl: body.avatarUrl }),
        ...(body.backgroundColor !== undefined && { backgroundColor: body.backgroundColor }),
        ...(body.backgroundType !== undefined && { backgroundType: body.backgroundType }),
        ...(body.backgroundGradient !== undefined && { backgroundGradient: body.backgroundGradient }),
        ...(body.backgroundImage !== undefined && { backgroundImage: body.backgroundImage }),
        ...(body.profileTextColor !== undefined && { profileTextColor: body.profileTextColor }),
        ...(body.profileAccentColor !== undefined && { profileAccentColor: body.profileAccentColor }),
        ...(body.profileBioColor !== undefined && { profileBioColor: body.profileBioColor }),
        ...(body.fontFamily !== undefined && { fontFamily: body.fontFamily }),
        ...(body.linkButtonStyle !== undefined && { linkButtonStyle: body.linkButtonStyle }),
        ...(body.linkButtonColor !== undefined && { linkButtonColor: body.linkButtonColor }),
        ...(body.linkButtonTextColor !== undefined && { linkButtonTextColor: body.linkButtonTextColor }),
        ...(body.linkButtonBorder !== undefined && { linkButtonBorder: body.linkButtonBorder }),
        ...(body.linkButtonBorderColor !== undefined && { linkButtonBorderColor: body.linkButtonBorderColor }),
        ...(body.linkButtonShadow !== undefined && { linkButtonShadow: body.linkButtonShadow }),
        ...(body.linkButtonAnimation !== undefined && { linkButtonAnimation: body.linkButtonAnimation }),
        ...(body.avatarBorderColor !== undefined && { avatarBorderColor: body.avatarBorderColor }),
        ...(body.avatarBorderWidth !== undefined && { avatarBorderWidth: body.avatarBorderWidth }),
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
