import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PublicHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white shadow-sm">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-primary flex items-center gap-2 text-2xl font-bold tracking-tight"
          >
            ExtraLife<span className="text-gray-900">Marketing</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-primary transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            className="hover:text-primary transition-colors"
          >
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button
              variant="ghost"
              className="hover:text-primary text-gray-600 hover:bg-purple-50"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-primary hover:bg-primary/90 shadow-primary/20 rounded-lg px-6 font-semibold text-white shadow-md">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
