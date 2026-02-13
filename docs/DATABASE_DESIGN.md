# Database Design (Prisma Proposal)

## 1. Overview
Your current schema has `User` and `Post` models. For this product, replace `Post` with video-centric models.

## 2. Core Entities
- `User`: platform user with role.
- `Category`: Shayeri category managed by admin.
- `Video`: uploaded video metadata + Cloudinary IDs/URLs.
- `VideoTextSection`: ordered text blocks for each video.
- `VideoLike`: user-to-video like relation (unique by user+video).
- `Comment`: threaded comment body (single-level for MVP).
- `VideoShareEvent`: tracks share action.
- `VideoDownloadEvent`: tracks authenticated downloads.
- `Notification`: user notifications for video create/edit events.

## 3. Prisma Model Draft
```prisma
enum UserRole {
  user
  admin
}

model User {
  id             Int                 @id @default(autoincrement())
  email          String              @unique
  name           String?
  passwordHash   String
  role           UserRole            @default(user)
  likes          VideoLike[]
  comments       Comment[]
  shares         VideoShareEvent[]
  downloads      VideoDownloadEvent[]
  notifications  Notification[]
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
}

model Category {
  id             Int       @id @default(autoincrement())
  name           String    @unique
  slug           String    @unique
  description    String?
  videos         Video[]
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}

model Video {
  id                  Int                 @id @default(autoincrement())
  title               String
  description         String?
  categoryId          Int
  category            Category            @relation(fields: [categoryId], references: [id])
  cloudinaryPublicId  String              @unique
  videoUrl            String
  thumbnailUrl        String?
  durationSeconds     Int?
  isPublished         Boolean             @default(true)
  viewsCount          Int                 @default(0)
  textSections        VideoTextSection[]
  likes               VideoLike[]
  comments            Comment[]
  shares              VideoShareEvent[]
  downloads           VideoDownloadEvent[]
  createdByAdminId    Int
  createdAt           DateTime            @default(now())
  updatedAt           DateTime            @updatedAt

  @@index([categoryId, createdAt])
}

model VideoTextSection {
  id             Int      @id @default(autoincrement())
  videoId        Int
  video          Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  position       Int
  heading        String?
  body           String
  createdAt      DateTime @default(now())

  @@unique([videoId, position])
}

model VideoLike {
  id             Int      @id @default(autoincrement())
  videoId        Int
  userId         Int
  video          Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())

  @@unique([videoId, userId])
}

model Comment {
  id             Int      @id @default(autoincrement())
  videoId        Int
  userId         Int
  body           String
  isDeleted      Boolean  @default(false)
  video          Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([videoId, createdAt])
}

model VideoShareEvent {
  id             Int      @id @default(autoincrement())
  videoId        Int
  userId         Int
  channel        String?
  video          Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
}

model VideoDownloadEvent {
  id             Int      @id @default(autoincrement())
  videoId        Int
  userId         Int
  video          Video    @relation(fields: [videoId], references: [id], onDelete: Cascade)
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())
}

model Notification {
  id             Int      @id @default(autoincrement())
  userId         Int
  videoId        Int?
  type           String
  title          String
  body           String?
  isRead         Boolean  @default(false)
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt      DateTime @default(now())

  @@index([userId, createdAt])
}
```

## 4. Notes
- If you do not need analytics initially, `VideoShareEvent` and `VideoDownloadEvent` can be added later.
- Keep `viewsCount` eventually consistent (async increment accepted for MVP).
