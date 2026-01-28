"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Lock, HelpCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Custom Simple Header */}
      <header className="border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/">
            <Image
              src="https://xtralifemarketing.com/cdn/shop/files/logo_x70.png?v=1614342404"
              alt="Xtra Marketing"
              width={140}
              height={70}
              className="h-auto max-h-12 w-auto"
            />
          </Link>
          <Link href="/cart">
            <ShoppingBag className="h-6 w-6 text-purple-700" />
          </Link>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Left Column - Form Section */}
        <div className="flex-1 px-6 py-12 lg:w-[55%] lg:pr-12 lg:pl-[10%]">
          {/* Express Checkout */}
          <div className="mb-8 text-center">
            <p className="mb-4 text-sm text-gray-500">Express checkout</p>
            <button className="mx-auto flex h-12 w-full max-w-md items-center justify-center rounded-[4px] bg-[#FFC439] hover:bg-[#F4BB35]">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                alt="PayPal"
                className="h-6"
              />
            </button>
            <div className="relative mt-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative bg-white px-2 text-xs text-gray-500 uppercase">
                OR
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-10">
            {/* Contact Section */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Contact</h2>
                <Link
                  href="/login"
                  className="text-sm text-purple-600 underline hover:text-purple-800"
                >
                  Log in
                </Link>
              </div>
              <Input
                type="email"
                placeholder="Email"
                className="h-12 rounded-md border-gray-300 focus:border-purple-600 focus:ring-purple-600"
              />
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="newsletter"
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-600">
                  Email me with news and offers
                </label>
              </div>
            </div>

            {/* Payment Section */}
            <div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Payment
              </h2>
              <p className="mb-4 text-sm text-gray-500">
                All transactions are secure and encrypted.
              </p>

              <div className="overflow-hidden rounded-md border border-gray-300">
                {/* Credit Card Header */}
                <div className="flex items-center justify-between border-b border-purple-100 bg-purple-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-[5px] border-purple-700 bg-white"></div>
                    <span className="font-medium text-gray-900">
                      Credit card
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-200 bg-white">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png"
                        alt="Visa"
                        className="h-2 object-contain"
                      />
                    </div>
                    <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-200 bg-white">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                        alt="Mastercard"
                        className="h-4 object-contain"
                      />
                    </div>
                    <div className="flex h-6 w-10 items-center justify-center rounded border border-gray-200 bg-white">
                      <span className="text-[6px] font-bold">+3</span>
                    </div>
                  </div>
                </div>

                {/* Credit Card Form */}
                <div className="space-y-4 border-b border-gray-200 bg-gray-50 p-4">
                  <div className="relative">
                    <Input
                      placeholder="Card number"
                      className="h-12 border-gray-300 bg-white"
                    />
                    <Lock className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Expiration date (MM / YY)"
                      className="h-12 border-gray-300 bg-white"
                    />
                    <div className="relative">
                      <Input
                        placeholder="Security code"
                        className="h-12 border-gray-300 bg-white"
                      />
                      <HelpCircle className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <Input
                    placeholder="Name on card"
                    className="h-12 border-gray-300 bg-white"
                  />
                </div>

                {/* PayPal Option */}
                <div className="flex items-center justify-between bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border border-gray-300"></div>
                    <span className="font-medium text-gray-700">PayPal</span>
                  </div>
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                    alt="PayPal"
                    className="h-6"
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Billing address
              </h2>

              <div className="space-y-4">
                <select className="h-12 w-full rounded-md border border-gray-300 bg-white px-3 text-gray-700">
                  <option>Bangladesh</option>
                </select>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="First name (optional)"
                    className="h-12 border-gray-300"
                  />
                  <Input
                    placeholder="Last name"
                    className="h-12 border-gray-300"
                  />
                </div>

                <Input placeholder="Address" className="h-12 border-gray-300" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="City" className="h-12 border-gray-300" />
                  <Input
                    placeholder="Postal code (optional)"
                    className="h-12 border-gray-300"
                  />
                </div>
              </div>
            </div>

            <Button className="mt-6 h-14 w-full rounded-md bg-[#913192] text-lg font-bold text-white hover:bg-[#7a287b]">
              Pay now
            </Button>

            <div className="flex gap-4 border-t border-gray-100 pt-6 text-xs text-purple-600 underline">
              <Link href="#">Refund policy</Link>
              <Link href="#">Privacy policy</Link>
              <Link href="#">Terms of service</Link>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="flex-1 border-l border-gray-200 bg-[#fafafa] px-6 py-12 lg:w-[45%] lg:pr-[10%] lg:pl-10">
          <div className="sticky top-6 max-w-md">
            {/* Product Item */}
            <div className="mb-6 flex items-start gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-md border border-gray-200 bg-gradient-to-br from-purple-400 to-purple-600">
                  {/* Placeholder image representation */}
                  <div className="text-center text-[8px] leading-tight font-bold text-white">
                    TWITCH STREAM PROMOTION
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs font-medium text-white">
                  3
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  Twitch Stream Promotion - Embedding (30% OFF NEW CUSTOMER
                  DISCOUNT)
                </h3>
                <p className="mt-1 text-xs text-gray-500">3 Streams</p>
              </div>
              <div className="text-sm font-medium text-gray-900">$119.85</div>
            </div>

            {/* Discount Code */}
            <div className="mb-8 flex gap-3 border-b border-gray-200 pb-8">
              <Input
                placeholder="Discount code"
                className="h-12 border-gray-300 bg-white"
              />
              <Button
                variant="outline"
                className="h-12 border-gray-300 bg-gray-100 px-6 font-medium text-gray-500 hover:bg-gray-200"
              >
                Apply
              </Button>
            </div>

            {/* Totals */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">$119.85</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-xs text-gray-500">
                  Enter shipping address
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-500">USD</span>
                <span className="text-2xl font-bold text-gray-900">
                  $119.85
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
