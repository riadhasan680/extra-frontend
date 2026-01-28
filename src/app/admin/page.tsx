"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
        setStats({
          totalProducts: 0,
          totalUsers: 0,
          totalOrders: 0,
          totalRevenue: 0,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: loading
        ? "..."
        : `$${stats?.totalRevenue?.toLocaleString() || "0"}`,
      change: "+19% from last month",
      icon: DollarSign,
      gradient: "from-purple-500 to-indigo-500",
      bgGradient: "from-purple-50 to-indigo-50",
    },
    {
      title: "Total Users",
      value: loading ? "..." : stats?.totalUsers || "0",
      change: "+12% from last month",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
    },
    {
      title: "Total Products",
      value: loading ? "..." : stats?.totalProducts || "0",
      change: "+2 new this month",
      icon: Package,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-50 to-rose-50",
    },
    {
      title: "Total Orders",
      value: loading ? "..." : stats?.totalOrders || "0",
      change: "+8% from last month",
      icon: ShoppingCart,
      gradient: "from-amber-500 to-orange-500",
      bgGradient: "from-amber-50 to-orange-50",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="bg-linear-to-r from-purple-600 to-purple-900 bg-clip-text text-4xl font-bold text-transparent dark:from-purple-400 dark:to-purple-200">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Overview of your platform performance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="group relative overflow-hidden border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-200/50 dark:border-gray-800 dark:bg-gray-900"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${stat.bgGradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:opacity-0`}
              />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <div
                  className={`rounded-xl bg-linear-to-br ${stat.gradient} p-2.5 shadow-lg`}
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
