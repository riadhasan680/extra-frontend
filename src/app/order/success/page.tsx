"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function OrderSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-20">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="flex justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Order Confirmed!
            </h1>
            <p className="text-gray-600">
              Your promotion has been successfully queued.
            </p>
          </div>

          <Card className="border-purple-100 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                Order Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-bold text-gray-900">#ORD-99283</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product:</span>
                <span className="font-bold text-gray-900">
                  Twitch Stream Promotion
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-bold text-purple-600">Processing</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              We are processing your promotion. You can track the status in your
              dashboard.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/dashboard">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Return Home
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
