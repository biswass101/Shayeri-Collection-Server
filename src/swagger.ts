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
        url: `http://localhost:${process.env.PORT || 3000}`,
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
