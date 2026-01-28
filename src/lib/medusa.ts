export const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000";

export const getMedusaClient = () => {
  // Placeholder for Medusa JS Client initialization
  return {
    products: {
      list: async () => ({ products: [] }),
      retrieve: async (id: string) => ({ product: {} }),
    },
    auth: {
      authenticate: async () => ({ user: {} }),
    },
    carts: {
      create: async () => ({ cart: {} }),
    },
  };
};
