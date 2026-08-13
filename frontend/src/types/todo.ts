// Mirrors backend/Models/todo.cs as it comes over the wire.
// ID is a Mongo ObjectId serialized to a 24-char hex string by ObjectIdJsonConverter.
export interface Todo {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
  createdAt: string;
}

// Mirrors backend/Models/CreateTodoReq.cs
export interface CreateTodoReq {
  title: string;
  description?: string | null;
}

// Mirrors backend/Models/UpdateTodo.cs — note the backend requires the full
// object on PUT, so a toggle has to resend title and description too.
export interface UpdateTodoReq {
  title: string;
  description?: string | null;
  isCompleted: boolean;
}
