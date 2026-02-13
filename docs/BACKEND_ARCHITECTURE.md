# Backend Architecture

## 1. Tech Stack
- Runtime: Node.js + TypeScript
- API: Express
- DB: PostgreSQL
- ORM: Prisma
- Auth: JWT + bcrypt
- Media hosting: Cloudinary
- Docs: Swagger/OpenAPI

## 2. Module Boundaries
- `auth`:
  - register, login, token validation
- `users`:
  - profile and admin user operations
- `categories`:
  - admin CRUD, public list
- `videos`:
  - public browse/view + admin CRUD
  - upload integration with Cloudinary
  - text sections management
- `interactions`:
  - likes, comments, shares, downloads
- `notifications`:
  - create notifications on admin video create/update
  - list and mark notifications read for users

## 3. Access Control Model
- Public routes: video list/detail, category list, comment list.
- Auth-only routes: like/unlike, comment create/update/delete own, share, download.
- Admin-only routes: video/category CRUD, comment moderation.
- Auth-only routes: notification list and mark read.

## 4. Cloudinary Integration
- Upload flow (admin):
  1. Admin uploads file to backend.
  2. Backend uploads to Cloudinary using server credentials.
  3. Cloudinary returns `public_id`, secure URL, duration/metadata.
  4. Backend saves media metadata in DB.
- Delete flow:
  - On video delete, optionally call Cloudinary destroy by `public_id`.
- Delivery:
  - Use Cloudinary secure URL in playback and thumbnail responses.

## 5. Request Lifecycle (Write Endpoints)
1. Validate JWT and role (if needed).
2. Validate request body/query/path.
3. Execute service logic in transaction when needed.
4. Return normalized response.
5. Log event/error.

## 6. Security Baseline
- Hash passwords before storing.
- Store secrets in env variables.
- Add rate limiting on auth and comment endpoints.
- Sanitize text fields to reduce XSS risk.
- Enforce max upload size and allowed MIME types.

## 7. Suggested Folder Expansion
- `src/modules/videos/*`
- `src/modules/comments/*`
- `src/modules/categories/*`
- `src/modules/interactions/*`
- Keep current shared middleware/util pattern.
