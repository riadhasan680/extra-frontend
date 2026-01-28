import api from "@/lib/api";
import { 
  DashboardStats, 
  Order, 
  Wallet,
  Commission,
  ApiResponse,
  Payout
} from "@/types/api";

export const dashboardService = {
  // User stats (orders, commission)
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/store/dashboard/stats");
    return response.data;
  },

  // List user sales/orders
  getSales: async (): Promise<Order[]> => {
    const response = await api.get<any>("/store/dashboard/sales");
    // Backend returns { sales: [...] } but interface might expect orders
    return response.data.sales || response.data.orders || [];
  },

  getWallet: async (): Promise<Wallet> => {
    const response = await api.get<Wallet>("/store/wallet");
    return response.data;
  },

  getCommissions: async (): Promise<Commission[]> => {
    const response = await api.get<{ commissions: Commission[] }>("/store/commissions");
    return response.data.commissions;
  },

  // Payouts
  getPayouts: async (): Promise<Payout[]> => {
    const response = await api.get<{ payouts: Payout[] }>("/store/payouts");
    return response.data.payouts;
  },

  requestPayout: async (amount: number): Promise<void> => {
    await api.post("/store/payouts", { amount });
  }
};
