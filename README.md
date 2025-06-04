# JamSesh

**Connecting local musicians, one jam at a time.**

---

## Project Overview & Purpose

JamSesh is a web app designed to help musicians and artists connect, collaborate, and build their local music community. At its core, JamSesh functions like a forum-based social media platform—similar to Reddit—with a strong focus on location-based discovery.

Whether you're looking to join a band, find new collaborators, promote a house show, or connect with local venues, JamSesh gives users a way to plug into the "underground" music scene and make it more accessible. Inspired by apps like YikYak, posts are organized by location so users can find opportunities and fellow artists right in their town.

The goal is to foster collaboration, discovery, and connection among musicians who are often right down the street from each other but don't have a digital space to meet.

---

## Features
- User profiles with avatar, bio, and instrument tags
- Forum-style posts with categories (e.g., "Looking for Musicians", "Show Announcement")
- Location-based feed
- Media embedding (images, audio/video links)

---

## Tech Stack
- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Supabase (Postgres DB, Auth, Storage)
- **Deployment:** Vercel (recommended)

---

## Setup Instructions

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Supabase project (see below)

### 2. Clone the Repository
```bash
git clone <your-repo-url>
cd Jam-Sesh-web
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory with the following:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```
You can find these in your [Supabase project settings](https://app.supabase.com/).

### 5. Run the Development Server
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment Procedures

### Deploying to Vercel (Recommended)
1. Push your code to GitHub (or similar).
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. Set the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel dashboard.
4. Click "Deploy".

### Manual/Other Hosting
- Build the app: `npm run build`
- Start the app: `npm start`
- Ensure environment variables are set in your hosting environment.

---

## Maintenance Guidelines
- **Dependencies:** Regularly update npm packages (`npm outdated` / `npm update`).
- **Supabase:** Monitor your Supabase project for usage limits and security updates.
- **Environment Variables:** Never commit secrets or private keys to the repo.
- **Database:** Use Supabase dashboard for schema changes. Back up data before making major changes.
- **Testing:** Test new features locally before deploying.

---

## Troubleshooting

### Common Issues
- **Supabase connection errors:**
  - Double-check your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
  - Ensure your Supabase project is running and not restricted by RLS (Row Level Security) policies for development.
- **Build errors:**
  - Make sure all dependencies are installed and compatible with your Node.js version.
- **Styling issues:**
  - If Tailwind styles are missing, try restarting the dev server and ensure `tailwind.config.ts` is present.
- **Auth issues:**
  - Check Supabase Auth settings (email sign-in enabled, etc.).

### Getting Help
- Check the [Next.js docs](https://nextjs.org/docs)
- Check the [Supabase docs](https://supabase.com/docs)
- Check the [Tailwind CSS docs](https://tailwindcss.com/docs)

---

