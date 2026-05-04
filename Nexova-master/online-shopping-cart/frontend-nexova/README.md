# Nexova — React Frontend

Alibaba-inspired ecommerce frontend for the Spring Boot backend.

---

## Project Structure

```
nexova-react/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.jsx          ← Login + Register modal (JWT)
│   │   ├── cart/
│   │   │   └── CartSidebar.jsx        ← Slide-in cart with item list
│   │   ├── checkout/
│   │   │   └── CheckoutModal.jsx      ← Payment form → confirmCart API
│   │   ├── common/
│   │   │   ├── Hero.jsx               ← Homepage hero banner
│   │   │   ├── StatsBar.jsx           ← Stats cards (products, sellers)
│   │   │   └── DemoBanner.jsx         ← Shown when backend is offline
│   │   ├── layout/
│   │   │   ├── Navbar.jsx             ← Top nav with search, cart, dark mode
│   │   │   ├── CategoryBar.jsx        ← Filter tabs (Electronics, Mobile...)
│   │   │   └── Footer.jsx             ← Footer links
│   │   └── product/
│   │       ├── ProductCard.jsx        ← Card with Unsplash image + add to cart
│   │       ├── ProductGrid.jsx        ← Responsive grid + skeleton loader
│   │       └── ProductModal.jsx       ← Product detail popup
│   ├── context/
│   │   ├── AuthContext.jsx            ← User + JWT token global state
│   │   ├── CartContext.jsx            ← Cart global state
│   │   └── ToastContext.jsx           ← Toast notifications
│   ├── hooks/
│   │   └── useProducts.js             ← Fetch + filter products
│   ├── pages/
│   │   └── HomePage.jsx               ← Main page
│   ├── services/
│   │   └── api.js                     ← ALL backend API calls (axios)
│   ├── utils/
│   │   └── imageHelper.js             ← Product image URLs (see below)
│   ├── App.jsx                        ← Root component
│   ├── index.js                       ← Entry point
│   └── index.css                      ← Tailwind + custom fonts
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Install Tailwind
npm install -D tailwindcss postcss autoprefixer

# 3. Start
npm start
```

Backend should be running on `http://localhost:8080`.
If backend is offline, the app auto-switches to **demo mode** with 12 sample products.

---

## Product Images — Unsplash API (TMDB jaisa)

TMDB movies ke liye free image API deta hai.
Ecommerce ke liye **Unsplash Source API** wahi kaam karta hai — bilkul free, no key needed.

```
https://source.unsplash.com/400x400/?gaming+mouse&sig=1
```

- `400x400` = image size
- `?gaming+mouse` = keyword (product name se auto-generate)
- `&sig=1` = product ID se consistent image (same product = same image har baar)

File: `src/utils/imageHelper.js`

```js
import { getProductImageUrl } from '../utils/imageHelper'

const url = getProductImageUrl(product, 400, 400)
// → https://source.unsplash.com/400x400/?gaming+mouse&sig=42
```

**Priority logic:**
1. `product.productImageUrl` (backend se agar hai toh wahi use hoga)
2. Unsplash keyword-based URL (auto-generated from productName + productBrand)
3. Fallback emoji (agar image load fail ho)

**Paid alternatives (production ke liye):**
- Pexels API — free with key → https://www.pexels.com/api/
- Bing Image Search — Microsoft Azure ($)
- Google Custom Search API ($)

---

## All APIs Used

| Feature         | API                                    |
|-----------------|----------------------------------------|
| Register        | POST /api/auth/register                |
| Login (JWT)     | POST /api/auth/login                   |
| Delete Account  | DELETE /api/auth/deleteByUser          |
| All Products    | GET /api/products/getAll               |
| Search          | GET /api/products/searchByProduct/:q   |
| Add to Cart     | POST /api/products/addToCart/:id       |
| Get Cart        | GET /api/products/getCart              |
| Remove from Cart| DELETE /api/products/removeFromCart/:id|
| Checkout        | POST /api/products/confirmCart         |
| All Categories  | GET /api/categorys/getAll              |
| All Sellers     | GET /api/seller/getAll                 |
| Add Favorite    | PUT /api/products/addFavorite/:id      |
| Remove Favorite | PUT /api/products/removeFromFavorite/:id|

---

## Dark Mode

Dark mode `localStorage` mein save hota hai.
System preference bhi auto-detect hoti hai (prefers-color-scheme).
Tailwind's `darkMode: 'class'` use kiya hai — `.dark` class `<html>` pe toggle hoti hai.
Author :Anurag Mishra