# JamSesh Architecture

---

## System Overview

JamSesh is a modern web application designed for musicians to connect and collaborate. The architecture is simple, scalable, and leverages managed services to minimize backend complexity.

- **Frontend:** Built with Next.js (React), TypeScript, and Tailwind CSS. Handles all user interaction, routing, and UI rendering.
- **Backend:** Powered by Supabase, which provides authentication, a Postgres database, and file storage. All data operations are performed via the Supabase client SDK.
- **Deployment:** The frontend is intended for deployment on Vercel (or similar platforms).

## Architecture Diagram

Below is a visual representation of the JamSesh system architecture:

![JamSesh Architecture Diagram](docs/JamSesh_Architecture_Diagram.png)

## Data Flow

1. **User** interacts with the web app via their browser.
2. **Next.js Frontend** handles UI, routes, and calls Supabase for data, authentication, and storage.
3. **Supabase** manages:
   - **Auth:** User sign-up, login, and session management
   - **Database:** Storing user profiles, posts, etc.
   - **Storage:** Media files (avatars, images)
4. All data is protected by Row Level Security (RLS) policies in Supabase.

## Key Points
- No custom backend/server is required; all backend logic is managed by Supabase.
- The architecture is designed for rapid prototyping and easy scaling.
- The system is mobile-friendly and can be extended for native apps in the future. 