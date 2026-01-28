"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export interface SidebarItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface PremiumSidebarProps {
  items: SidebarItem[];
  title: string;
  logoUrl?: string;
  onLogout?: () => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function PremiumSidebar({
  items,
  title,
  logoUrl,
  onLogout,
  isMobileOpen,
  onMobileClose,
}: PremiumSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r-2 border-purple-100 bg-white shadow-2xl transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b-2 border-purple-100 bg-linear-to-br from-purple-500 to-purple-700 p-6">
          {/* Decorative elements */}
          <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />

          <Link
            href="/"
            className="relative flex items-center gap-3"
            onClick={onMobileClose}
          >
            {logoUrl ? (
              <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
                <Image
                  src={logoUrl}
                  alt={title}
                  width={40}
                  height={40}
                  className="h-10 w-10"
                />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <span className="text-2xl font-bold text-white">
                  {title.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <p className="text-xs text-purple-100">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {items.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={index}
                href={item.href}
                onClick={onMobileClose}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-white" />
                )}

                {/* Icon with gradient background for active state */}
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                    isActive
                      ? "bg-white/20"
                      : "bg-gray-100 group-hover:bg-purple-100"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      isActive
                        ? "text-white"
                        : "text-gray-600 group-hover:text-purple-600"
                    )}
                  />
                </div>

                <span className="flex-1">{item.title}</span>

                {/* Badge */}
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-semibold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-purple-100 text-purple-700"
                    )}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Hover effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-500/0 to-purple-600/0 opacity-0 transition-opacity group-hover:from-purple-500/5 group-hover:to-purple-600/5 group-hover:opacity-100" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {onLogout && (
          <div className="border-t-2 border-purple-100 p-4">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full justify-start gap-3 border-2 border-purple-200 bg-white text-gray-700 transition-all hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
