# Todo Application

A full-stack todo app: an ASP.NET Core Web API backed by MongoDB, and a Next.js (TypeScript) frontend.

```
backend/    ASP.NET Core 9 Web API (MongoDB.Driver)
frontend/   Next.js 16 (App Router, TypeScript, Tailwind CSS)
```

## Live deployment

- Frontend: https://todo-application-one-virid.vercel.app (Vercel)
- Backend: https://todo-backend-5lap.onrender.com (Render, Docker)

## Architecture

- The backend exposes REST endpoints under `/api/todo` (`GET`, `POST`, `GET /{id}`, `PUT /{id}`, `DELETE /{id}`) backed by a MongoDB `Todos` collection.
- The frontend is a client-rendered Next.js app (`src/app/page.tsx`) that calls the backend directly via `fetch` from the browser — see `src/lib/api.ts`.
- CORS on the backend is restricted to an explicit allow-list (`AllowedOrigins`), and the frontend's API base URL is configured via `NEXT_PUBLIC_API_BASE_URL`, so the two can point at either local or deployed instances independently.

## Prerequisites

- [.NET SDK 9.0](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org)
- A MongoDB instance — either [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or a local `mongod`

## Running locally

### Backend

```bash
cd backend
dotnet user-secrets set "MongoDbSettings:ConnectionString" "<your-mongodb-connection-string>"
dotnet run --launch-profile http
```

The API listens on `http://localhost:5262` (see `Properties/launchSettings.json`). Swagger UI is available at `/swagger` in Development.

Never put the connection string in `appsettings.json` — use `dotnet user-secrets` locally, and an environment variable (`MongoDbSettings__ConnectionString`) in deployment.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:3000`. It reads the backend's base URL from `frontend/.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5262
```

## Configuration reference

| Variable | Where | Purpose |
|---|---|---|
| `MongoDbSettings__ConnectionString` | Backend env | MongoDB connection string |
| `AllowedOrigins` | Backend env | Comma-separated list of allowed CORS origins (e.g. the Vercel URL) |
| `PORT` | Backend env | Listen port; set automatically by Render |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend env | Base URL of the backend API, baked in at build time |

## Deployment notes

- **Backend (Render, Docker)** — `backend/Dockerfile` builds and runs the API. Config hot-reload is disabled (`DOTNET_hostBuilder__reloadConfigOnChange=false`) because Render's container restricts inotify instances, which otherwise crashes the default `appsettings.json` file watcher on startup. `render.yaml` at the repo root defines the service as a Blueprint.
- **Frontend (Vercel)** — deployed from the `frontend` directory (Root Directory setting). `NEXT_PUBLIC_*` variables are inlined at build time, so changing `NEXT_PUBLIC_API_BASE_URL` requires a new deployment, not just an env var save.
- Since `AllowedOrigins` and `NEXT_PUBLIC_API_BASE_URL` reference each other's deployed URLs, bring the backend up first, then deploy the frontend pointed at it, then update the backend's `AllowedOrigins` with the frontend's final URL.
