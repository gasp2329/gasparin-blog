import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Clock, ArrowLeft } from "lucide-react";
import { readingTime } from "@/lib/utils";
import Link from "next/link";
import SubscribeForm from "@/components/SubscribeForm";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export async function generateMetadata({

  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — The Gasparin Blog`,
    description: post.excerpt || undefined,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, image: true } },
      tags: true,
    },
  });

  if (!post || !post.published) notFound();

  const date = post.publishedAt
    ? format(new Date(post.publishedAt), "MMMM d, yyyy")
    : "";
  const time = readingTime(post.content);

  return (
    <article className="mx-auto max-w-3xl px-6 py-10">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={16} />
        Back to all posts
      </Link>

      {/* Header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-4">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-muted">
          <span>{post.author.name || "Author"}</span>
          <span>·</span>
          {date && <time dateTime={post.publishedAt?.toISOString()}>{date}</time>}
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {time}
          </span>
        </div>
        {post.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/?tag=${tag.slug}`}
                className="text-xs px-2 py-1 rounded-full border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Cover image */}
      {post.coverImage && (
        <div className="mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Subscribe */}
      <div className="mt-16">
        <SubscribeForm />
      </div>
    </article>
  );
}
