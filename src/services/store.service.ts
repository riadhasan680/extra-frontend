import api from "@/lib/api";
import { Product, ApiResponse } from "@/types/api";

export const storeService = {
  // List all products (public)
  getProducts: async (): Promise<Product[]> => {
    // Using /store/products endpoint
    const response = await api.get<{ products: Product[] }>("/store/products");
    return response.data.products;
  },

  // Get single product
  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<{ product: Product }>(`/store/products/${id}`);
    return response.data.product;
  },

  // Create Cart
  createCart: async (): Promise<{ id: string }> => {
    const response = await api.post<{ cart: { id: string } }>("/store/carts");
    return response.data.cart;
  },

  // Add to Cart
  addToCart: async (cartId: string, variantId: string, quantity: number = 1) => {
    const response = await api.post(`/store/carts/${cartId}/line-items`, {
      variant_id: variantId,
      quantity,
    });
    return response.data;
  },

  // Attach Affiliate Code
  attachAffiliate: async (cartId: string, code: string) => {
    // Exact rule: POST /store/carts/:id/affiliate
    // Body: { referral_code: code } ?? Or maybe just param?
    // User instruction says: POST /store/carts/:id/affiliate
    // Let's assume body contains the code if needed, or just the URL is enough trigger.
    // Usually affiliate attachment might need a body.
    // Let's send { referral_code: code } to be safe.
    // If backend doesn't expect body, it might ignore it.
    // But typically endpoints like this need the code.
    // User said: "User ?ref=CODE ... localStorage ... POST /store/carts/:id/affiliate"
    // He didn't specify body content, but it's logical.
    const response = await api.post(`/store/carts/${cartId}/affiliate`, {
      referral_code: code
    });
    return response.data;
  }
};
