# ShopBy v2 — MERN E-Commerce

Production-style MERN stack with Tailwind CSS, Cloudinary avatars, pagination, live search, wishlist, reviews, admin analytics, and Socket.IO notifications.

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts, Socket.IO Client |
| Backend | Node.js, Express, Mongoose |
| Auth | JWT |
| Storage | MongoDB + Cloudinary (profile images) |
| Real-time | Socket.IO |

## Project structure

```
ShopBy/
├── client/src/
│   ├── api/axios.js
│   ├── components/     # Pagination, SearchBar, ProfilePhotoUpload, etc.
│   ├── context/        # Auth, Cart, Wishlist, Socket
│   ├── hooks/          # useDebounce, useRecentlyViewed
│   └── pages/          # + admin/AdminDashboard.jsx
├── server/src/
│   ├── config/         # db, cloudinary
│   ├── controllers/
│   ├── middleware/     # auth, upload, ensureDB, errorHandler
│   ├── models/
│   ├── routes/
│   ├── services/       # cloudinaryService
│   ├── socket/
│   └── utils/          # pagination, asyncHandler
```

## Setup

### 1. Install

```bash
npm run install:all
```

### 2. Environment (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

# Cloudinary (profile photos) — https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### 3. Seed & run

Re-run seed after product updates (54 products, prices in **INR**):

```bash
npm run seed
npm run server    # terminal 1 — port 5000
npm run client    # terminal 2 — port 3000
```

## API routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products?page&limit&sort&keyword&category` | Paginated products |
| GET | `/api/products/search/suggest?q=` | Live search suggestions |
| POST | `/api/products/:id/reviews` | Add review (auth) |
| PUT | `/api/users/password` | Change password (auth) |
| POST | `/api/users/avatar` | Upload profile photo (multipart) |
| GET/POST/DELETE | `/api/users/wishlist/:productId` | Wishlist |
| GET | `/api/admin/stats` | Dashboard analytics (admin) |
| GET | `/api/admin/users?page&limit` | Paginated users (admin) |
| GET | `/api/admin/orders?page&limit` | Paginated orders (admin) |

## Features

- **Cloudinary avatars** — upload, preview, replace; old image deleted on update
- **Backend pagination** — products, users, orders (`page`, `limit`, `sort`)
- **Live search** — debounced suggestions with image, name, price
- **Wishlist** — persisted in MongoDB per user
- **Recently viewed** — localStorage on product pages
- **Reviews & ratings** — dynamic average on products
- **Admin dashboard** — stats cards, Recharts revenue chart, user table with avatars
- **Socket.IO** — `newOrder` and `stockUpdate` events for admin

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| User | demo@shopby.com | demo123 |
| Admin | admin@shopby.com | admin123 |

Admin panel: http://localhost:3000/admin
