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

```bash
npm run seed
```

## Ishga tushirish

```bash
npm run dev    # development
npm start      # production
```

Server: `http://localhost:5000`

## API Dokumentatsiya

Barcha route'lar, yuboriladigan body va query parametrlar batafsil yozilgan:

**[docs/API.md](./docs/API.md)**

## Tezkor endpointlar

| Method | Endpoint | Auth | Tavsif |
|--------|----------|------|--------|
| GET | `/api/health` | Yo'q | Server holati |
| GET | `/api/products/top` | Yo'q | Top mahsulotlar |
| GET | `/api/products` | Yo'q | Barcha mahsulotlar |
| GET | `/api/products/:slug` | Yo'q | Bitta mahsulot |
| **POST** | **`/api/products`** | **Yo'q** | **Mahsulot qo'shish** |
| **DELETE** | **`/api/products/:id`** | **Yo'q** | **Mahsulot o'chirish** |
| GET | `/api/sellers/verified` | Yo'q | Tasdiqlangan sotuvchilar |
| GET | `/api/sellers/:slug` | Yo'q | Sotuvchi sahifasi |
| POST | `/api/auth/register` | Yo'q | Ro'yxatdan o'tish |
| POST | `/api/auth/login` | Yo'q | Kirish |
| GET | `/api/cart` | Ha (JWT) | Savat |

## Mahsulot qo'shish (auth kerak emas)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yangi mahsulot",
    "imageUrl": "https://example.com/rasm.jpg",
    "price": 500000,
    "minOrderQuantity": 5,
    "category": "Elektronika",
    "seller": "SELLER_ID"
  }'
```

Sotuvchi ID olish: `GET /api/sellers/verified`

## Mahsulot o'chirish (auth kerak emas)

```bash
curl -X DELETE http://localhost:5000/api/products/PRODUCT_ID
# yoki slug bilan:
curl -X DELETE http://localhost:5000/api/products/mahsulot-slug
```

## Loyiha tuzilmasi

```
src/
├── config/db.js
├── controllers/
├── middleware/
├── models/
├── routes/
├── app.js
├── server.js
└── seed.js
docs/
└── API.md          # To'liq API dokumentatsiya
```

## Test foydalanuvchi

Seed dan keyin: `test@minibaba.uz` / `123456`
