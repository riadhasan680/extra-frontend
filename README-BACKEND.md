# Backend Integration Guide - Stream Lifter

This project is the frontend for the Stream Lifter Affiliate Platform.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4
- **State/Auth**: Designed to be stateless (JWT based)
- **HTTP Client**: Axios (configured in `src/lib/api.ts`)

## 🔗 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

## 📂 Project Structure for Backend Devs

- `src/lib/api.ts`: Central Axios instance with interceptors.
- `src/types/api.ts`: TypeScript interfaces for all data models.
- `src/app/(auth)`: Login and Register pages.
- `src/app/dashboard`: User affiliate dashboard.
- `src/app/admin`: Admin management dashboard.

## 🚀 Key Integration Points

1.  **Authentication**:
    - The frontend expects a JWT token upon login.
    - Store logic is currently mocked. Implement actual token storage in `src/lib/api.ts`.
2.  **Data Fetching**:
    - Currently using mock data in `page.tsx` files.
    - Replace mock arrays with `api.get('/endpoint')` calls.
    - Use `swr` or `react-query` for better state management if needed.

3.  **Error Handling**:
    - Axios interceptor is set up to handle 401 (Unauthorized) errors.
