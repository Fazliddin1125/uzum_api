const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Minibaba API',
      version: '1.0.0',
      description: `
Minibaba e-commerce backend API.

## Auth
- **accessToken** — login/register javobida. Header: \`Authorization: Bearer <token>\`
- **refreshToken** — httpOnly cookie. \`POST /api/auth/refresh\` da \`credentials: true\` bilan yuboriladi.

## Ochik endpointlar
Mahsulot GET/POST/DELETE, sotuvchilar GET, register/login — token shart emas.

## Himoyalangan
\`/api/me\`, \`/api/orders\`, \`/api/cart\`, logout — Bearer accessToken kerak.
      `,
    },
    servers: [
      { url: 'http://localhost:5001', description: 'Local' },
      { url: '/', description: 'Current host (Render)' },
    ],
    tags: [
      { name: 'Health', description: 'Server holati' },
      { name: 'Auth', description: 'Register, login, token, profil' },
      { name: 'Products', description: 'Mahsulotlar' },
      { name: 'Sellers', description: 'Sotuvchilar' },
      { name: 'Orders', description: 'Buyurtmalar (auth)' },
      { name: 'Cart', description: 'Savat (auth)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Login yoki register dan olingan accessToken',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Xato tavsifi' },
          },
        },
        AuthUser: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'Ali Valiyev' },
            email: { type: 'string', example: 'ali@mail.uz' },
            accessToken: { type: 'string' },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            imageUrl: { type: 'string' },
            price: { type: 'number', example: 399000 },
            currency: { type: 'string', example: 'UZS' },
            discountPercent: { type: 'number', example: 8 },
            discountedPrice: { type: 'number' },
            minOrderQuantity: { type: 'number', example: 8 },
            category: { type: 'string' },
            isTop: { type: 'boolean' },
            stock: { type: 'number' },
            isVerifiedSeller: { type: 'boolean' },
            seller: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                slug: { type: 'string' },
                logoUrl: { type: 'string' },
                isVerified: { type: 'boolean' },
              },
            },
          },
        },
        CreateProduct: {
          type: 'object',
          required: ['name', 'imageUrl', 'price', 'minOrderQuantity', 'category', 'seller'],
          properties: {
            name: { type: 'string', example: 'Yangi smartfon' },
            imageUrl: { type: 'string', example: 'https://example.com/phone.jpg' },
            price: { type: 'number', example: 2500000 },
            minOrderQuantity: { type: 'integer', example: 3 },
            category: { type: 'string', example: 'Elektronika' },
            seller: { type: 'string', description: 'Seller MongoDB ID' },
            slug: { type: 'string' },
            currency: { type: 'string', example: 'UZS' },
            discountPercent: { type: 'integer', example: 10 },
            isTop: { type: 'boolean', example: true },
            stock: { type: 'integer', example: 50 },
          },
        },
        Seller: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string', example: 'UzTech Electronics' },
            slug: { type: 'string' },
            logoUrl: { type: 'string' },
            experienceYears: { type: 'number', example: 6 },
            experienceLabel: { type: 'string', example: '6 yillik tajriba' },
            location: { type: 'string', example: 'Toshkent' },
            reliabilityScore: { type: 'number', example: 98 },
            reliabilityLabel: { type: 'string', example: '98% Ishonchlilik' },
            responseTimeSeconds: { type: 'number', example: 24 },
            responseTimeLabel: { type: 'string', example: '24s Javob vaqti' },
            isVerified: { type: 'boolean' },
            description: { type: 'string' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            status: { type: 'string', example: 'pending' },
            total: { type: 'number', example: 3750000 },
            currency: { type: 'string', example: 'UZS' },
            createdAt: { type: 'string', format: 'date-time' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  name: { type: 'string' },
                  imageUrl: { type: 'string' },
                  price: { type: 'number' },
                  quantity: { type: 'integer' },
                  subtotal: { type: 'number' },
                },
              },
            },
          },
        },
        CreateOrder: {
          type: 'object',
          properties: {
            productId: { type: 'string', description: 'Bitta mahsulot uchun' },
            quantity: { type: 'integer', example: 5 },
            items: {
              type: 'array',
              description: 'Bir nechta mahsulot uchun',
              items: {
                type: 'object',
                properties: {
                  productId: { type: 'string' },
                  quantity: { type: 'integer' },
                },
              },
            },
          },
        },
        CartItem: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            imageUrl: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string' },
            discountPercent: { type: 'number' },
            discountedPrice: { type: 'number' },
            minOrderQuantity: { type: 'number' },
            quantity: { type: 'integer' },
            subtotal: { type: 'number' },
          },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['Health'],
          summary: 'Server holati',
          responses: {
            200: {
              description: 'OK',
              content: {
                'application/json': {
                  example: { success: true, message: 'Minibaba API ishlayapti' },
                },
              },
            },
          },
        },
      },

      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: "Ro'yxatdan o'tish",
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['name', 'email', 'password'],
                  properties: {
                    name: { type: 'string', example: 'Ali Valiyev' },
                    email: { type: 'string', example: 'ali@mail.uz' },
                    password: { type: 'string', example: '123456', minLength: 6 },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Yaratildi. refreshToken cookie ham qo\'yiladi.',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/AuthUser' },
                    },
                  },
                },
              },
            },
            400: { description: 'Email band yoki validatsiya xatosi', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Tizimga kirish',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'password'],
                  properties: {
                    email: { type: 'string', example: 'ali@mail.uz' },
                    password: { type: 'string', example: '123456' },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'OK. accessToken + refreshToken cookie',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/AuthUser' },
                    },
                  },
                },
              },
            },
            401: { description: "Email yoki parol noto'g'ri", content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      '/api/auth/refresh': {
        post: {
          tags: ['Auth'],
          summary: 'Access tokenni yangilash (refresh cookie)',
          description: 'Body kerak emas. Cookie: refreshToken. Browserda withCredentials: true.',
          responses: {
            200: {
              description: 'Yangi accessToken',
              content: {
                'application/json': {
                  example: { success: true, data: { accessToken: 'eyJ...' } },
                },
              },
            },
            401: { description: 'Cookie yo\'q yoki yaroqsiz', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          },
        },
      },

      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Chiqish',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Cookie tozalandi', content: { 'application/json': { example: { success: true, message: 'Tizimdan chiqildi' } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/api/auth/me': {
        get: {
          tags: ['Auth'],
          summary: 'Profil (/api/auth/me)',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Profil',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/UserProfile' },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/api/me': {
        get: {
          tags: ['Auth'],
          summary: 'Profil (/api/me) — auth/me bilan bir xil',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Profil',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/UserProfile' },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/api/products/top': {
        get: {
          tags: ['Products'],
          summary: 'Top mahsulotlar',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10, maximum: 50 } },
          ],
          responses: {
            200: {
              description: 'Ro\'yxat',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      count: { type: 'integer' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                    },
                  },
                },
              },
            },
          },
        },
      },

      '/api/products': {
        get: {
          tags: ['Products'],
          summary: 'Barcha mahsulotlar (qidiruv, filtr)',
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'category', in: 'query', schema: { type: 'string' } },
            { name: 'seller', in: 'query', schema: { type: 'string' }, description: 'Seller ID' },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: {
              description: 'Sahifalangan ro\'yxat',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      count: { type: 'integer' },
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      pages: { type: 'integer' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                    },
                  },
                },
              },
            },
          },
        },
        post: {
          tags: ['Products'],
          summary: "Mahsulot qo'shish (auth kerak emas)",
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateProduct' },
              },
            },
          },
          responses: {
            201: {
              description: "Qo'shildi",
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Product' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validatsiya xatosi' },
            404: { description: 'Sotuvchi topilmadi' },
          },
        },
      },

      '/api/products/{slug}': {
        get: {
          tags: ['Products'],
          summary: 'Bitta mahsulot (slug)',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: {
              description: 'Mahsulot',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      data: { $ref: '#/components/schemas/Product' },
                    },
                  },
                },
              },
            },
            404: { description: 'Topilmadi' },
          },
        },
      },

      '/api/products/{id}': {
        delete: {
          tags: ['Products'],
          summary: "Mahsulot o'chirish (ID yoki slug, auth kerak emas)",
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'MongoDB ID yoki slug' },
          ],
          responses: {
            200: { description: "O'chirildi", content: { 'application/json': { example: { success: true, message: "Mahsulot muvaffaqiyatli o'chirildi" } } } },
            404: { description: 'Topilmadi' },
          },
        },
      },

      '/api/sellers/verified': {
        get: {
          tags: ['Sellers'],
          summary: 'Tasdiqlangan sotuvchilar',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          ],
          responses: {
            200: {
              description: 'Ro\'yxat',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      count: { type: 'integer' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Seller' } },
                    },
                  },
                },
              },
            },
          },
        },
      },

      '/api/sellers': {
        get: {
          tags: ['Sellers'],
          summary: 'Barcha sotuvchilar',
          parameters: [
            { name: 'location', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          ],
          responses: {
            200: {
              description: 'Ro\'yxat',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      count: { type: 'integer' },
                      total: { type: 'integer' },
                      page: { type: 'integer' },
                      pages: { type: 'integer' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Seller' } },
                    },
                  },
                },
              },
            },
          },
        },
      },

      '/api/sellers/{slug}': {
        get: {
          tags: ['Sellers'],
          summary: 'Sotuvchi sahifasi + mahsulotlari',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: 'Sotuvchi va products' },
            404: { description: 'Topilmadi' },
          },
        },
      },

      '/api/orders': {
        get: {
          tags: ['Orders'],
          summary: 'Mening buyurtmalarim',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Buyurtmalar',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      count: { type: 'integer' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/Order' } },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Orders'],
          summary: 'Buyurtma berish (productId + quantity)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/CreateOrder' },
                examples: {
                  one: {
                    summary: 'Bitta mahsulot',
                    value: { productId: '6789abc123def456', quantity: 5 },
                  },
                  many: {
                    summary: 'Bir nechta',
                    value: {
                      items: [
                        { productId: 'ID_1', quantity: 5 },
                        { productId: 'ID_2', quantity: 2 },
                      ],
                    },
                  },
                },
              },
            },
          },
          responses: {
            201: {
              description: 'Yaratildi',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      data: { $ref: '#/components/schemas/Order' },
                    },
                  },
                },
              },
            },
            400: { description: 'Validatsiya / minimal buyurtma' },
            401: { description: 'Unauthorized' },
            404: { description: 'Mahsulot topilmadi' },
          },
        },
      },

      '/api/cart': {
        get: {
          tags: ['Cart'],
          summary: 'Savatni ko\'rish',
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: 'Savat',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      count: { type: 'integer' },
                      total: { type: 'number' },
                      currency: { type: 'string' },
                      data: { type: 'array', items: { $ref: '#/components/schemas/CartItem' } },
                    },
                  },
                },
              },
            },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Cart'],
          summary: "Savatga qo'shish",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['productId'],
                  properties: {
                    productId: { type: 'string' },
                    quantity: { type: 'integer', example: 8 },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: "Qo'shildi" },
            400: { description: 'Minimal buyurtma' },
            401: { description: 'Unauthorized' },
            404: { description: 'Mahsulot topilmadi' },
          },
        },
        delete: {
          tags: ['Cart'],
          summary: 'Savatni tozalash',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Tozalandi' },
            401: { description: 'Unauthorized' },
          },
        },
      },

      '/api/cart/{productId}': {
        put: {
          tags: ['Cart'],
          summary: 'Savatdagi miqdorni yangilash',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'productId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['quantity'],
                  properties: { quantity: { type: 'integer', example: 10 } },
                },
              },
            },
          },
          responses: {
            200: { description: 'Yangilandi' },
            401: { description: 'Unauthorized' },
            404: { description: 'Savatda yo\'q' },
          },
        },
        delete: {
          tags: ['Cart'],
          summary: 'Savatdan bitta mahsulotni o\'chirish',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'productId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: {
            200: { description: "O'chirildi" },
            401: { description: 'Unauthorized' },
            404: { description: 'Topilmadi' },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
