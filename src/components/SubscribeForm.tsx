"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You're subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="bg-surface border border-border rounded-xl p-6 text-center">
        <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
        <p className="text-foreground font-medium">{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-2">
        <Mail size={20} className="text-accent" />
        <h3 className="font-semibold text-foreground">Subscribe</h3>
      </div>
      <p className="text-sm text-muted mb-4">Get new posts delivered to your inbox.</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && (
        <p className="text-sm text-red-600 mt-2">{message}</p>
      )}
    </div>
  );
}
