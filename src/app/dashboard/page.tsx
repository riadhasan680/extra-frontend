"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  ShoppingCart,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardStats, Wallet } from "@/types/api";
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function UserDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, walletData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getWallet().catch(() => null) // Handle wallet failure gracefully
      ]);
      setStats(statsData);
      setWallet(walletData);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Sales",
      value: loading ? "..." : stats?.totalOrders || "0",
      change: "Referral Orders",
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "Total Commission",
      value: loading ? "..." : formatCurrency(stats?.commissionBalance || 0),
      change: "Lifetime Earnings",
      icon: DollarSign,
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
    },
    {
      title: "Wallet Balance",
      value: loading ? "..." : formatCurrency(wallet?.total_earnings || 0), // Assuming wallet returns total available
      change: "Available to Withdraw",
      icon: CreditCard,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
    }
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="bg-gradient-to-r from-purple-600 to-purple-900 bg-clip-text text-4xl font-bold text-transparent dark:from-purple-400 dark:to-purple-200">
          Dashboard Overview
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's your affiliate performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="group relative overflow-hidden border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-200/50 dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:opacity-0`}
              />

              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div
                  className={`rounded-xl bg-gradient-to-br ${stat.gradient} p-2.5 shadow-lg`}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
