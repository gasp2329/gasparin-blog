"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  PenLine,
  Eye,
  EyeOff,
  Trash2,
  FileText,
  Users,
} from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  type: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  tags: { name: string }[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchPosts();
      fetchSubscribers();
    }
  }, [status]);

  const fetchPosts = async () => {
    const res = await fetch("/api/admin/posts");
    if (res.ok) {
      const data = await res.json();
      setPosts(data);
    }
    setLoading(false);
  };

  const fetchSubscribers = async () => {
    try {
      const res = await fetch("/api/admin/subscribers");
      if (res.ok) {
        const data = await res.json();
        setSubscriberCount(data.count || 0);
      }
    } catch {
      // Subscriber endpoint may not exist yet
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const togglePublish = async (post: Post) => {
    const res = await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !post.published }),
    });
    if (res.ok) {
      setPosts(
        posts.map((p) =>
          p.id === post.id ? { ...p, published: !p.published } : p
        )
      );
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-muted">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  const published = posts.filter((p) => p.published);
  const drafts = posts.filter((p) => !p.published);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          <PenLine size={16} />
          New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <FileText size={16} />
            <span className="text-sm">Published</span>
          </div>
          <p className="text-2xl font-bold">{published.length}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <EyeOff size={16} />
            <span className="text-sm">Drafts</span>
          </div>
          <p className="text-2xl font-bold">{drafts.length}</p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Users size={16} />
            <span className="text-sm">Subscribers</span>
          </div>
          <p className="text-2xl font-bold">{subscriberCount}</p>
        </div>
      </div>

      {/* Posts table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <h2 className="font-semibold">All Posts</h2>
        </div>

        {posts.length === 0 ? (
          <div className="px-4 py-12 text-center text-muted">
            <p>No posts yet. Write your first one!</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between px-4 py-3 hover:bg-surface-hover transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="font-medium text-foreground hover:text-accent transition-colors truncate"
                    >
                      {post.title}
                    </Link>
                    {post.published ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
                        Published
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                        Draft
                      </span>
                    )}
                    {post.type === "short" && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                        Short
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    Updated {format(new Date(post.updatedAt), "MMM d, yyyy")}
                    {post.tags.length > 0 &&
                      ` · ${post.tags.map((t) => t.name).join(", ")}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => togglePublish(post)}
                    title={post.published ? "Unpublish" : "Publish"}
                    className="p-1.5 text-muted hover:text-foreground transition-colors"
                  >
                    {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <Link
                    href={`/admin/posts/${post.id}/edit`}
                    className="p-1.5 text-muted hover:text-foreground transition-colors"
                    title="Edit"
                  >
                    <PenLine size={16} />
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="p-1.5 text-muted hover:text-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
