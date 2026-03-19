# 🛍️ Nexova — Full-Stack E-Commerce Platform

> A production-grade full-stack e-commerce application built with **React.js** (Frontend) and **Spring Boot / Java** (Backend), featuring JWT authentication, real-time order tracking, automated email notifications, cart management, promo codes, and a seller dashboard.

---

## 📁 Project Structure

```
online-shopping-cart/
├── src/                          ← React Frontend
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthModal.jsx          ← Login + Register modal (JWT)
│   │   ├── cart/
│   │   │   └── CartSidebar.jsx        ← Slide-in cart with item list
│   │   ├── checkout/
│   │   │   └── CheckoutModal.jsx      ← 4-step checkout → confirmCart API
│   │   ├── common/
│   │   │   ├── Hero.jsx               ← Homepage hero banner
│   │   │   ├── StatsBar.jsx           ← Stats cards (products, sellers)
│   │   │   └── DemoBanner.jsx         ← Shown when backend is offline
│   │   ├── layout/
│   │   │   ├── Navbar.jsx             ← Top nav: search, cart, dark mode
│   │   │   ├── CategoryBar.jsx        ← Filter tabs (Electronics, Mobile…)
│   │   │   └── Footer.jsx
│   │   ├── orders/
│   │   │   └── OrderTracker.jsx       ← Track orders + cancel + history
│   │   └── product/
│   │       ├── ProductCard.jsx
│   │       ├── ProductGrid.jsx
│   │       └── ProductModal.jsx
│   ├── context/
│   │   ├── AuthContext.jsx            ← User + JWT token global state
│   │   ├── CartContext.jsx            ← Cart global state
│   │   └── ToastContext.jsx           ← Toast notifications
│   ├── hooks/
│   │   └── useProducts.js             ← Fetch + filter products
│   ├── pages/
│   │   └── HomePage.jsx
│   ├── services/
│   │   └── api.js                     ← All backend API calls (Axios)
│   └── utils/
│       └── imageHelper.js             ← Unsplash-based product images
├── public/
│   └── index.html
|--vercel.json 
 Backend-backend-nexova/                ← Spring Boot Backend
│   └── src/main/java/com/eCommerceProject/
│       ├── api/                       ← REST Controllers
│       ├── model/                     ← JPA Entities
│       ├── repository/                ← Spring Data Repositories
│       ├── service/                   ← Business Logic
│       │   └── scheduler/
│       │       └── DeliverySchedulerService.java  ← Auto order progression
│       ├── shared/
│       │   └── ECommerceMessage.java  ← Email templates
│       └── ECommerceProjectApplication.java
├── package.json
├── tailwind.config.js
├── postcss.config.js                        
└── README.md
```

---

## ⚙️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js | UI Framework |
| Tailwind CSS | Styling |
| Axios | HTTP Client |
| React Context API | State Management |

### Backend
| Technology | Purpose |
|-----------|---------|
| Spring Boot 2.7.18 | Backend Framework |
| Spring Security + JWT | Authentication & Authorization |
| JPA / Hibernate | ORM & Database Layer |
| JavaMail (SMTP) | Email Notifications |
| MySQL / H2 | Database |
| Lombok 1.18.30 | Boilerplate Reduction |
| Maven | Build Tool |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Java 17 (recommended) — **do NOT use Java 25 with Spring Boot 2.7.x**
- MySQL 8.x (local) or Aiven MySQL (cloud)
- Maven

---

## 🖥️ Frontend Setup

```bash
# 1. Clone the repo
git clone https://github.com/Divyanshutiwari102/online-shopping-cart.git
cd online-shopping-cart

# 2. Install dependencies
npm install

# 3. Install Tailwind (if not already)
npm install -D tailwindcss postcss autoprefixer

# 4. Start development server
npm start
```

> Frontend runs on **http://localhost:3000**  
> If backend is offline, app auto-switches to **demo mode** with 12 sample products.

---

## 🔧 Backend Setup

### Option A — Local MySQL

```bash
cd ecommerce-backend
```

Edit `src/main/resources/application.properties`:

```properties
# MySQL Configuration (Local)
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.show-sql=true
spring.jpa.hibernate.ddl-auto=update

server.port=8080

eCommerce.app.secret=mySecretKey2024@eCommerce#Secure!XYZ
eCommerce.expires.in=86400000

spring.mail.protocol=smtp
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_GMAIL@gmail.com
spring.mail.password=YOUR_APP_PASSWORD
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

command.line.runner.enable=false

logging.file.name=log.txt
logging.level.root=INFO
logging.level.com.eCommerceProject=DEBUG
```

Create the database first:
```sql
CREATE DATABASE IF NOT EXISTS ecommerce;
```

Run the backend:
```bash
./mvnw spring-boot:run
```

> ✅ Spring Boot auto-creates all tables via `ddl-auto=update`

---

### Option B — Aiven Cloud MySQL

```properties
spring.datasource.url=jdbc:mysql://YOUR_HOST:YOUR_PORT/defaultdb?useSSL=true&requireSSL=true&verifyServerCertificate=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=avnadmin
spring.datasource.password=YOUR_AIVEN_PASSWORD
```

> Get credentials from **Aiven Console → Services → Your Service → Overview**

---

## 🌐 REST API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register + welcome email |
| `POST` | `/api/auth/login` | Login → JWT Bearer token |
| `DELETE` | `/api/auth/deleteByUser` | Delete account |
| `GET` | `/api/products/getAll` | All products |
| `GET` | `/api/products/searchByProduct/:q` | Search products |
| `POST` | `/api/products/addToCart/:id` | Add to cart, stock-- |
| `GET` | `/api/products/getCart` | Get cart items |
| `DELETE` | `/api/products/removeFromCart/:id` | Remove from cart |
| `POST` | `/api/products/confirmCart` | Checkout → create order + email |
| `GET` | `/api/products/getAllConfirmedCart` | All orders (current user) |
| `GET` | `/api/products/getConfirmedOrderByOrderNumber/:n` | Track order by number |
| `DELETE` | `/api/products/cancelOrder/:orderNumber` | Cancel order + restore stock + email |
| `PUT` | `/api/products/updateOrderStatus/:n?status=` | Admin: update order stage |
| `PUT` | `/api/products/addFavorite/:id` | Add to favorites |
| `PUT` | `/api/products/removeFromFavorite/:id` | Remove from favorites |
| `GET` | `/api/categorys/getAll` | All categories |
| `GET` | `/api/seller/getAll` | All sellers |
| `POST` | `/api/address/add` | Add delivery address |
| `POST` | `/api/promo-code/create-code` | Create promo code |

> All protected endpoints require `Authorization: Bearer <token>` header

---

## ✨ Key Features

### 🔐 Authentication
- JWT-based login & register
- Token stored in `localStorage`
- Auto-attach to every Axios request via interceptor
- Welcome email on register, login alert email on each login

### 🛒 Cart System
- Add/remove products
- Live total calculation
- Promo code support
- Stock auto-decrements on add to cart

### 📦 Order Tracking
- Real-time status: `CONFIRMED → PROCESSING → SHIPPED → DELIVERED`
- Track by order number
- Full order history tab
- Delivery status auto-progresses every 2 days via background scheduler

### ❌ Order Cancellation
- Cancel any non-delivered order
- Stock automatically restored on cancel
- Cancellation email sent to customer

### 📧 Email Notifications
| Trigger | Email Subject |
|---------|--------------|
| Register | Welcome To Nexova 😍 |
| Login | New Login Detected! |
| Order Placed | 📦 Order Confirmed - Nexova |
| Order Cancelled | ❌ Order Cancelled - Nexova |
| Account Deleted | We're Sorry To See You Go 😔 |

> Note: Delivery stage changes happen silently in DB — no email spam. User sees updated status when they check the Order Tracker.

### 🏪 Seller Dashboard
- Add/manage products per seller
- Campaign creation (bulk price discount)
- Price increase management

### 📍 Address Manager
- Multiple saved addresses
- Home delivery vs Store pickup options

### ⏰ Auto Delivery Scheduler
- Runs every 6 hours
- Silently progresses order stages in DB
- `CONFIRMED → PROCESSING` (day 2)
- `PROCESSING → SHIPPED` (day 4)
- `SHIPPED → DELIVERED` (day 6)

### 🌙 Dark Mode
- Saved to `localStorage`
- System preference auto-detected (`prefers-color-scheme`)
- Tailwind `darkMode: 'class'` — `.dark` on `<html>`

---

## 🚢 Deployment

### Frontend — Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import repo
3. Set these in Vercel dashboard:

| Field | Value |
|-------|-------|
| Framework Preset | `Create React App` |
| Root Directory | `./` |
| Build Command | `npm run build` |
| Output Directory | `build` |
| Install Command | `npm install` |

4. Add `vercel.json` to root:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "installCommand": "npm install",
  "framework": "create-react-app"
}
```

5. Add Environment Variable in Vercel:
```
REACT_APP_API_URL = https://your-backend-url.com
```

6. In `src/services/api.js`:
```js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080'
```

### Backend — Local / Any Java Host

```bash
cd ecommerce-backend
./mvnw spring-boot:run
```

Or build JAR:
```bash
./mvnw clean package -DskipTests
java -jar target/eCommerceProject-0.0.1-SNAPSHOT.jar
```

---

## 🐛 Common Issues & Fixes

| Error | Fix |
|-------|-----|
| `TypeTag :: UNKNOWN` | Java version mismatch — use Java 17, not Java 21/25 |
| `react-scripts: command not found` | Run `npm install` first, or add `vercel.json` |
| `SSL connection required` (Aiven) | Add `verifyServerCertificate=false` to datasource URL |
| `ClassNotFoundException: ECommerceProjectApplication` | Don't run class directly — use `mvnw spring-boot:run` |
| Build fails on Vercel | Check Root Directory is `./` and `vercel.json` exists |

---

## 🔒 Security Notes

- Change `eCommerce.app.secret` in production to a strong random string
- Use Gmail **App Password** (not account password) for `spring.mail.password`
- Never commit real passwords to GitHub — use environment variables in production
- Aiven password visible in this repo should be rotated after testing

---

