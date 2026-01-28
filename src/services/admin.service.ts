import api from "@/lib/api";
import { 
  AdminStats, 
  Product, 
  Commission,
  ApiResponse 
} from "@/types/api";

export const adminService = {
  // Admin overview stats
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get<AdminStats>("/platform/stats");
    return response.data;
  },

  // List all products
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>("/platform/products");
    return response.data;
  },

  // Create a new product
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    // Map frontend fields to backend expected fields if needed
    const payload = {
      title: data.title || data.name,
      description: data.description,
      price: data.price,
      commission_rate: data.commission_rate || data.commissionRate,
      // Include other fields if backend accepts them, but docs only list these
    };
    
    const response = await api.post<Product>("/platform/products", payload);
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: string): Promise<boolean> => {
    const response = await api.delete<{ deleted: boolean }>(`/platform/products/${id}`);
    return response.data.deleted;
  },

  // Manage Commissions
  getCommissions: async (): Promise<Commission[]> => {
    const response = await api.get<{ commissions: Commission[] }>("/platform/commissions");
    return response.data.commissions;
  }
};
