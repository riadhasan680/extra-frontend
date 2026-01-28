"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function OrderFailedPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Payment Failed</h1>
            <p className="text-gray-600">
              We couldn't process your payment. Please keep your items in the
              cart and try again.
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="/cart">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Retry Payment
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full">
                  Contact Support
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
