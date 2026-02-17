# Medusa Backend Integration Guide - Stream Lifter

## 📋 Overview

This document outlines the complete backend requirements and Medusa integration steps for the Stream Lifter Affiliate Platform.

---

## 🎯 Backend Requirements

### 1. **Medusa.js Setup**

#### Installation & Configuration

```bash
# Create new Medusa project
npx create-medusa-app@latest

# Or add to existing project
npm install @medusajs/medusa
npm install @medusajs/admin
```

#### Required Medusa Plugins

```json
{
  "dependencies": {
    "@medusajs/medusa": "^1.20.0",
    "@medusajs/admin": "^7.1.0",
    "@medusajs/cache-redis": "^1.8.0",
    "@medusajs/event-bus-redis": "^1.8.0",
    "@medusajs/file-local": "^1.0.0",
    "medusa-fulfillment-manual": "^1.1.37",
    "medusa-interfaces": "^1.3.7",
    "medusa-payment-manual": "^1.0.23",
    "medusa-payment-stripe": "^6.0.0",
    "typeorm": "^0.3.16"
  }
}
```

---

## 🔐 Authentication System

### Custom User Roles Extension

Create `src/models/user.ts`:

```typescript
import { Column, Entity } from "typeorm";
import { User as MedusaUser } from "@medusajs/medusa";

@Entity()
export class User extends MedusaUser {
  @Column({ type: "enum", enum: ["user", "admin"], default: "user" })
  role: "user" | "admin";

  @Column({ nullable: true })
  referral_code?: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  commission_balance: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total_sales: number;
}
```

### Authentication Endpoints

#### 1. Register Endpoint

**File**: `src/api/routes/auth/register.ts`

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";

export default async (req: MedusaRequest, res: MedusaResponse) => {
  const { email, password, name, referral_code } = req.body;

  const manager: EntityManager = req.scope.resolve("manager");
  const userService = req.scope.resolve("userService");

  try {
    // Check if user exists
    const existingUser = await userService.retrieveByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await userService.create({
      email,
      password,
      first_name: name,
      role: "user",
      referral_code: referral_code || null,
    });

    // Generate JWT token
    const token = await userService.generateToken(user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### 2. Login Endpoint

**File**: `src/api/routes/auth/login.ts`

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export default async (req: MedusaRequest, res: MedusaResponse) => {
  const { email, password } = req.body;

  const authService = req.scope.resolve("authService");
  const userService = req.scope.resolve("userService");

  try {
    const result = await authService.authenticate(email, password);

    if (!result.success) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = await userService.retrieve(result.user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      token: result.token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### 3. Get Current User

**File**: `src/api/routes/auth/me.ts`

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export default async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const userService = req.scope.resolve("userService");

  try {
    const user = await userService.retrieve(userId);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        commission_balance: user.commission_balance,
        total_sales: user.total_sales,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## 📊 Dashboard APIs

### User Dashboard

#### 1. Dashboard Stats

**File**: `src/api/routes/dashboard/stats.ts`

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export default async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.user?.id;

  const orderService = req.scope.resolve("orderService");
  const userService = req.scope.resolve("userService");

  try {
    const user = await userService.retrieve(userId);
    const orders = await orderService.list({ customer_id: userId });

    const totalOrders = orders.length;
    const activeOrders = orders.filter((o) => o.status === "pending").length;
    const completedOrders = orders.filter(
      (o) => o.status === "completed"
    ).length;

    res.json({
      totalOrders,
      activeOrders,
      completedOrders,
      commissionBalance: user.commission_balance,
      totalSales: user.total_sales,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### 2. Sales History

**File**: `src/api/routes/dashboard/sales.ts`

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export default async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.user?.id;
  const { page = 1, limit = 10 } = req.query;

  const orderService = req.scope.resolve("orderService");

  try {
    const [orders, count] = await orderService.listAndCount(
      { customer_id: userId },
      {
        skip: (page - 1) * limit,
        take: limit,
        order: { created_at: "DESC" },
      }
    );

    res.json({
      orders: orders.map((order) => ({
        id: order.id,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        items: order.items,
      })),
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

### Admin Dashboard

#### 1. Admin Stats

**File**: `src/api/routes/admin/stats.ts`

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export default async (req: MedusaRequest, res: MedusaResponse) => {
  // Check if user is admin
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const productService = req.scope.resolve("productService");
  const userService = req.scope.resolve("userService");
  const orderService = req.scope.resolve("orderService");

  try {
    const products = await productService.list({});
    const users = await userService.list({});
    const orders = await orderService.list({});

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    res.json({
      totalProducts: products.length,
      totalUsers: users.length,
      totalOrders: orders.length,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### 2. Manage Users

**File**: `src/api/routes/admin/users.ts`

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// GET /admin/users
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const userService = req.scope.resolve("userService");
  const { page = 1, limit = 10, role } = req.query;

  try {
    const filter = role ? { role } : {};
    const [users, count] = await userService.listAndCount(filter, {
      skip: (page - 1) * limit,
      take: limit,
    });

    res.json({
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        total_sales: user.total_sales,
        commission_balance: user.commission_balance,
        created_at: user.created_at,
      })),
      meta: {
        total: count,
        page,
        limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /admin/users/:id
export const PATCH = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { id } = req.params;
  const { status, role } = req.body;

  const userService = req.scope.resolve("userService");

  try {
    const user = await userService.update(id, { status, role });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

#### 3. Manage Products

**File**: `src/api/routes/admin/products.ts`

```typescript
import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

// GET /admin/products
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const productService = req.scope.resolve("productService");

  try {
    const products = await productService.list({});

    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /admin/products
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const productService = req.scope.resolve("productService");
  const { title, description, price, commission_rate } = req.body;

  try {
    const product = await productService.create({
      title,
      description,
      variants: [
        {
          title: "Default",
          prices: [{ amount: price, currency_code: "usd" }],
        },
      ],
      metadata: {
        commission_rate,
      },
    });

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /admin/products/:id
export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { id } = req.params;
  const productService = req.scope.resolve("productService");

  try {
    await productService.delete(id);

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## 🔧 Middleware Configuration

**File**: `src/api/middlewares/authenticate.ts`

```typescript
import {
  MedusaRequest,
  MedusaResponse,
  MedusaNextFunction,
} from "@medusajs/medusa";
import jwt from "jsonwebtoken";

export default async (
  req: MedusaRequest,
  res: MedusaResponse,
  next: MedusaNextFunction
) => {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
```

---

## 🗄️ Database Schema

### Required Tables

1. **users** (Extended from Medusa)
   - id
   - email
   - password_hash
   - role (enum: 'user', 'admin')
   - referral_code
   - commission_balance
   - total_sales
   - created_at
   - updated_at

2. **products** (Medusa default)
   - id
   - title
   - description
   - metadata (includes commission_rate)
   - created_at
   - updated_at

3. **orders** (Medusa default)
   - id
   - customer_id
   - total
   - status
   - created_at
   - updated_at

4. **commissions** (Custom)
   - id
   - user_id
   - order_id
   - amount
   - status (pending, paid)
   - created_at

---

## 🚀 Deployment Checklist

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/medusa_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Admin
ADMIN_CORS=http://localhost:7001

# Store
STORE_CORS=http://localhost:3000

# Stripe (if using)
STRIPE_API_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Required Services

- PostgreSQL database
- Redis server
- Node.js 18+
- npm or yarn

### Installation Steps

```bash
# 1. Install dependencies
npm install

# 2. Run migrations
npx medusa migrations run

# 3. Create admin user
npx medusa user -e admin@admin.com -p supersecret

# 4. Start development server
npm run dev

# 5. Start admin panel
npm run start:admin
```

---

## 📱 Frontend Integration

### Update API Client

**File**: `src/lib/medusa.ts`

```typescript
import Medusa from "@medusajs/medusa-js";

export const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000";

export const medusaClient = new Medusa({ baseUrl: MEDUSA_URL, maxRetries: 3 });
```

### Update Auth Context

**File**: `src/context/auth-context.tsx`

```typescript
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { medusaClient } from "@/lib/medusa";

interface User {
  id: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const response = await fetch(`${MEDUSA_URL}/store/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("auth_token");
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const response = await fetch(`${MEDUSA_URL}/store/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await fetch(`${MEDUSA_URL}/store/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    if (data.token) {
      localStorage.setItem("auth_token", data.token);
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
```

---

## ✅ Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] JWT token is stored and sent with requests
- [ ] Protected routes check authentication
- [ ] Admin routes check role
- [ ] Dashboard stats load correctly
- [ ] Products CRUD operations work
- [ ] Orders are created correctly
- [ ] Commission calculation works

---

## 📚 Additional Resources

- [Medusa Documentation](https://docs.medusajs.com/)
- [Medusa API Reference](https://docs.medusajs.com/api/store)
- [Next.js + Medusa Starter](https://github.com/medusajs/nextjs-starter-medusa)

---

**Last Updated**: January 26, 2026
