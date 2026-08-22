# Minibaba API — To'liq dokumentatsiya

Base URL: `http://localhost:5001`

Barcha javoblar JSON formatida qaytariladi.

```json
{
  "success": true,
  "data": {}
}
```

Xato bo'lsa:

```json
{
  "success": false,
  "message": "Xato tavsifi"
}
```

---

## 1. Health check

### `GET /api/health`

Server ishlayotganini tekshirish.

**So'rov:** body kerak emas.

**Javob (200):**
```json
{
  "success": true,
  "message": "Minibaba API ishlayapti"
}
```

---

## 2. Mahsulotlar

### `GET /api/products/top`

Top mahsulotlarni olish.

**Query parametrlar:**

| Parametr | Turi | Majburiy | Tavsif |
|----------|------|----------|--------|
| `limit` | number | Yo'q | Nechta mahsulot (default: 10, max: 50) |

**Misol:**
```
GET /api/products/top?limit=5
```

---

### `GET /api/products`

Barcha mahsulotlar, qidiruv va filtr bilan.

**Query parametrlar:**

| Parametr | Turi | Majburiy | Tavsif |
|----------|------|----------|--------|
| `search` | string | Yo'q | Qidiruv so'zi |
| `category` | string | Yo'q | Kategoriya bo'yicha filtr |
| `seller` | string | Yo'q | Sotuvchi MongoDB ID |
| `page` | number | Yo'q | Sahifa raqami (default: 1) |
| `limit` | number | Yo'q | Sahifadagi soni (default: 20, max: 100) |

**Misol:**
```
GET /api/products?search=krossovka&category=Oyoq kiyim&page=1&limit=10
```

---

### `GET /api/products/:slug`

Bitta mahsulotni slug bo'yicha olish.

**URL parametri:** `slug` — mahsulot slug'i

**Misol:**
```
GET /api/products/ayollar-sport-krossovkasi-yengil
```

---

### `POST /api/products` — Mahsulot qo'shish (AUTH KERAK EMAS)

Har kim mahsulot qo'shishi mumkin. Token yuborish shart emas.

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**

| Maydon | Turi | Majburiy | Tavsif |
|--------|------|----------|--------|
| `name` | string | Ha | Mahsulot nomi |
| `imageUrl` | string | Ha | Rasm linki (URL) |
| `price` | number | Ha | Narx (UZS) |
| `minOrderQuantity` | number | Ha | Minimal buyurtma miqdori |
| `category` | string | Ha | Kategoriya |
| `seller` | string | Ha | Sotuvchi MongoDB `_id` |
| `slug` | string | Yo'q | URL slug (berilmasa avtomatik yaratiladi) |
| `currency` | string | Yo'q | Valyuta (default: `UZS`) |
| `discountPercent` | number | Yo'q | Chegirma % (0-100, default: 0) |
| `isTop` | boolean | Yo'q | Top mahsulotmi (default: false) |
| `stock` | number | Yo'q | Ombordagi soni (default: 100) |

**Misol so'rov:**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yangi smartfon",
    "imageUrl": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    "price": 2500000,
    "minOrderQuantity": 3,
    "category": "Elektronika",
    "seller": "SELLER_MONGODB_ID",
    "discountPercent": 10,
    "isTop": true,
    "stock": 50
  }'
```

**Muvaffaqiyatli javob (201):**
```json
{
  "success": true,
  "message": "Mahsulot muvaffaqiyatli qo'shildi",
  "data": {
    "id": "...",
    "name": "Yangi smartfon",
    "slug": "yangi-smartfon",
    "imageUrl": "https://...",
    "price": 2500000,
    "currency": "UZS",
    "discountPercent": 10,
    "discountedPrice": 2250000,
    "minOrderQuantity": 3,
    "category": "Elektronika",
    "isTop": true,
    "stock": 50,
    "seller": {
      "id": "...",
      "name": "UzTech Electronics",
      "slug": "uztech-electronics",
      "logoUrl": "https://...",
      "isVerified": true
    },
    "isVerifiedSeller": true
  }
}
```

**Xatolar:**
- `400` — validatsiya xatosi yoki slug takrorlangan
- `404` — sotuvchi topilmadi

---

### `DELETE /api/products/:id` — Mahsulot o'chirish (AUTH KERAK EMAS)

Har kim mahsulotni o'chirishi mumkin. Token yuborish shart emas.
`:id` o'rniga MongoDB ID yoki slug yuborish mumkin.

**Misol (ID bo'yicha):**
```bash
curl -X DELETE http://localhost:5000/api/products/6789abc123def456
```

**Misol (slug bo'yicha):**
```bash
curl -X DELETE http://localhost:5000/api/products/yangi-smartfon
```

**Muvaffaqiyatli javob (200):**
```json
{
  "success": true,
  "message": "Mahsulot muvaffaqiyatli o'chirildi",
  "data": {
    "id": "...",
    "slug": "yangi-smartfon",
    "name": "Yangi smartfon"
  }
}
```

**Xatolar:**
- `404` — mahsulot topilmadi

---

## 3. Sotuvchilar

### `GET /api/sellers/verified`

Tasdiqlangan sotuvchilar ro'yxati.

**Query parametrlar:**

| Parametr | Turi | Majburiy | Tavsif |
|----------|------|----------|--------|
| `limit` | number | Yo'q | Nechta sotuvchi (default: 10, max: 50) |

---

### `GET /api/sellers`

Barcha sotuvchilar.

**Query parametrlar:**

| Parametr | Turi | Majburiy | Tavsif |
|----------|------|----------|--------|
| `location` | string | Yo'q | Shahar bo'yicha filtr |
| `page` | number | Yo'q | Sahifa (default: 1) |
| `limit` | number | Yo'q | Limit (default: 20) |

---

### `GET /api/sellers/:slug`

Sotuvchi sahifasi va uning mahsulotlari.

**Misol:**
```
GET /api/sellers/uztech-electronics
```

---

## 4. Autentifikatsiya

Register va login **ochiq**.

- `accessToken` — JSON javobda + frontend `localStorage` da (15 daqiqa)
- `refreshToken` — **httpOnly cookie** da (`refreshToken`, 7 kun). JS o'qiy olmaydi

Frontend so'rovlarida `withCredentials: true` bo'lishi shart (cookie yuborilishi uchun).

### `POST /api/auth/register`

Yangi foydalanuvchi ro'yxatdan o'tkazish. **Auth kerak emas.**

**Body:**

| Maydon | Turi | Majburiy |
|--------|------|----------|
| `name` | string | Ha |
| `email` | string | Ha |
| `password` | string | Ha (min 6 belgi) |

**Misol:**
```json
{
  "name": "Ali Valiyev",
  "email": "ali@mail.uz",
  "password": "123456"
}
```

**Javob (201):**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Ali Valiyev",
    "email": "ali@mail.uz",
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Cookie: `Set-Cookie: refreshToken=...; HttpOnly; Path=/api/auth`

---

### `POST /api/auth/login`

Tizimga kirish. **Auth kerak emas.**

**Body:**

| Maydon | Turi | Majburiy |
|--------|------|----------|
| `email` | string | Ha |
| `password` | string | Ha |

**Misol:**
```json
{
  "email": "ali@mail.uz",
  "password": "123456"
}
```

Javob register bilan bir xil: `accessToken` + `refreshToken` cookie.

---

### `POST /api/auth/refresh`

Access token muddati tugaganda yangi access olish.  
**Body kerak emas** — `refreshToken` cookie avtomatik yuboriladi.

```
POST /api/auth/refresh
Cookie: refreshToken=...
```

**Javob (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "..."
  }
}
```

Yangi `refreshToken` cookie ham yangilanadi.

---

### `POST /api/auth/logout`

Refresh tokenni bekor qilish + cookie ni tozalash. **Access token kerak.**

```
Authorization: Bearer ACCESS_TOKEN
```

---

### `GET /api/auth/me` yoki `GET /api/me`

Joriy foydalanuvchi profili. **Access token kerak.** Ikkalasi bir xil.

**Headers:**
```
Authorization: Bearer ACCESS_TOKEN
```

**Javob:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "name": "Ali Valiyev",
    "email": "ali@mail.uz"
  }
}
```

---

## 5. Buyurtmalar (access token kerak)

Barcha buyurtma endpointlari:

```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

### `GET /api/orders`

Joriy foydalanuvchining buyurtmalari.

### `POST /api/orders`

Buyurtma berish. Mahsulot ID va soni yetarli.

**Body (bitta mahsulot):**
```json
{
  "productId": "6789abc123def456",
  "quantity": 8
}
```

**Body (bir nechta):**
```json
{
  "items": [
    { "productId": "ID_1", "quantity": 8 },
    { "productId": "ID_2", "quantity": 3 }
  ]
}
```

`quantity` mahsulotning `minOrderQuantity` dan kichik bo'lmasligi kerak.

**Javob (201):** buyurtma obyekti (`id`, `status`, `total`, `items`).

---

## 6. Savat (access token kerak)

Barcha savat endpointlari uchun header:

```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

### `GET /api/cart`

Savatdagi mahsulotlarni ko'rish.

---

### `POST /api/cart`

Savatga mahsulot qo'shish.

**Body:**

| Maydon | Turi | Majburiy | Tavsif |
|--------|------|----------|--------|
| `productId` | string | Ha | Mahsulot MongoDB ID |
| `quantity` | number | Yo'q | Miqdor (default: 1, min buyurtma miqdoridan kam bo'lmasligi kerak) |

**Misol:**
```json
{
  "productId": "6789abc123def456",
  "quantity": 8
}
```

---

### `PUT /api/cart/:productId`

Savatdagi mahsulot miqdorini yangilash.

**Body:**
```json
{
  "quantity": 10
}
```

---

### `DELETE /api/cart/:productId`

Bitta mahsulotni savatdan o'chirish.

---

### `DELETE /api/cart`

Butun savatni tozalash.

---

## Sotuvchi ID ni qayerdan olish?

Mahsulot qo'shishdan oldin sotuvchilar ro'yxatini oling:

```bash
curl http://localhost:5000/api/sellers/verified
```

Javobdagi `data[].id` ni `seller` maydoniga yuboring.

---

## HTTP status kodlari

| Kod | Ma'nosi |
|-----|---------|
| 200 | Muvaffaqiyatli |
| 201 | Yaratildi |
| 400 | Noto'g'ri so'rov / validatsiya xatosi |
| 401 | Avtorizatsiya kerak |
| 404 | Topilmadi |
| 500 | Server xatosi |
