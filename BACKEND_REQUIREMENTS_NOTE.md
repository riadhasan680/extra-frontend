# Backend Developer Requirements for Extra Marketing Platform

## 🟢 Overview

We are building an affiliate marketing platform using **Next.js (Frontend)** and **Medusa.js (Backend)**. The frontend expects specific API endpoints to function correctly.

**Frontend Base URL:** `http://localhost:3000`
**Backend Base URL:** `http://localhost:9000` (Medusa default)

---

## 🛠 Required API Endpoints & Valid Response Structures

### 1. Authentication

**Middleware**: Verify JWT token from `Authorization: Bearer <token>` header.

#### `POST /store/auth/login`

- **Body**: `{ "email": "test@test.com", "password": "..." }`
- **Response**:

```json
{
  "token": "jwt_token_string",
  "user": {
    "id": "usr_123",
    "email": "test@test.com",
    "role": "user" // or "admin"
  }
}
```

#### `POST /store/auth/register`

- **Body**: `{ "email": "...", "password": "...", "name": "...", "referral_code": "optional" }`
- **Response**: Same as login.

#### `GET /store/auth/me`

- **Response**:

```json
{
  "user": {
    "id": "usr_123",
    "email": "test@test.com",
    "role": "user",
    "commission_balance": 150.0,
    "total_sales": 1200.0
  }
}
```

---

### 2. User Dashboard

#### `GET /store/dashboard/stats`

- **Response**:

```json
{
  "totalOrders": 12,
  "activeOrders": 2,
  "completedOrders": 10,
  "commissionBalance": 50.0,
  "totalSales": 500.0
}
```

#### `GET /store/dashboard/sales`

- **Query Params**: `page=1`, `limit=10`
- **Response**:

```json
{
  "orders": [
    {
      "id": "ord_1",
      "total": 39.99,
      "status": "completed",
      "created_at": "2024-01-26T10:00:00Z",
      "items": []
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "totalPages": 5
  }
}
```

---

### 3. Admin Dashboard (Admin Role Required)

#### `GET /admin/stats`

- **Response**:

```json
{
  "totalProducts": 24,
  "totalUsers": 145,
  "totalOrders": 350,
  "totalRevenue": 12500.0
}
```

#### `GET /admin/products`

- **Response**:

```json
{
  "products": [
    {
      "id": "prod_1",
      "title": "Twitch Stream Promotion",
      "description": "...",
      "variants": [{ "prices": [{ "amount": 3995, "currency_code": "usd" }] }],
      "metadata": {
        "commission_rate": 20,
        "status": "active"
      }
    }
  ]
}
```

#### `POST /admin/products`

- **Body**: `{ "title": "...", "description": "...", "price": 2999, "commission_rate": 15 }`
- **Note**: Price is in cents (2999 = $29.99).

#### `DELETE /admin/products/:id`

- **Response**: `{ "success": true }`

---

## 🗄️ Database Schema Updates (Important)

You MUST extend the default Medusa `User` entity to include:

1. `role`: Enum ('user', 'admin') - Default 'user'
2. `commission_balance`: Decimal/Float - Default 0.00
3. `total_sales`: Decimal/Float - Default 0.00
4. `referral_code`: String (Unique, Nullable)

---

## 🚀 Integration Check

- Ensure CORS is configured to allow `http://localhost:3000`.
- Ensure JWT secret matches between services (if applicable).
- Test all endpoints with Postman before handing over.
