"use client";

import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingBag, ShieldCheck, Lock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Custom Cart Header */}
      <header className="border-b border-gray-100 bg-white py-4">
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
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-700 text-white shadow-lg">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>

      {/* Cart Banner */}
      <div className="relative overflow-hidden bg-[#340c7f] py-16 text-white">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80')] bg-cover bg-center mix-blend-overlay"></div>
        </div>

        {/* Twitch text background effect */}
        <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-black/20 select-none">
          twitch
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-6">
          <h1 className="text-center text-4xl font-bold tracking-wide uppercase">
            YOUR CART
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="container mx-auto max-w-7xl px-6 py-8">
        <div className="text-sm">
          <Link href="/" className="text-gray-600 hover:text-purple-600">
            Home
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-purple-600">Checkout</span>
        </div>
      </div>

      {/* Cart Content */}
      <div className="relative container mx-auto max-w-7xl px-6 pb-32">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column - Product Table + Profile Link */}
          <div className="space-y-12 lg:col-span-8">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 border-b border-gray-100 pb-4 text-sm font-semibold text-gray-800">
              <div className="col-span-6">Products</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Product Item */}
            <div className="grid grid-cols-12 items-center gap-4 border-b border-gray-100 py-4">
              <div className="col-span-6 flex items-center gap-6">
                <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-purple-700">
                  {/* Using a placeholder if image not available, but user wants match design */}
                  <div className="p-1 text-center text-xs leading-tight font-bold text-white">
                    TWITCH
                    <br />
                    STREAM
                    <br />
                    PROMOTION
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-normal text-gray-700">
                    Twitch Stream Promotion - Embedding (30% OFF NEW CUSTOMER
                    DISCOUNT)
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">3 Streams</p>
                  <Link
                    href="#"
                    className="mt-2 inline-block text-sm text-purple-600 hover:underline"
                  >
                    Remove
                  </Link>
                </div>
              </div>
              <div className="col-span-2 text-center font-bold text-gray-800">
                $39.95
              </div>
              <div className="col-span-2 flex justify-center">
                <div className="flex h-10 w-24 items-center rounded-md border border-gray-200">
                  <button className="flex h-full flex-1 items-center justify-center text-gray-500 hover:bg-gray-50">
                    <Minus className="h-3 w-3" />
                  </button>
                  <div className="flex h-full flex-1 items-center justify-center border-x border-gray-100 font-semibold text-gray-700">
                    3
                  </div>
                  <button className="flex h-full flex-1 items-center justify-center text-gray-500 hover:bg-gray-50">
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="col-span-2 text-right font-bold text-gray-800">
                $119.85
              </div>
            </div>

            {/* Profile Link Input */}
            <div>
              <label className="mb-4 block text-sm font-bold text-gray-800">
                Your Twitch Profile Link
              </label>
              <textarea className="min-h-[120px] w-full resize-none rounded-md border border-gray-200 bg-gray-50 p-4 focus:ring-2 focus:ring-purple-500 focus:outline-none"></textarea>
            </div>

            {/* Secure Checkout Badges */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="h-4 w-4 text-purple-600" />
              <span className="mr-2 font-bold">Secured Checkout</span>
              <div className="flex h-6 gap-1">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png"
                  alt="Mastercard"
                  className="h-full object-contain"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png"
                  alt="Visa"
                  className="h-full object-contain"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/1200px-American_Express_logo_%282018%29.svg.png"
                  alt="Amex"
                  className="h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-4">
            <div className="rounded-sm bg-gray-50 p-8">
              <div className="mb-6 flex items-center justify-between">
                <span className="font-bold text-gray-800">Subtotal</span>
                <span className="text-xl font-bold text-gray-800">$119.85</span>
              </div>

              <div className="mb-8">
                <span className="font-bold text-gray-800">Free Shipping</span>
              </div>

              <div className="space-y-4">
                <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-purple-200 font-bold text-purple-800 transition-colors hover:bg-purple-300">
                  🔄 Update Cart
                </Button>
                <Link href="/checkout" className="block w-full">
                  <Button className="h-14 w-full rounded-md bg-[#702cd4] font-bold text-white shadow-lg transition-all hover:bg-[#5b24ac]">
                    Process to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Badge */}
        <div className="pointer-events-none fixed right-0 bottom-0 z-50">
          <div className="pointer-events-auto absolute right-0 bottom-10 h-48 w-48 overflow-hidden">
            <div className="absolute top-[80px] -right-[60px] flex h-12 w-full origin-bottom-right -rotate-45 transform items-center justify-center bg-purple-500 shadow-xl">
              <span className="text-lg font-bold whitespace-nowrap text-white">
                GET 10% OFF
              </span>
            </div>
          </div>
        </div>

        {/* Use Image for the detailed 10% off badge if preferred or keep simple */}
        <div className="absolute right-0 bottom-40 hidden w-48 lg:block">
          {/* Can use an image here for the curved styled badge from screenshot */}
          <div className="relative -mr-20 flex h-40 w-40 rotate-12 transform items-center justify-center overflow-hidden rounded-full bg-[#d69dfc] shadow-2xl">
            <div className="absolute inset-0 rounded-full border-[10px] border-white/20"></div>
            <div className="-rotate-12 text-center">
              <span className="block text-lg font-bold text-black">GET</span>
              <span className="block text-3xl font-black text-black">10%</span>
              <span className="block text-lg font-bold text-black">OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 bg-[#222] py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-500">
          <p>Copyright © 2021 Xtra Life Marketing.com. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
