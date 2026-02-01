"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function OrderCancelPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100">
              <XCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Payment Cancelled</h1>
            <p className="text-gray-600">
              You have cancelled the checkout process. Your items are still in the cart.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/cart">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Return to Cart & Try Again
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
