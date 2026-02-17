import api from "@/lib/api";
import { Product, ApiResponse, Order } from "@/types/api";

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
      // Note: Removed hardcoded 'extra-life' filter to support all products or new brand 'stream-lifter'
      if (products) {
         // products = products.filter(p => p.metadata && p.metadata.ui_style === 'extra-life');
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
      // We explicitly request payment_collection to check status
      const response = await api.get<{ cart: any }>(`/store/carts/${cartId}`, {
        params: {
            fields: "id,region_id,email,shipping_address,billing_address,currency_code,total,subtotal,tax_total,discount_total,*items,*items.variant,*items.variant.product,*items.variant.product.images,*promotions,*payment_collection,*payment_collection.payment_sessions,*region,*region.countries"
        }
      });
      return response.data.cart;
    } catch (error) {
      console.warn("API failed to get cart", error);
      throw error;
    }
  },

  // Update Cart (Email, Address, etc.)
  updateCart: async (cartId: string, payload: any) => {
    try {
      const response = await api.post(`/store/carts/${cartId}`, payload);
      return response.data.cart;
    } catch (error: any) {
      console.warn("API failed to update cart", error);
      // Try to extract detailed error message from Medusa response
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error?.message || 
                           error.message || 
                           "Unknown error occurred";
      throw new Error(errorMessage);
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

  getDashboardStats: async (): Promise<import("@/types/api").DashboardStats> => {
    try {
      const response = await api.get("/store/dashboard/stats");
      return response.data;
    } catch (error) {
      console.warn("API failed to get dashboard stats", error);
      return {
        totalOrders: 0,
        activeOrders: 0,
        completedOrders: 0,
        commissionBalance: 0,
        totalSales: 0,
      };
    }
  },

  getSales: async (): Promise<Order[]> => {
    try {
      const response = await api.get("/store/dashboard/sales");
      const raw = response.data.sales || response.data.orders || [];
      const list = Array.isArray(raw) ? raw : [];
      return list.map((o: any): Order => ({
        id: o.id,
        amount: ((o.total ?? o.amount) || 0) / 100,
        commissionAmount: o.commission_amount ?? o.commissionAmount ?? 0,
        status: o.status ?? "pending",
        createdAt: o.created_at ?? o.createdAt ?? new Date().toISOString(),
        productId: o.product_id ?? o.productId,
        userId: o.user_id ?? o.userId,
      }));
    } catch (error) {
      try {
        const fallback = await api.get("/store/orders");
        const raw = fallback.data.orders || fallback.data || [];
        const list = Array.isArray(raw) ? raw : [];
        return list.map((o: any): Order => ({
          id: o.id,
          amount: ((o.total ?? o.amount) || 0) / 100,
          commissionAmount: o.commission_amount ?? o.commissionAmount ?? 0,
          status: o.status ?? "pending",
          createdAt: o.created_at ?? o.createdAt ?? new Date().toISOString(),
          productId: o.product_id ?? o.productId,
          userId: o.user_id ?? o.userId,
        }));
      } catch {
        return [];
      }
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

  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await api.get("/store/orders");
      const raw = response.data.orders || response.data || [];
      const list = Array.isArray(raw) ? raw : [];
      return list.map((o: any): Order => ({
        id: o.id,
        amount: ((o.total ?? o.amount) || 0) / 100,
        commissionAmount: o.commission_amount ?? o.commissionAmount ?? 0,
        status: o.status ?? "pending",
        createdAt: o.created_at ?? o.createdAt ?? new Date().toISOString(),
        productId: o.product_id ?? o.productId,
        userId: o.user_id ?? o.userId,
      }));
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

  // Initiate Dodo Payment (Medusa v2 Flow)
  createDodoPaymentSession: async (cartId: string) => {
    try {
      // 1. Create Payment Collection
      const collectionRes = await api.post("/store/payment-collections", { 
        cart_id: cartId 
      });
      
      const paymentCollectionId = collectionRes.data.payment_collection?.id;
      if (!paymentCollectionId) {
        throw new Error("Failed to create payment collection");
      }

      // 2. Initialize Payment Session with Dodo Provider
      const sessionRes = await api.post(`/store/payment-collections/${paymentCollectionId}/payment-sessions`, {
        provider_id: "pp_dodo_dodo",
        data: {
            // Pass cart_id explicitly to ensure it reaches the provider
            cart_id: cartId
        }
      });
      
      // MOCK FIX: If backend returns success but no checkout_url in data (e.g. pending status),
      // we might need to manually construct it or check if it's available elsewhere.
      // Based on debug logs, we see data: { status: 'pending' } but no URL.
      // This implies either configuration issue on backend OR we need to poll/redirect differently.
      
      // TEMPORARY FALLBACK FOR DEBUGGING/DEV:
      // If we see 'pp_dodo_dodo' and status 'pending' but no URL, 
      // we might be in a state where backend hasn't generated it yet.
      
      return sessionRes.data;
    } catch (error: any) {
      console.error("API failed to initiate Dodo payment", error);
      
      // Improve error message for common issues
      if (error.response?.status === 400 || error.response?.status === 500) {
         const msg = error.response?.data?.message || "";
         const type = error.response?.data?.type || "";

         if (msg.includes("provider") || msg.includes("pp_dodo_dodo")) {
             throw new Error("Dodo Payment (pp_dodo_dodo) is not enabled in this Region. Please add it in Medusa Admin.");
         }
         
         if (error.response?.status === 500 && (type === "unknown_error" || !msg)) {
             throw new Error("Backend Error: The Dodo Payment plugin crashed. Please check your Backend logs and verify your Dodo API Keys.");
         }
      }
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

  // Add Promotion (Medusa v2)
  addPromotion: async (cartId: string, code: string) => {
    try {
      // Medusa v2 uses /store/carts/:id/promotions
      const response = await api.post(`/store/carts/${cartId}/promotions`, {
        promo_codes: [code]
      });
      return response.data.cart;
    } catch (error) {
      console.error("API failed to add promotion", error);
      throw error;
    }
  },

  // Remove Promotion (Medusa v2)
  removePromotion: async (cartId: string, code: string) => {
    try {
        // Medusa v2 uses DELETE /store/carts/:id/promotions
        // Axios delete with body requires 'data' field
        const response = await api.delete(`/store/carts/${cartId}/promotions`, {
            data: { promo_codes: [code] }
        });
        return response.data.cart;
    } catch (error) {
        console.error("API failed to remove promotion", error);
        throw error;
    }
  },

  // Create Payment Sessions (Standard Medusa)
  // createPaymentSessions: async (cartId: string) => {
  //   try {
  //     const response = await api.post(`/store/carts/${cartId}/payment-sessions`);
  //     return response.data;
  //   } catch (error) {
  //     console.error("API failed to create payment sessions", error);
  //     // Don't throw, just return null to avoid breaking UI init
  //     return null;
  //   }
  // }
};
