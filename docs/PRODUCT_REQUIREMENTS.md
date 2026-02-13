# Product Requirements (MVP)

## 1. Functional Requirements

### FR-1 Authentication and Authorization
- Users can register and login using email/password.
- System issues JWT access token after login.
- Roles supported: `user`, `admin`.
- Protected actions require valid JWT.

### FR-2 Video Browsing and Watching
- Anyone can fetch paginated video list.
- Anyone can open a single video detail page.
- Video detail includes:
  - Playback URL (Cloudinary stream URL)
  - Metadata (title, description, category, views, created date)
  - Text sections
  - Like count and comment count

### FR-3 Likes
- Authenticated users can like a video once.
- Authenticated users can remove their like.
- API returns current like count and whether current user liked.

### FR-4 Comments
- Authenticated users can add comment.
- Authenticated users can edit/delete their own comment.
- Admin can delete any comment.
- Anyone can read comments with pagination.

### FR-5 Share
- Authenticated users can trigger a share action endpoint.
- System stores share event for analytics.
- API returns shareable link.

### FR-6 Download
- Only authenticated users can download video.
- Download can be direct Cloudinary URL or backend-signed URL.
- System optionally logs download events.

### FR-7 Video Text Sections
- Each video supports 1..N text sections.
- Text sections are ordered.
- Each section has heading (optional) and body.

### FR-8 Category Management
- Admin can create/update/delete Shayeri categories.
- Video must reference one category.

### FR-9 Video Management (Admin)
- Admin can upload video and thumbnail (Cloudinary).
- Admin can create/update/delete video metadata.
- Admin can manage video text sections during create/update.
- Soft delete preferred to avoid data loss.

### FR-10 Notifications
- Authenticated users receive a notification when:
  - Admin uploads a new video.
  - Admin edits an existing video.
- Notifications are created by the backend and delivered to users.

## 2. Non-Functional Requirements
- API response time target:
  - p95 < 300ms for non-media endpoints under normal load.
- Security:
  - Password hashing (`bcrypt`/`argon2`).
  - JWT expiration and secure secret handling.
  - Input validation on all write endpoints.
- Reliability:
  - Cloudinary upload failure handling with safe rollback behavior.
- Maintainability:
  - Clear module boundaries (`auth`, `videos`, `comments`, `categories`).
- Observability:
  - Request logging and error logging.

## 3. Acceptance Criteria (MVP Exit)
- Guest can view and play published videos.
- Logged-in user can like, comment, share, and download.
- Admin can CRUD videos, categories, and moderate comments.
- Video has text sections visible on detail endpoint.
- Swagger docs include all MVP endpoints.
