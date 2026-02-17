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
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isWhiteHeader = isScrolled || !isHomePage;

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
        isWhiteHeader
          ? "bg-white  dark:border-gray-800 dark:bg-gray-900"
          : "bg-transparent"
      }`}
    >
      {/* Top Bar - Only visible on home page when not scrolled */}
      {!isScrolled && isHomePage && (
        <div className="w-full bg-green-900 px-4 py-2 text-[17px] tracking-wide text-white">
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
              isWhiteHeader
                ? "scale-100 opacity-100"
                : "pointer-events-none absolute scale-95 opacity-0"
            }`}
          >
            <Image
              src="/logo.svg"
              alt="Stream Lifter"
              width={120}
              height={60}
              className="h-auto max-h-14 w-auto"
            />
          </Link>

          {/* Spacer for mobile */}
          <div className="md:hidden"></div>

          {/* Desktop Navigation - Right side */}
          <nav
            className={`ml-auto hidden items-center gap-8 transition-all duration-300 md:flex ${
              isWhiteHeader ? "opacity-100" : "opacity-100"
            }`}
          >
            <Link
              href="/twitch-promotion"
              className={`${isWhiteHeader ? "text-gray-900 dark:text-white" : "text-white"} text-lg font-semibold transition-colors hover:text-green-400`}
            >
              Twitch Promotion
            </Link>
            <Link
              href="/contact"
              className={`${isWhiteHeader ? "text-gray-900 dark:text-white" : "text-white"} text-lg font-semibold transition-colors hover:text-green-400`}
            >
              Contact Us
            </Link>
            <Link
              href="#"
              className={`${isWhiteHeader ? "text-gray-900 dark:text-white" : "text-white"} text-lg font-semibold transition-colors hover:text-green-400`}
            >
              Kick Promotion
            </Link>

            {/* Auth Link */}
            {user ? (
              <Link
                href="/dashboard"
                className={`${isWhiteHeader ? "text-gray-900 dark:text-white" : "text-white"} flex items-center gap-2 font-semibold transition-colors hover:text-green-400`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Link>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className={`${isWhiteHeader ? "text-gray-900 dark:text-white" : "text-white"} text-lg font-semibold transition-colors hover:text-green-400`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={`rounded-full bg-green-600 px-6 py-2 text-lg font-medium text-white transition-colors hover:bg-green-700`}
                >
                  Join Now
                </Link>
              </div>
            )}

            <Link
              href="/cart"
              className={`${isWhiteHeader ? "text-gray-900 dark:text-white" : "text-white"} transition-colors hover:text-green-400`}
            >
              <ShoppingCart className="h-6 w-6" />
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`cursor-pointer transition-all duration-300 md:hidden ${
              isWhiteHeader ? "text-gray-900 dark:text-white" : "text-white"
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
                className="px-4 py-2 font-normal text-gray-900 transition-colors hover:text-green-600 dark:text-white dark:hover:text-green-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Twitch Promotion
              </Link>
              <Link
                href="/contact"
                className="px-4 py-2 font-normal text-gray-900 transition-colors hover:text-green-600 dark:text-white dark:hover:text-green-400"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact Us
              </Link>

              <div className="mt-2 flex flex-col gap-3 border-t border-gray-200 px-4 pt-4 dark:border-gray-800">
                {user ? (
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-100 py-3 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="h-5 w-5" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="w-full rounded-lg border border-green-200 py-3 text-center font-semibold text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-900/30"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="w-full rounded-lg bg-green-600 py-3 text-center font-semibold text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
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
