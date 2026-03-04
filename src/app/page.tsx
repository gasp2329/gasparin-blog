import { prisma } from "@/lib/prisma";
import PostCard from "@/components/PostCard";
import SubscribeForm from "@/components/SubscribeForm";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const tag = params.tag;
  const page = parseInt(params.page || "1");
  const limit = 10;

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

  const pages = Math.ceil(total / limit);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {tag && (
        <div className="mb-8">
          <p className="text-sm text-muted">
            Filtered by tag: <span className="font-medium text-foreground">{tag}</span>
            {" · "}
            <a href="/" className="text-accent hover:underline">Clear</a>
          </p>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl font-bold text-foreground mb-2">No posts yet</p>
          <p className="text-muted">Check back soon — something&apos;s coming.</p>
        </div>
      ) : (
        <div>
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                publishedAt: post.publishedAt?.toISOString() ?? null,
              }}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center gap-4 mt-8">
          {page > 1 && (
            <a
              href={`/?page=${page - 1}${tag ? `&tag=${tag}` : ""}`}
              className="text-sm text-accent hover:underline"
            >
              ← Newer
            </a>
          )}
          <span className="text-sm text-muted">
            Page {page} of {pages}
          </span>
          {page < pages && (
            <a
              href={`/?page=${page + 1}${tag ? `&tag=${tag}` : ""}`}
              className="text-sm text-accent hover:underline"
            >
              Older →
            </a>
          )}
        </div>
      )}

      {/* Subscribe section */}
      <div className="mt-12">
        <SubscribeForm />
      </div>
    </div>
  );
}
