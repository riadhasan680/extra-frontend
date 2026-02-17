"use client";

import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-white pt-16 pb-6 text-gray-900 border-t border-green-100">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-8 md:grid-cols-4">
          {/* Logo & Brand */}
          <div className="flex flex-col items-start">
            <div className="mb-6">
              <Link href="/" className="block">
                <img
                  src="/logo.svg"
                  alt="Stream Lifter Logo"
                  className="h-20 w-auto object-contain"
                />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="#"
                  className="font-light text-gray-600 transition-colors hover:text-green-600"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="font-light text-gray-600 transition-colors hover:text-green-600"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="font-light text-gray-600 transition-colors hover:text-green-600"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Menu */}
          <div>
            <h3 className="mb-6 text-lg font-semibold text-gray-900">Menu</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/twitch-promotion"
                  className="font-light text-gray-600 transition-colors hover:text-green-600"
                >
                  Twitch Promotion
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="font-light text-gray-600 transition-colors hover:text-green-600"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="font-light text-gray-600 transition-colors hover:text-green-600"
                >
                  Kick Promotion
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-6 text-lg leading-tight font-semibold text-gray-900">
              Subscribe for Exclusive Discounts
              <br />
              and Updates
            </h3>
            <div className="flex h-12">
              <Input
                type="email"
                placeholder="Your email"
                className="h-full rounded-l-sm rounded-r-none border border-green-200 bg-green-50 px-4 text-gray-900 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-green-500"
              />
              <Button className="flex h-full w-12 shrink-0 items-center justify-center rounded-l-none rounded-r-sm bg-green-600 text-white hover:bg-green-700">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-6 pt-0 md:flex-row">
          {/* Copyright */}
          <p className="text-xs font-light text-white">
            Copyright © 2026 Stream Lifter
          </p>

          {/* Payment Methods */}
          <div className="flex items-center gap-1">
            {/* Creating CSS-only payment badges to match style cleanly */}
            <div className="payment-icon bg-[#0070ba] text-white">
              <span className="font-bold italic">Amex</span>
            </div>
            <div className="payment-icon bg-white text-[#00457C]">
              <span className="font-bold">Diners</span>
            </div>
            <div className="payment-icon bg-[#ff6000] text-white">
              <span className="font-bold">Disc</span>
            </div>
            <div className="payment-icon bg-blue-600 text-white">
              <span className="font-bold">JCB</span>
            </div>
            <div className="payment-icon relative overflow-hidden bg-red-600 text-white">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="-ml-2 h-4 w-4 rounded-full bg-orange-500 opacity-80"></div>
                <div className="-mr-2 h-4 w-4 rounded-full bg-red-500 opacity-80"></div>
              </div>
            </div>
            <div className="payment-icon bg-[#003087] text-white">
              <span className="font-bold italic">PayPal</span>
            </div>
            <div className="payment-icon bg-[#3d95ce] text-white">
              <span className="font-bold">Venmo</span>
            </div>
            <div className="payment-icon bg-[#1a1f71] text-white">
              <span className="font-bold italic">VISA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating 10% OFF Badge */}
      <div className="pointer-events-none absolute right-0 bottom-0 z-20 h-40 w-40 overflow-hidden">
        <div className="pointer-events-auto absolute -right-[45px] bottom-[25px] w-[170px] -rotate-45 transform cursor-pointer border-2 border-white bg-green-500 py-2 text-center text-sm font-bold text-white shadow-lg transition-colors hover:bg-green-600">
          GET 10% OFF
        </div>
      </div>

      {/* Floating Chat Icon (Fake) */}
      <div className="fixed bottom-6 left-6 z-50">
        <button className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-green-600 shadow-lg transition-transform hover:scale-110">
          <div className="relative">
            <svg
              className="h-7 w-7 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full border border-white bg-red-500 text-[10px] text-white">
              1
            </div>
          </div>
        </button>
      </div>

      <style jsx>{`
        .payment-icon {
          height: 24px;
          width: 38px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
        }
      `}</style>
    </footer>
  );
}
