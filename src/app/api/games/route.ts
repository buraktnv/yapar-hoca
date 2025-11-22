import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser, isAdmin } from "@/lib/auth/helpers";

// List all games
export async function GET() {
  const games = await prisma.game.findMany({
    include: { category: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(games);
}

// Create game (admin only)
export async function POST(req: Request) {
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

    const body = await req.json();
    const { title, slug, description, htmlContent, thumbnailUrl, categoryId, isPublished, order } = body ?? {};

    if (!title || !slug || !htmlContent || !categoryId) {
      return NextResponse.json(
        { error: "title, slug, htmlContent and categoryId are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.game.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 400 }
      );
    }

    const created = await prisma.game.create({
      data: {
        title,
        slug,
        description: description ?? null,
        htmlContent,
        thumbnailUrl: thumbnailUrl ?? null,
        categoryId,
        isPublished: Boolean(isPublished),
        order: order ?? 0,
      },
      include: { category: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating game:", err);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}
