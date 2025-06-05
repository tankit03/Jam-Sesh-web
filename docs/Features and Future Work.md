# Features and Future Work

---

## Features Implemented
- User authentication (sign up, login, logout) via Supabase Auth
- User profiles with:
  - Profile picture (avatar upload)
  - Bio/about section
  - Instrument tags
  - Post history
- Forum-style posts with:
  - Title and rich text body (TipTap editor)
  - Categories (e.g., "Looking for Musicians", "Show", "Share")
  - Location tagging
  - Media embedding (images, audio/video links)
  - Map-based event pinning and event map view
  - Rich text editor (TipTap) for posts
  - Modal-driven event creation and editing
- Location-based feed (posts organized by city/region)
- Editable and persistent profile page
- 3-dots menu on posts for edit/delete (with confirmation modal)
- Responsive, mobile-friendly design
- Default avatar fallback
- Row Level Security (RLS) on all database tables
- Dynamic imports to fix hydration issues (e.g., react-select)
- Logging and error handling for post actions

---

## Known Issues & Limitations
- No automated testing (manual/local testing only)
- No production deployment (prototype only)
- No notifications or real-time updates
- No direct messaging or comments on posts
- No group/band/venue profiles (individual only)
- Limited search/filter functionality
- No music/audio file uploads (only links/embeds)
- Some UI/UX polish and accessibility improvements still needed
- Documentation may become outdated as the project evolves

---

## Future Work / Stretch Goals
- **Group Profiles:** Bands and venues can create shared profiles with linked individual accounts (e.g., like Instagram collabs or shared posting permissions)
- **Interactive Poster Board:** A diegetic-style visual board where users can "post flyers" for shows or events (digital representation of real-life show posters)
- **Music Integration:** Ability to embed or link SoundCloud, Spotify, Apple Music tracks, or user-created playlists to showcase original work or favorites
- **My Music Taste:** Feature where users can input favorite albums, artists, and songs to personalize their experience
- **Direct Messaging:** Allow users to message each other directly
- **Comments & Reactions:** Enable comments and reactions on posts
- **Advanced Search/Filter:** Search by genre, instrument, or event type
- **Push Notifications:** For new posts, replies, or messages
- **Native Mobile App:** Extend JamSesh to iOS/Android using React Native or Expo
- **Production Deployment:** Deploy to Vercel or similar platform for public access 