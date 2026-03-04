"use client";

import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Editor from "@/components/Editor";
import { Save, Eye, EyeOff, ArrowLeft, Tag, X, Trash2 } from "lucide-react";
import Link from "next/link";

export default function EditPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [type, setType] = useState<"article" | "short">("article");
  const [published, setPublished] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const loadPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (res.ok) {
        const post = await res.json();
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || "");
        setType(post.type);
        setPublished(post.published);
        setTags(post.tags?.map((t: { name: string }) => t.name) || []);
      } else {
        setError("Post not found");
      }
    } catch {
      setError("Failed to load post");
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    if (session && postId) loadPost();
  }, [session, postId, loadPost]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  };

  const savePost = async (publish?: boolean) => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");

    const shouldPublish = publish !== undefined ? publish : published;

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content,
          excerpt: excerpt.trim() || undefined,
          published: shouldPublish,
          type,
          tags,
        }),
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save post");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deletePost = async () => {
    if (!confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin");
      } else {
        setError("Failed to delete post");
      }
    } catch {
      setError("Network error");
    } finally {
      setDeleting(false);
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

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={deletePost}
            disabled={deleting}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={() => savePost()}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-60"
          >
            <Save size={16} />
            Save
          </button>
          {published ? (
            <button
              onClick={() => savePost(false)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors disabled:opacity-60"
            >
              <EyeOff size={16} />
              Unpublish
            </button>
          ) : (
            <button
              onClick={() => savePost(true)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-60"
            >
              <Eye size={16} />
              Publish
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      {/* Post type selector */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setType("article")}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            type === "article"
              ? "bg-foreground text-background font-medium"
              : "border border-border text-muted hover:text-foreground"
          }`}
        >
          Article
        </button>
        <button
          onClick={() => setType("short")}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            type === "short"
              ? "bg-foreground text-background font-medium"
              : "border border-border text-muted hover:text-foreground"
          }`}
        >
          Quick Take
        </button>
      </div>

      {/* Title */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title..."
        className="w-full text-3xl font-bold tracking-tight bg-transparent border-none outline-none placeholder:text-muted/50 mb-2"
      />

      {/* Excerpt */}
      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Short excerpt (optional — auto-generated from content if empty)"
        rows={2}
        className="w-full text-sm text-muted bg-transparent border-none outline-none resize-none placeholder:text-muted/50 mb-6"
      />

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <Tag size={16} className="text-muted" />
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-accent/10 text-accent rounded-full"
          >
            {tag}
            <button onClick={() => removeTag(tag)} className="hover:text-accent-hover">
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
          placeholder="Add tags..."
          className="text-sm bg-transparent border-none outline-none placeholder:text-muted/50"
        />
      </div>

      {/* Editor */}
      {content !== "" && <Editor content={content} onChange={setContent} />}
      {content === "" && !loading && <Editor content="" onChange={setContent} />}
    </div>
  );
}
