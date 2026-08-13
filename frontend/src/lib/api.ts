import type { CreateTodoReq, Todo, UpdateTodoReq } from "@/types/todo";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5262";

const TODOS_URL = `${BASE_URL}/api/todo`;

/** Error carrying the HTTP status so the UI can tell 404 apart from 500. */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Unwraps a fetch Response, turning any non-2xx into an ApiError.
 * The backend replies with a ProblemDetails JSON body (GlobalExceptionHandler)
 * on failures, and with a bare string on the BadRequest branches, so we try
 * JSON first and fall back to plain text.
 */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;

    const body = await res.text();
    if (body) {
      try {
        const problem = JSON.parse(body) as { title?: string; detail?: string };
        message = problem.detail ?? problem.title ?? body;
      } catch {
        message = body;
      }
    }

    throw new ApiError(message, res.status);
  }

  // 204 has no body; every endpoint here returns one, but stay safe.
  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

/** Wraps fetch so a dead backend surfaces as an ApiError, not a raw TypeError. */
async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response;

  try {
    res = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(
      `Could not reach the API at ${BASE_URL}. Is the backend running?`,
      0,
    );
  }

  return handleResponse<T>(res);
}

export function getTodos(): Promise<Todo[]> {
  return request<Todo[]>(TODOS_URL);
}

export function getTodo(id: string): Promise<Todo> {
  return request<Todo>(`${TODOS_URL}/${id}`);
}

export function createTodo(req: CreateTodoReq): Promise<Todo> {
  return request<Todo>(TODOS_URL, {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export function updateTodo(id: string, req: UpdateTodoReq): Promise<Todo> {
  return request<Todo>(`${TODOS_URL}/${id}`, {
    method: "PUT",
    body: JSON.stringify(req),
  });
}

/** The backend returns the boolean `true` on a successful delete. */
export function deleteTodo(id: string): Promise<boolean> {
  return request<boolean>(`${TODOS_URL}/${id}`, {
    method: "DELETE",
  });
}
