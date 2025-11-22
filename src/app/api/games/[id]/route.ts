import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser, isAdmin } from "@/lib/auth/helpers";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const game = await prisma.game.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!game) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(game);
}

// Update game (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const { title, slug, description, htmlContent, thumbnailUrl, categoryId, isPublished, order } = body ?? {};

    // Check if slug is already taken by another game
    if (slug) {
      const existing = await prisma.game.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
    }

    // Verify category exists if being updated
    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return NextResponse.json(
          { error: "Category not found" },
          { status: 400 }
        );
      }
    }

    const updated = await prisma.game.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        htmlContent,
        thumbnailUrl,
        categoryId,
        isPublished,
        order,
      },
      include: { category: true },
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("Error updating game:", err);
    return NextResponse.json(
      { error: "Failed to update game" },
      { status: 500 }
    );
  }
}

// Delete game (admin only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const userIsAdmin = await isAdmin(user.id);
    if (!userIsAdmin) {
      return NextResponse.json({ error: "Forbidden: Admin only" }, { status: 403 });
    }

    const { id } = await params;

    // Delete the game from database
    await prisma.game.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error deleting game:", err);
    return NextResponse.json(
      { error: "Failed to delete game" },
      { status: 500 }
    );
  }
}
