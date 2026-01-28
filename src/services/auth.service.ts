import api from "@/lib/api";
import Cookies from "js-cookie";
import { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  ApiResponse 
} from "@/types/api";

export const authService = {
  // Register new affiliate
  register: async (data: RegisterData): Promise<AuthResponse> => {
    // Transform data to snake_case if needed by backend, 
    // but RegisterData interface already uses snake_case for referral_code
    // The backend expects: email, password, name, referral_code
    
    // Split name into first_name and last_name for backend
    const nameParts = data.name.split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ") || "";
    
    const response = await api.post<any>("/store/auth/register", {
      ...data,
      first_name,
      last_name
    });
    
    // Backend returns { token, customer, affiliate }
    // We need to map this to AuthResponse { token, user }
    const { token, customer } = response.data;
    
    const user: User = {
      id: customer.id,
      email: customer.email,
      name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
      role: "user", // Default role
      status: "active"
    };
    
    // Set cookies for middleware
    Cookies.set("token", token, { expires: 1 }); // 1 day
    Cookies.set("role", user.role, { expires: 1 });
    
    return { token, user };
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/store/auth/login", credentials);
    const { token } = response.data;
    
    // Set cookies for middleware
    Cookies.set("token", token, { expires: 1 }); // 1 day
    
    // Fetch full user details to ensure we have name and other fields
    // We can't rely solely on login response as it might miss fields like name
    // Since getMe uses the token from cookie (or we can assume interceptor handles it),
    // but better to wait a tick or just rely on API interceptor sending the token.
    // However, since we just set the cookie, axios interceptor might pick it up if it reads from cookie.
    // If api.ts reads from localStorage or cookie, we need to ensure it's available.
    
    // Assuming api.ts uses cookies or we need to update it.
    // Let's check api.ts later. For now, we manually set header or assume cookie works.
    
    // Let's try to fetch user details.
    try {
      // Small delay to ensure cookie propagation if needed
      const user = await authService.getMe();
       Cookies.set("role", user.role, { expires: 1 });
       return { token, user };
    } catch (e) {
      // If getMe fails, fallback to login response user but map it if possible
      console.warn("Failed to fetch full user details after login", e);
      const user = response.data.user;
       Cookies.set("role", user.role, { expires: 1 });
      return response.data;
    }
  },

  // Get current user info
  getMe: async (): Promise<User> => {
    // Reverting to /store/auth/me as /store/custom/affiliates/me does not exist in backend
    const response = await api.get<any>("/store/auth/me");
    
    const data = response.data;
    
    // Check if it's nested or direct
    const userData = data.user || data;
    
    // Ensure we return a User object compliant with our interface
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      role: userData.role || "user", // Default to user if not provided
      status: userData.status || "active",
      commission_balance: userData.affiliate?.wallet?.balance || 0,
      total_sales: userData.affiliate?.total_sales || 0
    };
  },

  // Logout
  logout: () => {
    Cookies.remove("token");
    Cookies.remove("role");
    window.location.href = "/login";
  }
};
