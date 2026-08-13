"use client";

import { useState } from "react";
import type { CreateTodoReq } from "@/types/todo";

interface TodoFormProps {
  onCreate: (req: CreateTodoReq) => Promise<void>;
}

// Limits come from the [StringLength] attributes on CreateTodoReq.
const TITLE_MAX = 100;
const DESCRIPTION_MAX = 500;

export default function TodoForm({ onCreate }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const trimmedTitle = title.trim();
  const canSubmit = trimmedTitle.length > 0 && !submitting;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    try {
      await onCreate({
        title: trimmedTitle,
        description: description.trim() || null,
      });
      // Only clear once the create actually succeeded.
      setTitle("");
      setDescription("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={TITLE_MAX}
        placeholder="What needs doing?"
        aria-label="Todo title"
        className="w-full rounded-lg border border-black/[.08] bg-transparent px-3 py-2 text-base outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-white/[.145]"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        maxLength={DESCRIPTION_MAX}
        rows={2}
        placeholder="Notes (optional)"
        aria-label="Todo description"
        className="w-full resize-y rounded-lg border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-500 dark:border-white/[.145]"
      />

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-zinc-500">
          {trimmedTitle.length}/{TITLE_MAX}
        </span>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Adding…" : "Add todo"}
        </button>
      </div>
    </form>
  );
}
