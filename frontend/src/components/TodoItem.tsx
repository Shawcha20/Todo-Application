"use client";

import { useState } from "react";
import type { Todo, UpdateTodoReq } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void>;
  onUpdate: (id: string, req: UpdateTodoReq) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 500;

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    try {
      await onToggle(todo);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await onDelete(todo.id);
    } finally {
      setBusy(false);
    }
  }

  function startEdit() {
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setEditing(true);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setBusy(true);
    try {
      await onUpdate(todo.id, {
        title: trimmedTitle,
        description: description.trim() || null,
        isCompleted: todo.isCompleted,
      });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  if (editing) {
    return (
      <form
        onSubmit={handleSave}
        className="flex flex-col gap-2 rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950"
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={TITLE_MAX}
          aria-label="Edit todo title"
          autoFocus
          className="w-full rounded-lg border border-black/[.08] bg-transparent px-3 py-2 text-base outline-none focus:border-zinc-500 dark:border-white/[.145]"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={DESCRIPTION_MAX}
          rows={2}
          aria-label="Edit todo description"
          className="w-full resize-y rounded-lg border border-black/[.08] bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-white/[.145]"
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setEditing(false)}
            disabled={busy}
            className="rounded-full px-4 py-1.5 text-sm font-medium text-zinc-600 transition-opacity disabled:opacity-40 dark:text-zinc-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !title.trim()}
            className="rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-start gap-3 rounded-xl border border-black/[.08] bg-white p-4 dark:border-white/[.145] dark:bg-zinc-950">
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={handleToggle}
        disabled={busy}
        aria-label={todo.isCompleted ? "Mark as not done" : "Mark as done"}
        className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-foreground"
      />

      <div className="min-w-0 flex-1">
        <p
          className={`break-words text-base ${
            todo.isCompleted ? "text-zinc-400 line-through dark:text-zinc-600" : ""
          }`}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="mt-1 break-words text-sm text-zinc-500 dark:text-zinc-400">
            {todo.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={startEdit}
          disabled={busy}
          aria-label="Edit todo"
          className="rounded-full px-3 py-1.5 text-sm text-zinc-500 transition-opacity hover:text-foreground disabled:opacity-40 dark:text-zinc-400"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={busy}
          aria-label="Delete todo"
          className="rounded-full px-3 py-1.5 text-sm text-red-500 transition-opacity hover:text-red-600 disabled:opacity-40"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
