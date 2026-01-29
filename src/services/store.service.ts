import api from "@/lib/api";
import { Product, ApiResponse } from "@/types/api";

export const storeService = {
  // List all products (public)
  getProducts: async (): Promise<Product[]> => {
    try {
      // Medusa Store API: Fetch products with specific metadata and expanded relations
      // NOTE: We use 'fields' because 'expand' and 'metadata' params cause 400 Bad Request in Medusa v2
      const response = await api.get<{ products: Product[] }>("/store/products", {
        params: {
          fields: "id,title,subtitle,description,handle,thumbnail,metadata,*variants,*variants.prices,*images"
        }
      });
      
      let products = response.data.products;
      
      // Filter by metadata in client-side since API rejected metadata param
      if (products) {
         products = products.filter(p => p.metadata && p.metadata.ui_style === 'extra-life');
      }
      
      // Strict Mode: Return exactly what API gives.
      if (!products) {
        return [];
      }

      return products;
    } catch (error) {
      console.error("API failed to fetch products", error);
      throw error;
    }
  },

  // Get single product by ID or Handle
  getProduct: async (idOrHandle: string): Promise<Product> => {
    // Check if it looks like an ID (usually starts with prod_) or assume handle
    const response = await api.get<{ product: Product }>(`/store/products/${idOrHandle}`);
    return response.data.product;
  },

  // Get Cart
  getCart: async (cartId: string) => {
    try {
      // Medusa v2: Ensure we fetch nested relations for the cart items
      const response = await api.get<{ cart: any }>(`/store/carts/${cartId}`, {
        params: {
            fields: "id,region_id,email,shipping_address,billing_address,currency_code,total,subtotal,tax_total,discount_total,*items,*items.variant,*items.variant.product,*items.variant.product.images"
        }
      });
      return response.data.cart;
    } catch (error) {
      console.warn("API failed to get cart", error);
      throw error;
    }
  },

  // Complete Cart
  completeCart: async (cartId: string) => {
    try {
      const response = await api.post(`/store/carts/${cartId}/complete`);
      return response.data;
    } catch (error) {
      console.warn("API failed to complete cart", error);
      throw error;
    }
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await api.get("/store/dashboard/stats");
      return response.data;
    } catch (error) {
      console.warn("API failed to get dashboard stats", error);
      // Return zeros instead of fake numbers
      return { revenue: 0, orders: 0, conversion: 0 };
    }
  },

  // Sales
  getSales: async () => {
    try {
      const response = await api.get("/store/dashboard/sales");
      return response.data.sales || response.data.orders || [];
    } catch (error) {
      return [];
    }
  },

  // Commissions
  getCommissions: async () => {
    try {
      const response = await api.get("/store/commissions");
      return response.data.commissions || response.data || [];
    } catch (error) {
      return [];
    }
  },

  // Wallet
  getWallet: async () => {
    try {
      const response = await api.get("/store/wallet");
      return response.data;
    } catch (error) {
      return { balance: 0, pending: 0 };
    }
  },

  // Payouts
  getPayouts: async () => {
    try {
      const response = await api.get("/store/payouts");
      return response.data.payouts || response.data || [];
    } catch (error) {
      return [];
    }
  },

  requestPayout: async (data: any) => {
    try {
      const response = await api.post("/store/payouts", data);
      return response.data;
    } catch (error) {
      console.error("API failed to request payout", error);
      throw error;
    }
  },

  // Orders (for cancellation)
  getOrders: async () => {
    try {
      const response = await api.get("/store/orders");
      return response.data.orders || response.data || [];
    } catch (error) {
      return [];
    }
  },

  cancelOrder: async (orderId: string) => {
    try {
      const response = await api.post(`/store/orders/${orderId}/cancel`);
      return response.data;
    } catch (error) {
      console.error("API failed to cancel order", error);
      throw error;
    }
  },

  // List all regions
  getRegions: async () => {
    try {
      const response = await api.get<{ regions: any[] }>("/store/regions");
      return response.data.regions || [];
    } catch (error) {
      console.warn("API failed to fetch regions", error);
      return [];
    }
  },

  // Create Cart
  createCart: async (context?: { region_id?: string; country_code?: string }) => {
    try {
      // If country_code is passed but not region_id, we should try to find the region first
      // But since we are moving logic to caller, we will just pass what is given, 
      // ensuring we strip undefined fields if necessary.
      // However, the error says 'country_code' is unrecognized field in the BODY.
      // Medusa API usually takes region_id.
      
      const payload: any = {};
      if (context?.region_id) payload.region_id = context.region_id;
      // Some medusa versions support country_code, some don't. Safe to omit if we have region_id.
      if (context?.country_code && !context.region_id) payload.country_code = context.country_code;

      const response = await api.post<{ cart: any }>("/store/carts", payload);
      return response.data.cart;
    } catch (error) {
      console.warn("API create-cart failed", error);
      throw error;
    }
  },

  // Add item to cart
  addToCart: async (cartId: string, variantId: string, quantity: number = 1) => {
    try {
      // Remove metadata from initial add-to-cart to avoid 400 Bad Request
      // We will update the metadata with service_link in the cart page as per the guide's update step
      const response = await api.post(`/store/carts/${cartId}/line-items`, {
        variant_id: variantId,
        quantity
      });
      return response.data;
    } catch (error: any) {
      console.warn("API add-to-cart failed", error);
      // Log detailed error for debugging
      if (error.response?.data) {
        console.error("Add to Cart Error Data:", error.response.data);
      }
      throw error;
    }
  },

  // Attach Affiliate Code
  attachAffiliate: async (cartId: string, code: string) => {
    try {
      const response = await api.post(`/store/carts/${cartId}/affiliate`, {
        code: code 
      });
      return response.data;
    } catch (error) {
      console.error("API failed to attach affiliate", error);
      throw error;
    }
  },

  // Update Line Item (Quantity & Metadata)
  updateLineItem: async (cartId: string, lineItemId: string, quantity: number, metadata?: Record<string, any>) => {
    try {
      const payload: any = { quantity };
      if (metadata) {
        payload.metadata = metadata;
      }
      const response = await api.post(`/store/carts/${cartId}/line-items/${lineItemId}`, payload);
      return response.data;
    } catch (error) {
      console.error("API failed to update line item", error);
      throw error;
    }
  },

  // Create Payment Sessions
  createPaymentSessions: async (cartId: string) => {
    try {
      const response = await api.post(`/store/carts/${cartId}/payment-sessions`);
      return response.data;
    } catch (error) {
      console.error("API failed to create payment sessions", error);
      throw error;
    }
  }
};
