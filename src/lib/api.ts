import axios from "axios";
import Cookies from "js-cookie";

// Access environment variable or default to local Medusa backend
const rawMedusaUrl = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000";
export const MEDUSA_URL = rawMedusaUrl.replace(/\/$/, ""); // Ensure no trailing slash

export const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_PUBLISHABLE_API_KEY || "";

// Create Axios instance
const api = axios.create({
  baseURL: MEDUSA_URL,
  headers: {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_API_KEY,
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Clear auth and redirect to login if needed
      Cookies.remove("token");
      Cookies.remove("role");
      // Optional: window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;

// ==========================================
// Storefront API (Session-based, No Token)
// ==========================================

export async function getProducts() {
  const res = await fetch(`${MEDUSA_URL}/store/products`, {
    headers: {
      "x-publishable-api-key": PUBLISHABLE_API_KEY,
    },
  });
  return res.json();
}

export async function createCart() {
  const res = await fetch(`${MEDUSA_URL}/store/carts`, {
    method: "POST",
    credentials: "include",
    headers: {
      "x-publishable-api-key": PUBLISHABLE_API_KEY,
    },
  });
  return res.json();
}

export async function addToCart(cartId: string, variantId: string) {
  return fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
    method: "POST",
    credentials: "include",
    headers: { 
      "Content-Type": "application/json",
      "x-publishable-api-key": PUBLISHABLE_API_KEY,
    },
    body: JSON.stringify({ variant_id: variantId, quantity: 1 }),
  });
}

export async function completeCart(cartId: string) {
  return fetch(`${MEDUSA_URL}/store/carts/${cartId}/complete`, {
    method: "POST",
    credentials: "include",
    headers: {
      "x-publishable-api-key": PUBLISHABLE_API_KEY,
    },
  });
}

export async function getOrders() {
  return fetch(`${MEDUSA_URL}/store/orders`, {
    credentials: "include",
    headers: {
      "x-publishable-api-key": PUBLISHABLE_API_KEY,
    },
  }).then(res => res.json());
}
