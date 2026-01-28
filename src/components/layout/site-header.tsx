"use client";

import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar - Only visible when not scrolled */}
      {!isScrolled && (
        <div className="w-full bg-[#332f7b] px-4 py-2 text-lg text-white">
          <div className="w-full max-w-full px-6">
            <div className="flex justify-center">
              <div className="text-center">
                Money Back Guarantee | Responsive Customer Support | (800)
                905-9941
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div
        className={`w-full ${isScrolled ? "py-2" : "py-2"} transition-all duration-300`}
      >
        <div className="flex w-full max-w-full items-center justify-between px-6">
          {/* Logo - Left side */}
          <Link
            href="/"
            className={`transition-all duration-300 ${
              isScrolled
                ? "scale-100 opacity-100"
                : "pointer-events-none absolute scale-95 opacity-0"
            }`}
          >
            <Image
              src="https://xtralifemarketing.com/cdn/shop/files/logo_x70.png?v=1614342404"
              alt="Xtra Marketing"
              width={140}
              height={70}
              className="h-auto max-h-20 w-auto"
            />
          </Link>

          {/* Spacer for mobile */}
          <div className="md:hidden"></div>

          {/* Desktop Navigation - Right side */}
          <nav
            className={`ml-auto hidden items-center gap-8 transition-all duration-300 md:flex ${
              isScrolled ? "opacity-100" : "opacity-100"
            }`}
          >
            <Link
              href="#"
              className={`${isScrolled ? "text-gray-900 dark:text-white" : "text-white"} text-lg font-semibold transition-colors hover:text-purple-400`}
            >
              Twitch Promotion
            </Link>
            <Link
              href="#"
              className={`${isScrolled ? "text-gray-900 dark:text-white" : "text-white"} text-lg font-semibold transition-colors hover:text-purple-400`}
            >
              Contact Us
            </Link>
            <Link
              href="#"
              className={`${isScrolled ? "text-gray-900 dark:text-white" : "text-white"} text-lg font-semibold transition-colors hover:text-purple-400`}
            >
              Kick Promotion
            </Link>

            {/* Auth Link */}
            {user ? (
              <Link
                href="/dashboard"
                className={`${isScrolled ? "text-gray-900 dark:text-white" : "text-white"} flex items-center gap-2 font-semibold transition-colors hover:text-purple-400`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className={`${isScrolled ? "text-gray-900 dark:text-white" : "text-white"} text-lg font-semibold transition-colors hover:text-purple-400`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`rounded-full bg-purple-600 px-6 py-2 text-lg font-semibold text-white transition-colors hover:bg-purple-700`}
                >
                  Join Now
                </Link>
              </div>
            )}

            <Link
              href="/cart"
              className={`${isScrolled ? "text-gray-900 dark:text-white" : "text-white"} transition-colors hover:text-purple-400`}
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`transition-all duration-300 md:hidden ${
              isScrolled ? "text-gray-900 dark:text-white" : "text-white"
            }`}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mx-4 mt-4 rounded-lg border-t border-gray-200 bg-white pt-4 pb-4 shadow-lg md:hidden dark:border-gray-800 dark:bg-gray-900">
            <nav className="flex flex-col gap-4">
              <Link
                href="#"
                className="px-4 py-2 font-normal text-gray-900 transition-colors hover:text-purple-600 dark:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Twitch Promotion
              </Link>
              <Link
                href="#"
                className="px-4 py-2 font-normal text-gray-900 transition-colors hover:text-purple-600 dark:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>

              <div className="mt-2 flex flex-col gap-3 border-t border-gray-200 px-4 pt-4 dark:border-gray-800">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-100 py-3 text-purple-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="w-full rounded-lg border border-purple-200 py-3 text-center font-semibold text-purple-700 hover:bg-purple-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="w-full rounded-lg bg-purple-600 py-3 text-center font-semibold text-white hover:bg-purple-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up Free
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
