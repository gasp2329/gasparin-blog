import Link from "next/link";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { readingTime, stripHtml } from "@/lib/utils";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    type: string;
    publishedAt: string | null;
    tags: { id: string; name: string; slug: string }[];
  };
}

export default function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt ? format(new Date(post.publishedAt), "MMMM d, yyyy") : "";
  const time = readingTime(post.content);
  const excerpt = post.excerpt || stripHtml(post.content).slice(0, 200) + "...";

  return (
    <article className="group py-8 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 text-sm text-muted mb-2">
        {date && <time dateTime={post.publishedAt || ""}>{date}</time>}
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {time}
        </span>
        {post.type === "short" && (
          <span className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full font-medium">
            Quick take
          </span>
        )}
      </div>

      <Link href={`/posts/${post.slug}`} className="block">
        <h2 className="text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors mb-2">
          {post.title}
        </h2>
        <p className="text-muted leading-relaxed font-serif">{excerpt}</p>
      </Link>

      {post.tags.length > 0 && (
        <div className="flex gap-2 mt-3">
          {post.tags.map((tag) => (
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
    </article>
  );
}
