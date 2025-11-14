import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser, isAdmin } from "@/lib/auth/helpers";

// List posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

// Create post (admin only)
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
    const { title, slug, content, excerpt, published, categoryIds, authorId, featuredImage } = body ?? {};

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "title, slug and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existing = await prisma.post.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      );
    }

    const created = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt ?? null,
        featuredImage: featuredImage ?? null,
        published: Boolean(published),
        publishedAt: published ? new Date() : null,
        authorId: authorId || user.id,
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: { categories: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    console.error("Error creating post:", err);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
