import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUser, isAdmin } from "@/lib/auth/helpers";
import { deleteImage } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { categories: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

// Update post (admin only)
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
    const { title, slug, content, excerpt, published, categoryIds, featuredImage } = body ?? {};

    // Check if slug is already taken by another post
    if (slug) {
      const existing = await prisma.post.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }
    }

    // Get current post to check if featured image is changing
    const currentPost = await prisma.post.findUnique({
      where: { id },
      select: { featuredImage: true }
    });

    // If featured image is changing, delete the old one
    if (currentPost?.featuredImage && featuredImage && currentPost.featuredImage !== featuredImage) {
      try {
        await deleteImage(currentPost.featuredImage);
      } catch (error) {
        console.error("Error deleting old featured image:", error);
        // Continue even if deletion fails
      }
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        featuredImage,
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
              connect: categoryIds.map((catId: string) => ({ id: catId })),
            }
          : undefined,
      },
      include: { categories: true },
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("Error updating post:", err);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

// Delete post (admin only)
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

    // Get the post to check if it has a featured image
    const post = await prisma.post.findUnique({
      where: { id },
      select: { featuredImage: true }
    });

    // Delete the post from database
    await prisma.post.delete({ where: { id } });

    // Delete featured image from storage if it exists
    if (post?.featuredImage) {
      try {
        await deleteImage(post.featuredImage);
      } catch (error) {
        console.error("Error deleting featured image:", error);
        // Continue even if image deletion fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Error deleting post:", err);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
