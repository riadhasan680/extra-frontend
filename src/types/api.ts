export interface User {
  id: string;
  name?: string; // Optional as it might not be in the immediate auth response
  email: string;
  role: "admin" | "user";
  status?: "active" | "inactive" | "banned";
  avatarUrl?: string;
  createdAt?: string;
  
  // Backend specific fields
  commission_balance?: number;
  total_sales?: number;

  // Profile fields
  referral_code?: string;
  first_name?: string;
  last_name?: string;
}

export interface Image {
  id: string;
  url: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  price: number;
  options?: any[];
  product?: Product;
  prices?: {
    id: string;
    currency_code: string;
    amount: number;
  }[];
  metadata?: Record<string, any>;
}

export interface Product {
  id: string;
  title: string; // Changed from name to title per API
  subtitle?: string;
  description: string;
  price: number;
  commission_rate: number; // Changed from commissionRate per API
  status?: "active" | "draft" | "archived";
  imageUrl?: string;
  thumbnail?: string;
  images?: Image[];
  createdAt?: string;
  variants?: ProductVariant[];
  metadata?: Record<string, any>;
  
  // Legacy support during migration (optional)
  name?: string;
  commissionRate?: number;
}

export interface Order {
  id: string;
  productId: string;
  userId: string; // The affiliate who referred
  amount: number;
  commissionAmount: number;
  status: "pending" | "completed" | "refunded" | "canceled";
  createdAt: string;
}

export interface Wallet {
  id?: string; // Optional as backend might not return it
  balance: number;
  pending_balance?: number; // Backend field
  total_earnings?: number;
  currency_code: string;
  // UI compatibility (optional mapping)
  pendingBalance?: number;
  currency?: string;
}

export interface Commission {
  id: string;
  amount: number;
  order_id?: string;
  status: "pending" | "paid" | "rejected";
  created_at: string;
  affiliate?: User;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  method: "paypal" | "bank_transfer" | "crypto";
  status: "pending" | "approved" | "rejected";
  details: string; // Account details
  requestedAt: string;
  processedAt?: string;
}

export interface Payout {
  id: string;
  amount: number;
  status: "pending" | "processed" | "rejected";
  created_at: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  referral_code?: string; // Changed from referralCode
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Dashboard/Stats Types
export interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  commissionBalance: number;
  totalSales: number;
  
  // UI might still need these, will map or compute
  recentSales?: Order[];
}

export interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  
  // UI might need these
  activeAffiliates?: number;
  recentOrders?: Order[];
}

// API Response generic wrapper
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  errors?: any;
  // Some endpoints return T directly or wrapped
  [key: string]: any; 
}
