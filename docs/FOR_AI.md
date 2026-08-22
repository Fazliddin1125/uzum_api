# Minibaba API — Register, Login, Profile, Orders

Copy this file to another AI. It is enough to implement register, login, profile (`/me`), create order, and list orders.

## Base URL

Replace with the real deployed URL if needed:

```
http://localhost:5001
```

Production example:

```
https://YOUR-RENDER-URL.onrender.com
```

All responses are JSON.

Success:

```json
{ "success": true, "data": {} }
```

Error:

```json
{ "success": false, "message": "Error text" }
```

CORS is open. Send `Content-Type: application/json`.

---

## Auth model (important)

Two tokens:

| Token | Where | Used for |
|--------|--------|----------|
| `accessToken` | JSON body on login/register. Frontend stores it (localStorage). | Header `Authorization: Bearer <accessToken>` |
| `refreshToken` | **httpOnly cookie** named `refreshToken`. Not in JSON. | `POST /api/auth/refresh` with `credentials: true` / cookie jar |

Access token lives ~15 minutes. Refresh cookie lives ~7 days.

Protected routes (401 without valid access token):

- `GET /api/me`
- `GET /api/auth/me` (same as `/api/me`)
- `GET /api/orders`
- `POST /api/orders`
- cart routes under `/api/cart`

---

## 1. Register (public)

`POST /api/auth/register`

Body:

```json
{
  "name": "Ali Valiyev",
  "email": "ali@mail.uz",
  "password": "123456"
}
```

Rules:

- `name` required
- `email` required, valid email
- `password` required, min 6 chars

Response `201`:

```json
{
  "success": true,
  "data": {
    "id": "USER_MONGO_ID",
    "name": "Ali Valiyev",
    "email": "ali@mail.uz",
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

Also sets cookie `refreshToken` (HttpOnly).

If using fetch/axios from browser:

```js
await axios.post(BASE + '/api/auth/register', { name, email, password }, { withCredentials: true });
localStorage.setItem('accessToken', data.data.accessToken);
```

---

## 2. Login (public)

`POST /api/auth/login`

Body:

```json
{
  "email": "ali@mail.uz",
  "password": "123456"
}
```

Response `200`: same shape as register (`id`, `name`, `email`, `accessToken`) + refresh cookie.

Wrong password → `401`.

---

## 3. Profile / me (auth required)

Use either URL (same handler):

- `GET /api/me`
- `GET /api/auth/me`

Headers:

```
Authorization: Bearer ACCESS_TOKEN
```

Response `200`:

```json
{
  "success": true,
  "data": {
    "id": "USER_MONGO_ID",
    "name": "Ali Valiyev",
    "email": "ali@mail.uz"
  }
}
```

No access token → `401`.

---

## 4. Refresh access token

`POST /api/auth/refresh`

No body. Browser must send cookies (`withCredentials: true`).

Response `200`:

```json
{
  "success": true,
  "data": { "accessToken": "NEW_ACCESS_TOKEN" }
}
```

Replace stored access token with the new one.

---

## 5. Logout (auth required)

`POST /api/auth/logout`

Header: `Authorization: Bearer ACCESS_TOKEN`

Clears refresh cookie.

---

## 6. Products (needed to get productId)

Public:

```
GET /api/products
GET /api/products/top
GET /api/products/:slug
```

Each product has `id` (use this as `productId`) and `minOrderQuantity`.

Example:

```json
{
  "id": "6a48bd4c6f29200fbc165194",
  "name": "Qurilish asboblari to'plami",
  "price": 750000,
  "minOrderQuantity": 5
}
```

---

## 7. Create order (auth required)

`POST /api/orders`

Header:

```
Authorization: Bearer ACCESS_TOKEN
Content-Type: application/json
```

### Simple body (one product)

```json
{
  "productId": "6a48bd4c6f29200fbc165194",
  "quantity": 5
}
```

`quantity` must be >= product `minOrderQuantity`.

### Multiple products

```json
{
  "items": [
    { "productId": "PRODUCT_ID_1", "quantity": 5 },
    { "productId": "PRODUCT_ID_2", "quantity": 2 }
  ]
}
```

Response `201`:

```json
{
  "success": true,
  "message": "Buyurtma yaratildi",
  "data": {
    "id": "ORDER_ID",
    "status": "pending",
    "total": 3750000,
    "currency": "UZS",
    "createdAt": "2026-08-22T00:00:00.000Z",
    "items": [
      {
        "productId": "6a48bd4c6f29200fbc165194",
        "name": "Qurilish asboblari to'plami",
        "imageUrl": "https://...",
        "price": 750000,
        "quantity": 5,
        "subtotal": 3750000
      }
    ]
  }
}
```

Errors:

- `400` missing productId/quantity, or quantity below min
- `401` no/invalid token
- `404` product not found

---

## 8. List my orders (auth required)

`GET /api/orders`

Header: `Authorization: Bearer ACCESS_TOKEN`

Returns only the logged-in user's orders.

Response `200`:

```json
{
  "success": true,
  "count": 1,
  "data": [ { "...same order object as create..." } ]
}
```

---

## Minimal frontend flow for another AI

1. Register or login → save `accessToken`.
2. Call `GET /api/me` with Bearer token to show profile.
3. Call `GET /api/products` to pick `id`.
4. Call `POST /api/orders` with `{ productId, quantity }` and Bearer token.
5. Call `GET /api/orders` with Bearer token to show "Buyurtmalarim".

Axios example:

```js
const api = axios.create({
  baseURL: 'http://localhost:5001',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

await api.post('/api/auth/register', { name, email, password });
await api.get('/api/me');
await api.post('/api/orders', { productId, quantity: 2 });
await api.get('/api/orders');
```

Fetch example (login):

```js
const res = await fetch(BASE + '/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password }),
});
const json = await res.json();
const token = json.data.accessToken;

const me = await fetch(BASE + '/api/me', {
  headers: { Authorization: 'Bearer ' + token },
  credentials: 'include',
});
```

---

## Curl cheat sheet

```bash
# register
curl -c cookies.txt -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ali","email":"ali@mail.uz","password":"123456"}'

# login
curl -c cookies.txt -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ali@mail.uz","password":"123456"}'

# me
curl http://localhost:5001/api/me \
  -H "Authorization: Bearer ACCESS_TOKEN"

# products
curl http://localhost:5001/api/products

# create order
curl -X POST http://localhost:5001/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ACCESS_TOKEN" \
  -d '{"productId":"PRODUCT_ID","quantity":5}'

# my orders
curl http://localhost:5001/api/orders \
  -H "Authorization: Bearer ACCESS_TOKEN"
```
