import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// List posts
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { categories: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

// Create post
export async function POST(req: Request) {
  const body = await req.json();
  const { title, slug, content, excerpt, published, categoryIds } = body ?? {};

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "title, slug and content are required" },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt ?? null,
        published: Boolean(published),
        publishedAt: published ? new Date() : null,
        categories: categoryIds?.length
          ? { connect: categoryIds.map((id: string) => ({ id })) }
          : undefined,
      },
      include: { categories: true },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
