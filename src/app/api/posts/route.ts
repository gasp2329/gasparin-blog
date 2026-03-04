import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

// GET /api/posts — list published posts (public)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const where: Record<string, unknown> = { published: true };
  if (tag) {
    where.tags = { some: { slug: tag } };
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: { select: { name: true, image: true } }, tags: true },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, pages: Math.ceil(total / limit) });
}

// POST /api/posts — create a new post (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, excerpt, coverImage, published, featured, type, tags } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const slug = slugify(title);

  // Check for duplicate slug
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "A post with this title already exists" }, { status: 409 });
  }

  // Upsert tags
  const tagRecords = [];
  if (tags && Array.isArray(tags)) {
    for (const tagName of tags) {
      const tagSlug = slugify(tagName);
      const tag = await prisma.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name: tagName, slug: tagSlug },
      });
      tagRecords.push({ id: tag.id });
    }
  }

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt || content.replace(/<[^>]*>/g, "").slice(0, 200) + "...",
      coverImage: coverImage || null,
      published: published ?? false,
      featured: featured ?? false,
      type: type || "article",
      publishedAt: published ? new Date() : null,
      authorId: (session.user as { id: string }).id,
      tags: { connect: tagRecords },
    },
    include: { tags: true },
  });

  return NextResponse.json(post, { status: 201 });
}
