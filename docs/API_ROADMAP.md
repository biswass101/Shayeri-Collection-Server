# API Roadmap

## 1. Existing Endpoints (Already Present)
- `POST /api/auth/register`
- `POST /api/auth/login`
- User admin endpoints under `/api/users`

## 2. MVP Endpoints to Add

### Categories
- `GET /api/categories` (public)
- `POST /api/categories` (admin)
- `PUT /api/categories/:id` (admin)
- `DELETE /api/categories/:id` (admin)

### Videos
- `GET /api/videos` (public, pagination, category filter, search)
- `GET /api/videos/:id` (public)
- `POST /api/videos` (admin, upload/create)
- `PUT /api/videos/:id` (admin)
- `DELETE /api/videos/:id` (admin)

### Video Text Sections
- Managed within create/update video payload for MVP.
- Optional explicit endpoints later:
  - `POST /api/videos/:id/text-sections` (admin)
  - `PUT /api/videos/:id/text-sections/:sectionId` (admin)
  - `DELETE /api/videos/:id/text-sections/:sectionId` (admin)

### Likes
- `POST /api/videos/:id/likes` (auth user)
- `DELETE /api/videos/:id/likes` (auth user)

### Comments
- `GET /api/videos/:id/comments` (public)
- `POST /api/videos/:id/comments` (auth user)
- `PUT /api/comments/:id` (owner/admin)
- `DELETE /api/comments/:id` (owner/admin)

### Share
- `POST /api/videos/:id/share` (auth user)

### Download
- `GET /api/videos/:id/download` (auth user)

### Notifications
- `GET /api/notifications` (auth user, list)
- `PUT /api/notifications/:id/read` (auth user)

## 3. Suggested Implementation Order
1. Category CRUD
2. Video CRUD + Cloudinary upload
3. Video public listing/detail + text sections
4. Likes
5. Comments
 6. Share/download endpoints
 7. Notifications
 8. Swagger updates and endpoint examples
