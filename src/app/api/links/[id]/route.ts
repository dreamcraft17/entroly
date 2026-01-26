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
    
    console.log('=== PATCH /api/links/' + id + ' ===');
    console.log('Request body:', JSON.stringify(body, null, 2));

    // Verify the link belongs to the user
    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!link || link.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Update the link with all provided fields
    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.icon !== undefined && { icon: body.icon || "" }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.enabled !== undefined && { enabled: body.enabled }),
        ...(body.buttonColor !== undefined && { buttonColor: body.buttonColor }),
        ...(body.textColor !== undefined && { textColor: body.textColor }),
        ...(body.iconColor !== undefined && { iconColor: body.iconColor }),
        ...(body.borderColor !== undefined && { borderColor: body.borderColor }),
        ...(body.buttonStyle !== undefined && { buttonStyle: body.buttonStyle }),
        ...(body.borderStyle !== undefined && { borderStyle: body.borderStyle }),
        ...(body.shadow !== undefined && { shadow: body.shadow }),
        ...(body.animation !== undefined && { animation: body.animation }),
      },
    });

    console.log('Updated link in database:', { id: updatedLink.id, title: updatedLink.title, enabled: updatedLink.enabled });

    return NextResponse.json(updatedLink);
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json({ error: "Failed to update link" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify the link belongs to the user
    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    if (!link || link.profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete the link
    await prisma.link.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
