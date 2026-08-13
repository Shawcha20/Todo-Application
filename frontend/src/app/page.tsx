"use client";

import { useEffect, useState } from "react";
import { ApiError, createTodo, deleteTodo, getTodos, updateTodo } from "@/lib/api";
import type { CreateTodoReq, Todo, UpdateTodoReq } from "@/types/todo";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    getTodos()
      .then((data) => {
        if (!cancelled) setTodos(data);
      })
      .catch((err) => {
        if (!cancelled) setError(describeError(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreate(req: CreateTodoReq) {
    setError(null);
    try {
      const created = await createTodo(req);
      setTodos((prev) => [created, ...prev]);
    } catch (err) {
      setError(describeError(err));
      throw err;
    }
  }

  async function handleToggle(todo: Todo) {
    setError(null);
    try {
      const updated = await updateTodo(todo.id, {
        title: todo.title,
        description: todo.description,
        isCompleted: !todo.isCompleted,
      });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      setError(describeError(err));
    }
  }

  async function handleUpdate(id: string, req: UpdateTodoReq) {
    setError(null);
    try {
      const updated = await updateTodo(id, req);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      setError(describeError(err));
      throw err;
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(describeError(err));
    }
  }

  const remaining = todos.filter((t) => !t.isCompleted).length;

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-xl flex-col gap-6 px-6 py-16">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Todos</h1>
          {!loading && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {remaining === 0 ? "All done" : `${remaining} remaining`}
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <TodoForm onCreate={handleCreate} />

        {loading ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Loading todos…</p>
        ) : (
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}

function describeError(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong.";
}
