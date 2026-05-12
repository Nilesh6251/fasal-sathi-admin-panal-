# 🌾 Fasal Sathi - Backend API

> AI-Powered Agriculture Platform for Indian Farmers

## 📋 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (via Prisma ORM)
- **Auth:** JWT + bcryptjs
- **AI:** Google Gemini API
- **File Upload:** Multer
- **Security:** Helmet, CORS, Rate Limiting

---

## 🚀 Quick Setup (Terminal Commands)

```bash
# 1. Go to backend folder
cd backend

# 2. Install all dependencies
npm install

# 3. Generate Prisma client
npx prisma generate

# 4. Run database migration (creates SQLite database)
npx prisma migrate dev --name init

# 5. Seed database with default data
node prisma/seed.js

# 6. Start development server
npm run dev
```

Server runs at: **http://localhost:5000**

---

## 🔑 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| SuperAdmin | admin@fasalsathi.com | admin123 |
| Moderator | moderator@fasalsathi.com | mod123 |
| Farmer | farmer@fasalsathi.com | farmer123 |

---

## 📁 Folder Structure

```
backend/
├── prisma/
│   ├── schema.prisma      # Database models (14 tables)
│   └── seed.js             # Default data seeder
├── config/
│   ├── index.js            # Centralized config from .env
│   └── database.js         # Prisma client singleton
├── controllers/
│   ├── authController.js       # Login, Signup, JWT
│   ├── userController.js       # User management (Admin)
│   ├── sellerController.js     # Seller management
│   ├── productController.js    # Marketplace products
│   ├── orderController.js      # Order system
│   ├── chatController.js       # Gemini AI Chatbot
│   ├── schemeController.js     # Government schemes
│   ├── mandiController.js      # Mandi bhav prices
│   ├── newsController.js       # Agriculture news
│   ├── notificationController.js # Push notifications
│   ├── weatherController.js    # Weather logs/alerts
│   ├── reviewController.js     # Ratings & reviews
│   ├── supportController.js    # Support tickets
│   ├── analyticsController.js  # Dashboard analytics
│   └── reportController.js     # Reports
├── middleware/
│   ├── auth.js             # JWT verification + role guards
│   ├── errorHandler.js     # Global error handling
│   ├── upload.js           # Multer file uploads
│   └── validate.js         # Request validation
├── routes/
│   ├── index.js            # Central route mounting
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── sellerRoutes.js
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   ├── chatRoutes.js
│   ├── schemeRoutes.js
│   ├── mandiRoutes.js
│   ├── newsRoutes.js
│   ├── notificationRoutes.js
│   ├── weatherRoutes.js
│   ├── reviewRoutes.js
│   ├── supportRoutes.js
│   ├── analyticsRoutes.js
│   └── reportRoutes.js
├── utils/
│   ├── apiResponse.js      # Standardized JSON responses
│   └── helpers.js          # Pagination, sanitization helpers
├── uploads/                # File upload directory
├── logs/                   # Server logs
├── server.js               # Main Express server
├── package.json
├── .env                    # Environment variables
└── .gitignore
```

---

## 🔌 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | ❌ | Register new user |
| POST | `/login` | ❌ | Login (returns JWT) |
| POST | `/admin-login` | ❌ | Admin panel login |
| GET | `/me` | ✅ | Get current user |
| PUT | `/update-profile` | ✅ | Update profile + image |
| PUT | `/change-password` | ✅ | Change password |
| POST | `/logout` | ✅ | Logout |

### Users (`/api/users`) - Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all users (paginated, search, filter) |
| GET | `/:id` | Get user details |
| PUT | `/:id` | Update user |
| DELETE | `/:id` | Delete user (SuperAdmin) |
| PUT | `/:id/block` | Block/Unblock user |

### Sellers (`/api/sellers`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/register` | ✅ | Register as seller |
| GET | `/` | Admin | List all sellers |
| GET | `/:id` | ❌ | Seller details |
| PUT | `/:id/approve` | Admin | Approve/reject seller |
| PUT | `/profile` | ✅ | Update seller profile |

### Products (`/api/products`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ Seller | Create product (with images) |
| GET | `/` | ❌ | List products (search, filter, sort) |
| GET | `/my` | ✅ | My products (seller) |
| GET | `/:id` | ❌ | Product details |
| PUT | `/:id` | ✅ | Update product |
| DELETE | `/:id` | ✅ | Delete product |

### Orders (`/api/orders`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Place order |
| GET | `/my` | ✅ | My orders |
| GET | `/` | Admin | All orders |
| GET | `/:id` | ✅ | Order details |
| PUT | `/:id/status` | Admin | Update order status |

### Chat (`/api/chat`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/send` | ✅ | Send message to AI |
| GET | `/history` | ✅ | Chat history |
| GET | `/all` | Admin | All chats |
| GET | `/analytics` | Admin | Chat analytics |
| DELETE | `/user/:userId` | Admin | Delete user chats |

### Government Schemes (`/api/schemes`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Admin | Create scheme (+PDF) |
| GET | `/` | ❌ | List schemes (filter by state) |
| GET | `/:id` | ❌ | Scheme details |
| PUT | `/:id` | Admin | Update scheme |
| DELETE | `/:id` | Admin | Delete scheme |

### Mandi Bhav (`/api/mandi`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Admin | Add price |
| POST | `/bulk` | Admin | Bulk add prices |
| GET | `/` | ❌ | Get prices (filter) |
| GET | `/analytics` | ❌ | Price analytics |
| DELETE | `/:id` | Admin | Delete price |

### News (`/api/news`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Admin | Create news (+image/video) |
| GET | `/` | ❌ | List news |
| GET | `/:id` | ❌ | News details (tracks views) |
| PUT | `/:id` | Admin | Update news |
| DELETE | `/:id` | Admin | Delete news |

### Notifications (`/api/notifications`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | Admin | Send notification |
| POST | `/bulk` | Admin | Bulk send (by role/state) |
| GET | `/my` | ✅ | My notifications |
| PUT | `/:id/read` | ✅ | Mark as read |
| PUT | `/read-all` | ✅ | Mark all as read |
| GET | `/` | Admin | All notifications |
| DELETE | `/:id` | Admin | Delete notification |

### Weather (`/api/weather`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Log weather data |
| GET | `/` | Get weather logs |
| GET | `/alerts` | Get weather alerts |

### Reviews (`/api/reviews`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create review |
| GET | `/product/:productId` | ❌ | Product reviews |
| DELETE | `/:id` | ✅ | Delete review |
| PUT | `/:id/visibility` | Admin | Toggle visibility |

### Support (`/api/support`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/` | ✅ | Create ticket |
| GET | `/my` | ✅ | My tickets |
| GET | `/` | Admin | All tickets |
| GET | `/:id` | ✅ | Ticket details |
| PUT | `/:id/reply` | Admin | Reply to ticket |
| DELETE | `/:id` | Admin | Delete ticket |

### Analytics (`/api/analytics`) - Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Dashboard stats |
| GET | `/users` | User analytics |
| GET | `/revenue` | Revenue analytics |
| GET | `/chatbot` | Chatbot analytics |
| GET | `/sellers` | Seller analytics |

### Reports (`/api/reports`) - Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Generate report |
| GET | `/` | List reports |
| GET | `/:id` | Report details |
| DELETE | `/:id` | Delete report |

---

## 🧪 API Testing Examples

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fasalsathi.com","password":"admin123"}'
```

### Authenticated Request
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ⚙️ Environment Variables (.env)

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| DATABASE_URL | SQLite database path | file:./dev.db |
| JWT_SECRET | JWT signing secret | (change in production!) |
| JWT_EXPIRES_IN | Token expiry | 7d |
| GEMINI_API_KEY | Google Gemini API key | (optional) |
| CORS_ORIGIN | Allowed origins | localhost |

---

## 🔧 Useful Commands

```bash
# Start dev server with auto-reload
npm run dev

# Start production server
npm start

# Open Prisma Studio (visual DB editor)
npx prisma studio

# Reset database
npx prisma migrate reset

# View database schema
npx prisma db pull
```

---

## 📱 Frontend Compatibility

This backend is designed to work with:
- **React Native Expo** (Mobile App)
- **Next.js** (Admin Panel)
- **Any REST client** (Postman, Insomnia)

All APIs return consistent JSON:
```json
{
  "success": true,
  "message": "Success",
  "data": { ... },
  "pagination": { "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
}
```
