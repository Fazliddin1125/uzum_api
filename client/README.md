# Minibaba Client

React (JSX) + Axios auth ilovasi.

## Ishga tushirish

API ni ishga tushiring (`http://localhost:5001`), keyin:

```bash
cd client
npm install
npm run dev
```

## Tokenlar

- `accessToken` — `localStorage`
- `refreshToken` — **httpOnly cookie** (backend yozadi)

Axios da `withCredentials: true` yoqilgan.

- `axiosPublic` — login, register, refresh
- `axiosAuth` — profil, logout (Bearer accessToken)

Login `Login.jsx` ichida, register `Register.jsx` ichida.
