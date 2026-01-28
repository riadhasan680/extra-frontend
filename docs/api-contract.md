# API Contract

This document outlines the expected API endpoints and response structures for the frontend-backend integration.

## 1. Authentication

### Login

- **Endpoint**: `POST /store/auth`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "customer": {
      "id": "cus_01...",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "metadata": {
        "role": "user" // 'user' | 'admin'
      }
    },
    "access_token": "..."
  }
  ```

### Register

- **Endpoint**: `POST /store/customers`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "metadata": {
      "referral_code": "OPTIONAL_REF_CODE"
    }
  }
  ```
- **Response**: (Same as Login user object)

### Get Current User

- **Endpoint**: `GET /store/customers/me`
- **Response**:
  ```json
  {
    "id": "cus_01...",
    "email": "user@example.com"
    // ...
  }
  ```

## 2. Products

### Get All Products

- **Endpoint**: `GET /store/products`
- **Response**:
  ```json
  {
    "products": [
      {
        "id": "prod_01...",
        "title": "Twitch Stream Promotion",
        "description": "...",
        "thumbnail": "https://...",
        "variants": [
          {
            "id": "variant_01",
            "title": "3 Streams",
            "prices": [
              {
                "amount": 3995, // in cents
                "currency_code": "usd"
              }
            ]
          }
        ]
      }
    ],
    "count": 10,
    "offset": 0,
    "limit": 20
  }
  ```

### Get Product by ID

- **Endpoint**: `GET /store/products/:id`

## 3. Orders & Cart

### Create Cart

- **Endpoint**: `POST /store/carts`
- **Response**:
  ```json
  {
    "cart": {
      "id": "cart_01...",
      "region_id": "reg_01..."
    }
  }
  ```

### Add to Cart

- **Endpoint**: `POST /store/carts/:id/line-items`
- **Body**:
  ```json
  {
    "variant_id": "variant_01...",
    "quantity": 1,
    "metadata": {
      "twitch_profile_link": "https://twitch.tv/johndoe"
    }
  }
  ```

### Complete Order

- **Endpoint**: `POST /store/carts/:id/complete`
- **Response**:
  ```json
  {
    "type": "order",
    "data": {
      "id": "ord_01...",
      "status": "pending"
    }
  }
  ```

### Get Customer Orders

- **Endpoint**: `GET /store/orders`
- **Response**:
  ```json
  {
    "orders": [
      {
        "id": "ord_01...",
        "display_id": 1024,
        "status": "pending",
        "fulfillment_status": "not_fulfilled",
        "payment_status": "awaiting",
        "total": 3995,
        "currency_code": "usd",
        "created_at": "2024-02-20T10:00:00Z",
        "items": [...]
      }
    ]
  }
  ```

## 4. Admin (Custom Backend Endpoints)

### Get All Orders (Admin)

- **Endpoint**: `GET /admin/orders`
- **Permissions**: Admin Only

### Get Dashboard Stats

- **Endpoint**: `GET /admin/stats`
- **Response**:
  ```json
  {
    "total_sales": 120000,
    "total_orders": 120,
    "total_products": 5,
    "total_users": 50
  }
  ```
