# Minibaba API

Minibaba e-commerce veb-sayti uchun Node.js + Express + MongoDB backend.

## Talablar

- Node.js 18+
- MongoDB (local yoki Atlas)

## O'rnatish

```bash
npm install
cp .env.example .env
```

`.env` faylida `MONGODB_URI` va `JWT_SECRET` ni sozlang.

## Ma'lumotlarni yuklash

MongoDB ishlayotgan bo'lsa:

```bash
npm run seed
```

Bu buyruq UI dagi sotuvchilar va mahsulotlarni bazaga qo'shadi.

## Ishga tushirish

```bash
# Development
npm run dev

# Production
npm start
```

Server: `http://localhost:5000`

## API Endpointlar

### Mahsulotlar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/products/top` | Top mahsulotlar |
| GET | `/api/products` | Barcha mahsulotlar (qidiruv, filtr) |
| GET | `/api/products/:slug` | Bitta mahsulot |

**Query parametrlar** (`/api/products`):
- `search` — qidiruv so'zi
- `category` — kategoriya
- `seller` — sotuvchi ID
- `page`, `limit` — sahifalash

### Sotuvchilar

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/sellers/verified` | Tasdiqlangan sotuvchilar |
| GET | `/api/sellers` | Barcha sotuvchilar |
| GET | `/api/sellers/:slug` | Sotuvchi sahifasi + mahsulotlari |

### Autentifikatsiya

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| POST | `/api/auth/register` | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | Kirish |
| GET | `/api/auth/me` | Profil (JWT kerak) |

### Savat (JWT kerak)

| Method | Endpoint | Tavsif |
|--------|----------|--------|
| GET | `/api/cart` | Savatni ko'rish |
| POST | `/api/cart` | Savatga qo'shish |
| PUT | `/api/cart/:productId` | Miqdorni yangilash |
| DELETE | `/api/cart/:productId` | Savatdan o'chirish |
| DELETE | `/api/cart` | Savatni tozalash |

## Misollar

```bash
# Top mahsulotlar
curl http://localhost:5000/api/products/top

# Tasdiqlangan sotuvchilar
curl http://localhost:5000/api/sellers/verified

# Qidiruv
curl "http://localhost:5000/api/products?search=krossovka"

# Ro'yxatdan o'tish
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","email":"ali@mail.uz","password":"123456"}'

# Savatga qo'shish
curl -X POST http://localhost:5000/api/cart \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":8}'
```

## Loyiha tuzilmasi

```
src/
├── config/db.js          # MongoDB ulanish
├── controllers/        # Biznes logika
├── middleware/         # Auth va validatsiya
├── models/             # Mongoose schemalar
├── routes/             # API marshrutlar
├── app.js              # Express ilova
├── server.js           # Server entry point
└── seed.js             # Demo ma'lumotlar
```

## Test foydalanuvchi

Seed dan keyin:
- Email: `test@minibaba.uz`
- Parol: `123456`
