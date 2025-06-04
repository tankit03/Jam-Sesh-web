# JamSesh Technical Documentation

---

## 1. Codebase Overview & Structure

JamSesh is a web application built with Next.js (React), TypeScript, Tailwind CSS, and Supabase. The codebase is organized for clarity and rapid prototyping.

**Key Directories:**
- `src/app/` — Next.js app directory (routes, pages, API handlers)
- `src/components/` — Reusable React components (forms, modals, feed, etc.)
- `src/lib/` — Utility functions, Supabase client, helpers
- `public/` — Static assets (images, favicon, etc.)
- `docs/` — Project documentation

**Entry Point:**
- `src/app/page.tsx` — Main landing page (feed)

---

## 2. How to Add Features or Make Changes

- **Add a new page:** Create a new file in `src/app/` (e.g., `src/app/new-page/page.tsx`).
- **Add a new component:** Place it in `src/components/` and import where needed.
- **State management:** Most state is local or lifted to parent components. No global state library is used.
- **Styling:** Use Tailwind CSS utility classes. Custom styles can go in `globals.css`.
- **Supabase:** Use the `supabase` client from `src/lib/supabaseClient.ts` for all DB/auth/storage operations.
- **Testing:** Manual/local testing is recommended. No automated test suite is included (prototype).

---

## 3. API Usage (Supabase)

JamSesh uses Supabase for all backend functionality:
- **Auth:** Email/password sign up and login
- **Database:** Postgres tables for users, profiles, posts, etc.
- **Storage:** For user avatars and media

**No custom REST endpoints** are defined; all data access is via Supabase client SDK.

**Example (fetch posts):**
```ts
const { data, error } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false });
```

**RLS (Row Level Security):** Enabled for all tables. Policies allow users to read public data and modify their own records.

---

## 4. Database Schema & Data Dictionary

**Main Tables:**

### `profiles`
| Column       | Type      | Description                       |
|--------------|-----------|-----------------------------------|
| id           | uuid      | Primary key (matches auth user id) |
| username     | text      | Unique display name                |
| bio          | text      | User bio/about section             |
| avatar_url   | text      | Path to avatar in Supabase Storage |
| instruments  | text[]    | Array of instrument tags           |
| created_at   | timestamp | Profile creation date              |

### `posts`
| Column       | Type      | Description                       |
|--------------|-----------|-----------------------------------|
| id           | uuid      | Primary key                       |
| user_id      | uuid      | Foreign key to profiles.id         |
| title        | text      | Post title                        |
| body         | text      | Post content (rich text HTML)      |
| category     | text      | Post category (e.g., 'Show', 'Looking for Musicians') |
| location     | text      | City or region                    |
| created_at   | timestamp | Post creation date                 |

### `media` (if used)
| Column       | Type      | Description                       |
|--------------|-----------|-----------------------------------|
| id           | uuid      | Primary key                       |
| post_id      | uuid      | Foreign key to posts.id            |
| url          | text      | Media file URL (Supabase Storage)  |
| type         | text      | 'image', 'audio', 'video', etc.    |

---

## 5. Architecture & Diagrams

**Architecture Overview:**
- **Frontend:** Next.js app (React, TypeScript, Tailwind CSS)
- **Backend:** Supabase (Postgres DB, Auth, Storage)
- **Deployment:** Vercel (recommended)

**Data Flow:**
1. User interacts with the Next.js frontend
2. Frontend uses Supabase client SDK to read/write data
3. Supabase handles auth, database, and storage
4. All data is secured with RLS policies

**Diagram:**
```
[User] ⇄ [Next.js Frontend] ⇄ [Supabase (Auth, DB, Storage)]
```

---

## 6. Known Issues & Future Work
- No automated tests (manual testing only)
- No production deployment (prototype only)
- Some features (group profiles, interactive poster board, music integration) are stretch goals
- UI/UX polish and accessibility improvements are ongoing

---

## 7. Contact & Further Resources
- See README.md for setup, deployment, and troubleshooting