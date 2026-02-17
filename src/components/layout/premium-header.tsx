"use client";

import { Button } from "@/components/ui/button";
import { Menu, Bell, Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

interface PremiumHeaderProps {
  onMenuClick: () => void;
  userName?: string;
  userEmail?: string;
}

export function PremiumHeader({
  onMenuClick,
  userName = "User",
  userEmail,
}: PremiumHeaderProps) {
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 border-b-2 border-green-100 bg-white/80 shadow-sm backdrop-blur-md dark:border-green-900 dark:bg-gray-900/80">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="cursor-pointer lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar (Optional) */}
        <div className="hidden flex-1 md:block">
          <div className="relative max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full rounded-xl border-2 border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm transition-all focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-900"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="ml-auto flex items-center gap-3">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer relative hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
          </Button>

          {/* Dark Mode Toggle */}
          <ModeToggle />

          {/* User Profile */}
          <div className="flex items-center gap-3 rounded-xl border-2 border-green-100 bg-green-50/60 py-1.5 pr-4 pl-1.5 transition-all hover:border-green-200 hover:bg-green-50 dark:border-green-900 dark:bg-green-900/20 dark:hover:border-green-800 dark:hover:bg-green-900/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg">
              <span className="text-sm font-bold text-white">{initials}</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</p>
              {userEmail && (
                <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
