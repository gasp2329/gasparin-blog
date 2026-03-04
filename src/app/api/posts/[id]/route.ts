import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

// GET /api/posts/[id] — get a single published post
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { author: { select: { name: true, image: true } }, tags: true },
  });

  if (!post || !post.published) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

// PUT /api/posts/[id] — update a post (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, content, excerpt, coverImage, published, featured, type, tags } = body;

  const updateData: Record<string, unknown> = {};
  if (title !== undefined) {
    updateData.title = title;
    updateData.slug = slugify(title);
  }
  if (content !== undefined) updateData.content = content;
  if (excerpt !== undefined) updateData.excerpt = excerpt;
  if (coverImage !== undefined) updateData.coverImage = coverImage;
  if (published !== undefined) {
    updateData.published = published;
    if (published) updateData.publishedAt = new Date();
  }
  if (featured !== undefined) updateData.featured = featured;
  if (type !== undefined) updateData.type = type;

  if (tags && Array.isArray(tags)) {
    const tagResults = await Promise.all(
      tags.map((tagName: string) => {
        const tagSlug = slugify(tagName);
        return prisma.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        });
      })
    );
    updateData.tags = { set: tagResults.map((t) => ({ id: t.id })) };
  }

  const post = await prisma.post.update({
    where: { id },
    data: updateData,
    include: { tags: true },
  });

  return NextResponse.json(post);
}

// DELETE /api/posts/[id] — delete a post (admin only)
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
