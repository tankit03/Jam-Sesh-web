# **Jam Sesh** 

### ***Connecting local musicians, one jam at a time.***

## **Overview**

Jam Sesh is a web app designed to help musicians and artists connect, collaborate, and build their local music community. At its core, Jam Sesh functions like a forum-based social media platform—similar to Reddit—with a strong focus on location-based discovery.

Whether you're looking to join a band, find new collaborators, promote a house show, or connect with local venues, Jam Sesh gives users a way to plug into the "underground" music scene and make it more accessible. Inspired by apps like YikYak, posts are organized by location so users can find opportunities and fellow artists right in their town.

Instead of taping flyers around the city, users can quickly share what they're looking for—like a bassist, a drummer, or a live sound engineer—through posts visible to others nearby.

The goal is to foster collaboration, discovery, and connection among musicians who are often right down the street from each other but don't have a digital space to meet.

## **Problem Statement**

The local music scene can be difficult to navigate without personal connections. House shows, underground venues, and independent artists often rely on word-of-mouth or scattered posts across various social media platforms, making it hard for newcomers or outsiders to engage. Finding bandmates is still a largely analog process, with musicians taping flyers on lamp posts or relying solely on their immediate network.

Despite the vibrancy and energy of local music communities, there is no centralized digital platform dedicated to discovering local music, sharing events, or connecting with other musicians in a location-based, social setting. This leaves a gap for artists who want to collaborate, promote their work, or simply plug into the local scene. Jam Sesh aims to fill that gap by creating a dedicated, streamlined space for musical connection at the community level.

## **Goals & Objectives**

* Connect people with their local music scene

* Create an engaging, easy-to-use platform for discovering local events and connecting musicians together

### **Core Features (MVP)**

* Users can create profiles with:

  * Profile picture

  * Bio

  * Instrument tags

  * History of posts

* Users can make posts that:

  * Are categorized or tagged (e.g., "Looking for Musicians," "Show," "Share")

  * Include a title and body text

  * Can optionally embed audio or video files

* Posts appear in a forum-style feed organized by location, similar to Reddit/YikYakStretch Goals / Future Features

### **Stretch Goals / Future Features**

* **Group Profiles:** Bands and venues can create shared profiles with linked individual accounts (e.g., like Instagram collabs or shared posting permissions)

* **Interactive Poster Board:** A diegetic-style visual board where users can "post flyers" for shows or events (digital representation of real-life show posters)

* **Music Integration:** Ability to embed or link SoundCloud, Spotify, Apple Music tracks, or user-created playlists to showcase original work or favoritesTarget Users

* **My Music Taste:** Possible feature where you can feed the app your favorite albums, artists and songs to better understand what genres make up your favorite music.

## **Tech Stack**

The tech stack for Jam Sesh is designed to provide a seamless mobile experience, with a focus on creating an engaging demo for the Engineering Expo while maintaining scalability for future growth. Our stack leverages AWS services for robust backend functionality and Expo for streamlined mobile development:

**Frontend/Mobile Development:**

* **Expo:** We're using Expo (built on React Native) as our primary development framework. This choice offers several advantages:
  * Rapid development and iteration
  * Expo Go app for easy demo distribution at the Engineering Expo
  * Built-in support for essential features (location services, media handling)
  * Cross-platform compatibility for future expansion

**Backend / AWS Services:**

* **AWS Amplify:** Our primary backend infrastructure manager, providing seamless integration with various AWS services:
  * **Cognito:** User authentication and authorization
  * **DynamoDB:** NoSQL database for user data, posts, and interactions
  * **S3:** Storage for media files (images, audio)
  * **AppSync:** GraphQL API management and real-time data synchronization
  * **Lambda:** Serverless functions for backend logic
  * **Location Service:** Handling location-based features and geoqueries

**Real-time Features:**

* **AWS AppSync + GraphQL:** For managing real-time updates and social feed functionality:
  * Real-time post updates
  * Location-based content delivery
  * User interactions and notifications

**Development & Deployment:**

* **Expo EAS (Expo Application Services):** For building and deploying the mobile application
* **AWS CloudFormation:** (via Amplify) For infrastructure as code
* **GitHub Actions:** CI/CD pipeline integration

The tech stack is optimized for:
* Quick iteration during development
* Smooth demo experience at the Engineering Expo
* Scalability for future feature additions
* Robust backend services through AWS
* Efficient real-time updates and location-based features

## **Screens & User Flow**

To visualize the user journey through Jam Sesh, we've created a prototype in **Figma** that outlines the key screens and the overall user flow. This will help inform the design process and clarify the intended interaction patterns. The user flow includes steps from signing up, creating a profile, posting content, and discovering local music scenes.

The **interactive prototype**  is available here: \[Figma Link\] (we will keep this updated as we iterate).

### **Key Screens:**

1\. **Home Feed** : A stream of posts categorized by location, where users can find musicians, venues, and local events.

2\. **Profile Page** : Customizable user profiles where musicians, artists, and venues can showcase their content, including posts, media, and bio.

3\. **Post Creation** : A page where users can create posts, select categories (musician search, event promotion, media sharing), and include multimedia (audio, video, etc.).

4\. **Search/Filter** : A search function to find musicians, bands, events, or venues by location, genre, or type.

5\. **Notifications** : A simple notification system for alerts on interactions like messages, comments, or new posts in relevant areas.

## **Timeline**

The project timeline for Jam Sesh outlines the key milestones and deadlines leading up to the final presentation at the Engineering Expo in June. Our primary focus is rapid development and iterative progress, with key deliverables and deadlines set throughout the spring term. The timeline will be regularly reviewed and adjusted as necessary to ensure we meet our goals.

You can view the full timeline with detailed tasks and deadlines here: \[[Timeline Link](https://docs.google.com/document/u/0/d/1FMYWP9jIMhliUSfyIjzjlxCeZ1xzN-lg_ZhvrtTFVB4/edit)\].

## **Team Roles**

Matias Tupper

Tanish Hupare

## **Design Vision**

Jam Sesh should feel like stepping into a DIY venue flyer wall or the back room of your favorite local record store — full of creative energy, community spirit, and underground charm. The design will strike a balance between sleek modern social media polish, raw zine culture aesthetics, and a splash of early-internet nostalgia à la MySpace.

### **Tone & Aesthetic**

The visual vibe will be bold and expressive while staying intuitive and navigable. Think zine culture meets a streamlined Reddit with a hint of the chaotic creativity of early MySpace. Muted neons, textured blacks, and warm grunge tones might dominate the palette. Fonts will be punchy but legible, with optional flair where appropriate.

### **User Experience (UX) Goals**

The platform should be engaging but simple — users should feel comfortable whether they're casually browsing or deeply customizing their presence. The UX should flow like a modern social media app but with room for individual artistic expression.

### **The Website as a Blank Slate**

A core part of the vision is to let *users define the aesthetic* of Jam Sesh. The platform itself will offer a clean, minimal foundation — a blank slate — where musicians, artists, and venues can build out their identities. From the look and feel of profile pages to the design of individual posts, users should be able to make their corner of the site reflect their style, sound, and vibe.

### **Profile & Post Customization**

Inspired by MySpace, Jam Sesh aims to give users the ability to deeply personalize their profiles — picking colors, backgrounds, header images, and even styling audio or media embeds. Posts should also allow expressive formatting, embedded content, and maybe even themed post templates in the future. The result: no two profiles or posts should look exactly alike.

### **Design Inspiration**

- **YikYak** — location-based, community-centered feed

- **Reddit** — structured discussion, categorized posts

- **Bandcamp** — clean indie-focused presentation

- **MySpace** — nostalgic and customizable user spaces

### **Color Scheme**

Our primary color is a bold purple: **#3d00b6**. This will be used as the go-to accent and brand color throughout the app. The overall palette will still feature muted neons, textured blacks, and warm grunge tones, but #3d00b6 serves as the core of our visual identity.

Our secondary color is a deep, grayish purple: **#1a1333**. This color is primarily used for backgrounds and empty space, providing a dark, subtle foundation that allows the primary purple and other accent colors to stand out. #1a1333 was chosen for its strong contrast, muted character, and ability to evoke the "textured blacks" and underground vibe described in our design vision.

#### **Jam Sesh UI Color Palette**

| Purpose         | Color Name      | Hex      | Description                                      |
|-----------------|----------------|----------|--------------------------------------------------|
| Primary         | Purple          | #3d00b6  | Main accent and brand color                      |
| Secondary       | Dark Purple     | #1a1333  | Backgrounds, empty space                         |
| Accent 1        | Electric Teal   | #00ffd0  | CTAs, highlights, energetic accents              |
| Accent 2        | Neon Pink       | #ff3ec8  | Playful highlights, buttons, or links            |
| Accent 3        | Warm Gold       | #ffd600  | Notifications, warnings, warm highlights         |
| Accent 4        | Sky Blue        | #3ecfff  | Info, secondary actions, cool contrast           |
| Neutral 1       | Off-White       | #f5f5fa  | Text, cards, surfaces on dark backgrounds        |
| Neutral 2       | Muted Gray      | #b3b3c6  | Secondary text, dividers, subtle UI elements     |

**Usage Notes:**
- Accent colors are for buttons, links, highlights, and notifications.
- Neutrals are for backgrounds, cards, and text to maintain readability.
- Always check color contrast for accessibility, especially for text on colored backgrounds.

### **Accessibility Considerations**

- Strong contrast and readable typography

- Optional dark mode

- Easy navigation, keyboard-friendly UI

### **Responsive Design**

Jam Sesh will be a mobile-first application, optimized for iOS and Android devices through Expo. While web accessibility may be considered for future development, our primary focus is on delivering a polished, native mobile experience that showcases the platform's core features at the Engineering Expo. The Expo Go app will facilitate easy testing and demonstration of the application during the expo.

