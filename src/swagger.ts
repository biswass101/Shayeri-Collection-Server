import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sayeri Collection API',
      version: '1.0.0',
      description: 'API documentation for Sayeri Collection Server',
      contact: {
        name: 'Sayeri Collection Support',
        email: 'support@sayeri.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        VideoTextSection: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            position: { type: 'integer' },
            heading: { type: 'string', nullable: true },
            body: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        VideoTextSectionCreateRequest: {
          type: 'object',
          required: ['body'],
          properties: {
            position: { type: 'integer', example: 1 },
            heading: { type: 'string', example: 'Intro' },
            body: { type: 'string', example: 'Some shayari text...' },
          },
        },
        VideoTextSectionUpdateRequest: {
          type: 'object',
          properties: {
            position: { type: 'integer', example: 2 },
            heading: { type: 'string', example: 'Updated heading' },
            body: { type: 'string', example: 'Updated text...' },
          },
        },
        VideoTextSectionResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/VideoTextSection' },
          },
        },
        Video: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            categoryId: { type: 'integer' },
            category: { $ref: '#/components/schemas/Category' },
            cloudinaryPublicId: { type: 'string' },
            videoUrl: { type: 'string' },
            thumbnailUrl: { type: 'string', nullable: true },
            durationSeconds: { type: 'integer', nullable: true },
            isPublished: { type: 'boolean' },
            viewsCount: { type: 'integer' },
            createdByAdminId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            textSections: {
              type: 'array',
              items: { $ref: '#/components/schemas/VideoTextSection' },
            },
          },
        },
        VideoCreateRequest: {
          type: 'object',
          required: ['title', 'categoryId', 'video'],
          properties: {
            title: { type: 'string', example: 'Best Shayari' },
            description: { type: 'string' },
            categoryId: { type: 'integer', example: 1 },
            isPublished: { type: 'boolean', example: true },
            textSections: {
              type: 'string',
              description: 'JSON array of text sections',
              example: '[{\"position\":1,\"heading\":\"Intro\",\"body\":\"...\"}]',
            },
            video: { type: 'string', format: 'binary' },
            thumbnail: { type: 'string', format: 'binary' },
          },
        },
        VideoUpdateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'integer' },
            isPublished: { type: 'boolean' },
            textSections: {
              type: 'string',
              description: 'JSON array of text sections',
            },
            video: { type: 'string', format: 'binary' },
            thumbnail: { type: 'string', format: 'binary' },
          },
        },
        VideoResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/Video' },
          },
        },
        VideosListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Video' },
            },
            meta: {
              type: 'object',
              properties: {
                total: { type: 'integer' },
                page: { type: 'integer' },
                limit: { type: 'integer' },
              },
            },
          },
        },
        VideoLike: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            videoId: { type: 'integer' },
            userId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        VideoLikeResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/VideoLike' },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            videoId: { type: 'integer' },
            userId: { type: 'integer' },
            body: { type: 'string' },
            isDeleted: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            user: { $ref: '#/components/schemas/User' },
          },
        },
        CommentCreateRequest: {
          type: 'object',
          required: ['body'],
          properties: {
            body: { type: 'string', example: 'Great video!' },
          },
        },
        CommentUpdateRequest: {
          type: 'object',
          required: ['body'],
          properties: {
            body: { type: 'string', example: 'Updated comment text' },
          },
        },
        CommentResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/Comment' },
          },
        },
        CommentsListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Comment' },
            },
          },
        },
        VideoShareEvent: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            videoId: { type: 'integer' },
            userId: { type: 'integer' },
            channel: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        VideoShareRequest: {
          type: 'object',
          properties: {
            channel: { type: 'string', example: 'whatsapp' },
          },
        },
        VideoShareResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/VideoShareEvent' },
          },
        },
        VideoDownloadEvent: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            videoId: { type: 'integer' },
            userId: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        VideoDownloadResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                downloadUrl: { type: 'string' },
                event: { $ref: '#/components/schemas/VideoDownloadEvent' },
              },
            },
          },
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            userId: { type: 'integer' },
            videoId: { type: 'integer', nullable: true },
            type: { type: 'string' },
            title: { type: 'string' },
            body: { type: 'string', nullable: true },
            isRead: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        NotificationResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: { $ref: '#/components/schemas/Notification' },
          },
        },
        NotificationsListResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Notification' },
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Category ID',
            },
            name: {
              type: 'string',
              description: 'Category name',
            },
            slug: {
              type: 'string',
              description: 'Category slug',
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Category description',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Category creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Category update timestamp',
            },
          },
        },
        CategoryCreateRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: {
              type: 'string',
              example: 'Romantic',
            },
            slug: {
              type: 'string',
              example: 'romantic',
            },
            description: {
              type: 'string',
              example: 'Shayari for romantic moments',
            },
          },
        },
        CategoryUpdateRequest: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              example: 'Motivational',
            },
            slug: {
              type: 'string',
              example: 'motivational',
            },
            description: {
              type: 'string',
              example: 'Shayari to inspire and motivate',
            },
          },
        },
        CategoryResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            data: {
              $ref: '#/components/schemas/Category',
            },
          },
        },
        CategoriesListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Category',
              },
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            email: {
              type: 'string',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            avatarUrl: {
              type: 'string',
              description: 'Profile image URL',
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'name', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com',
              description: 'User email address',
            },
            name: {
              type: 'string',
              example: 'John Doe',
              description: 'User full name',
            },
            password: {
              type: 'string',
              example: 'password123',
              description: 'User password',
            },
            avatar: {
              type: 'string',
              format: 'binary',
              description: 'Profile image file (optional)',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'user@example.com',
              description: 'User email address',
            },
            password: {
              type: 'string',
              example: 'password123',
              description: 'User password',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
                token: {
                  type: 'string',
                  description: 'JWT token',
                },
              },
            },
          },
        },
        UserResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            data: {
              $ref: '#/components/schemas/User',
            },
          },
        },
        UsersListResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
