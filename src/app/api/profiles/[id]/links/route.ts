import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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
    const { title, url, icon } = body;

    // Verify the profile belongs to the user
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: { links: true },
    });

    if (!profile || profile.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Get the next order number
    const maxOrder = profile.links.length > 0
      ? Math.max(...profile.links.map((l: { order: number }) => l.order))
      : 0;

    // Create the link
    const link = await prisma.link.create({
      data: {
        title,
        url,
        icon: icon || "",
        order: maxOrder + 1,
        profileId: id,
      },
    });

    return NextResponse.json(link);
  } catch (error) {
    console.error("Error creating link:", error);
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 });
  }
}
