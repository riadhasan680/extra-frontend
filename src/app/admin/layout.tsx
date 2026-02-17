"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";
import {
  PremiumSidebar,
  SidebarItem,
} from "@/components/layout/premium-sidebar";
import { PremiumHeader } from "@/components/layout/premium-header";

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Commissions",
    href: "/admin/commissions",
    icon: DollarSign,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();

  const handleLogout = () => {
    logout();
    addToast({
      type: "info",
      title: "Logged out",
      description: "Admin session ended successfully.",
    });
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <PremiumSidebar
        items={sidebarItems}
        title="Admin Panel"
        logoUrl="/logo.svg"
        onLogout={handleLogout}
        isMobileOpen={isSidebarOpen}
        onMobileClose={() => setIsSidebarOpen(false)}
      />

      <div className="flex flex-1 flex-col lg:pl-72">
        <PremiumHeader
          onMenuClick={() => setIsSidebarOpen(true)}
          userName="Admin"
          userEmail={user?.email}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
