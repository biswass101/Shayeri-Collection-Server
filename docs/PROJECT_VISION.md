# Project Vision: Sayeri Collection

## 1. Product Summary
Sayeri Collection is a minimal video streaming platform focused only on Shayeri videos.

It is similar to YouTube in core interaction, but intentionally smaller:
- Public users can browse and watch videos.
- Authenticated users can like, comment, share, and download videos.
- Admin can fully manage videos, comments, and Shayeri categories.

## 2. Goals
- Build a clean, fast MVP with only essential features.
- Deliver a clear admin workflow for content moderation and publishing.
- Keep architecture simple and scalable for future features.

## 3. User Roles
- Guest (unauthenticated):
  - View video list and video detail.
  - Watch videos and read video text sections.
- Authenticated User:
  - All guest permissions.
  - Like/unlike videos.
  - Add/edit/delete own comments.
  - Trigger share action.
  - Download videos.
- Admin:
  - All authenticated user permissions.
  - Create/update/delete videos.
  - Create/update/delete categories.
  - Delete/moderate any comment.

## 4. Content Scope
- Content type: only Shayeri videos.
- Each video includes:
  - Media file (hosted on Cloudinary)
  - Thumbnail
  - Title, description
  - Category
  - One or more text sections

## 5. MVP Scope
- Authentication and role-based access (user/admin).
- Public video browsing and playback.
- Likes, comments, share tracking.
- Download for authenticated users.
- Notifications for authenticated users on admin video create/edit.
- Admin content management for videos/comments/categories.

## 6. Out of Scope (Initial Release)
- Creator dashboard for normal users.
- Subscriptions, playlists, notifications, live streaming.
- Ad monetization and recommendation algorithms.
- Multi-language moderation pipelines.
