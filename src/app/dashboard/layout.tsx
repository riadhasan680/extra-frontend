"use client";

import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import { LayoutDashboard, ShoppingCart, User, CreditCard, DollarSign } from "lucide-react";
import {
  PremiumSidebar,
  SidebarItem,
} from "@/components/layout/premium-sidebar";
import { PremiumHeader } from "@/components/layout/premium-header";

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Sales",
    href: "/dashboard/sales",
    icon: DollarSign,
  },
  {
    title: "My Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Commissions",
    href: "/dashboard/commissions",
    icon: DollarSign,
  },
  {
    title: "Wallet",
    href: "/dashboard/wallet",
    icon: CreditCard,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
    addToast({
      type: "info",
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-slate-950">
      <PremiumSidebar
        items={sidebarItems}
        title="Stream Lifter"
        logoUrl="/logo.svg"
        onLogout={handleLogout}
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col lg:pl-72">
        <PremiumHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          userName={user?.email?.split("@")[0] || "User"}
          userEmail={user?.email}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
