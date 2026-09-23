# NoteBase Client

Vue 3 + TypeScript + Tailwind CSS frontend for the NoteBase Notes app, talking to the `NoteBase.Api` backend (Dapper + SQL Server).

## Stack

- Vue 3 (`<script setup>`, Composition API)
- TypeScript
- Vite
- Tailwind CSS v4
- Pinia (state management)
- Vue Router (auth-guarded routes)
- Axios (HTTP client with automatic access-token refresh)

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if the API runs on a different host/port
npm run dev
```

The dev server runs on `http://localhost:5173` by default, which matches the `Cors:AllowedOrigins` entry in the backend's `appsettings.json`. Start `NoteBase.Api` first (`dotnet run` from `NoteBase.Api/`).

## Structure

```
src/
├── assets/        # static assets
├── components/    # reusable UI (BaseInput, BaseButton, NoteCard, modals, header)
├── composables/   # useDebouncedFn
├── router/        # routes + auth guard
├── services/      # axios instance, token storage, auth/note API calls
├── stores/        # Pinia stores (auth, notes)
├── types/         # TS interfaces matching the backend DTOs
├── views/         # LoginView, RegisterView, NotesView
├── App.vue
└── main.ts
```

## Notes

- Auth: register/login issue a JWT access + refresh token pair; the axios interceptor retries once on a 401 using the refresh token, then redirects to `/login` if that fails too.
- Notes list supports search (debounced), sort (created/updated/title, asc/desc), and pagination — all delegated to the backend's `GET /api/v1/notes` query params.
- A user only ever sees/edits/deletes their own notes — enforced server-side, not just hidden in the UI.
"# notebase-ui" 
