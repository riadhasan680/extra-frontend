# API Endpoints Mapping

This document outlines the expected API endpoints for the Extra Marketing frontend.

## 🔐 Authentication

| Method | Endpoint         | Description       | Request Body                            | Response        |
| :----- | :--------------- | :---------------- | :-------------------------------------- | :-------------- |
| `POST` | `/auth/login`    | User login        | `{email, password}`                     | `{token, user}` |
| `POST` | `/auth/register` | User registration | `{name, email, password, referralCode}` | `{token, user}` |
| `GET`  | `/auth/me`       | Get current user  | -                                       | `{user}`        |

## 👤 User Dashboard

| Method | Endpoint              | Description                  | Query Params                | Response                                       |
| :----- | :-------------------- | :--------------------------- | :-------------------------- | :--------------------------------------------- |
| `GET`  | `/dashboard/stats`    | Get dashboard overview stats | -                           | `{totalSales, totalCommission, walletBalance}` |
| `GET`  | `/dashboard/sales`    | Get sales history            | `?page=1&limit=10`          | `{orders: [], meta: {}}`                       |
| `GET`  | `/dashboard/wallet`   | Get wallet details & history | -                           | `{balance, transactions: []}`                  |
| `POST` | `/dashboard/withdraw` | Request withdrawal           | `{amount, method, details}` | `{id, status}`                                 |

## 🛡 Admin Dashboard

| Method   | Endpoint              | Description          | Query Params                | Response                            |
| :------- | :-------------------- | :------------------- | :-------------------------- | :---------------------------------- |
| `GET`    | `/admin/stats`        | Admin overview stats | -                           | `{users, products, sales, revenue}` |
| `GET`    | `/admin/users`        | List all users       | `?page=1&role=user`         | `{users: []}`                       |
| `PATCH`  | `/admin/users/:id`    | Update user status   | `{status}`                  | `{user}`                            |
| `GET`    | `/admin/products`     | List all products    | -                           | `{products: []}`                    |
| `POST`   | `/admin/products`     | Create new product   | `{name, price, commission}` | `{product}`                         |
| `PUT`    | `/admin/products/:id` | Update product       | `{...fields}`               | `{product}`                         |
| `DELETE` | `/admin/products/:id` | Archive product      | -                           | `{success: true}`                   |
