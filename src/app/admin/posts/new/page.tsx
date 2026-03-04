"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Editor from "@/components/Editor";
import { Save, Eye, ArrowLeft, Tag, X } from "lucide-react";
import Link from "next/link";

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [type, setType] = useState<"article" | "short">("article");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

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

  const savePost = async (publish: boolean) => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setError("Content is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content,
          excerpt: excerpt.trim() || undefined,
          published: publish,
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

  if (status === "loading") {
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
            onClick={() => savePost(false)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-surface-hover transition-colors disabled:opacity-60"
          >
            <Save size={16} />
            Save Draft
          </button>
          <button
            onClick={() => savePost(true)}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-60"
          >
            <Eye size={16} />
            Publish
          </button>
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
      <Editor content={content} onChange={setContent} />
    </div>
  );
}
