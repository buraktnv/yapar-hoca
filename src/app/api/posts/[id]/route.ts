import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { categories: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(req: Request, { params }: Params) {
  const body = await req.json();
  const { title, slug, content, excerpt, published, categoryIds } = body ?? {};

  try {
    const updated = await prisma.post.update({
      where: { id: params.id },
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        publishedAt:
          typeof published === "boolean"
            ? published
              ? new Date()
              : null
            : undefined,
        categories: Array.isArray(categoryIds)
          ? {
              set: [],
              connect: categoryIds.map((id: string) => ({ id })),
            }
          : undefined,
      },
      include: { categories: true },
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    await prisma.post.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
