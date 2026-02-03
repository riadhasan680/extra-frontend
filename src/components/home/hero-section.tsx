"use client";

import Image from "next/image";
import { CheckCircle2, TrendingUp, Users, Shield } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-green-50/20 to-white">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient Orbs - Increased visibility and performance */}
        <div className="animate-blob absolute -top-40 -left-40 h-96 w-96 rounded-full bg-green-300/40 blur-3xl will-change-transform"></div>
        <div className="animate-blob animation-delay-2000 absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-green-400/30 blur-3xl will-change-transform"></div>
        <div className="animate-blob animation-delay-4000 absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-green-200/50 blur-2xl will-change-transform"></div>

        {/* Geometric Shapes - Better visibility */}
        <div className="animate-spin-slow absolute top-20 right-1/4 h-32 w-32 rotate-45 border-2 border-green-400/20 will-change-transform"></div>
        <div className="animate-float-slow absolute bottom-40 left-1/3 h-24 w-24 rounded-lg border-2 border-green-500/20 will-change-transform"></div>

        {/* Dot Pattern - Increased opacity */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(circle, #22c55e 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        ></div>

        {/* Subtle Grid Lines - Increased opacity */}
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="#22c55e"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto max-w-7xl px-6 pt-20 pb-16">
        <div className="grid min-h-[calc(100vh-8rem)] items-center gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-green-500 bg-white/90 px-5 py-2 shadow-lg backdrop-blur-sm">
              <svg className="h-6 w-6" viewBox="0 0 256 268" fill="#22c55e">
                <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741H128L93.113 226.92v-34.886H40.717V23.263zm64.008 116.405H128V69.844h-23.275v69.824zm63.997 0h23.27V69.844h-23.27v69.824z" />
              </svg>
              <span className="text-sm font-bold text-gray-800">
                Verified Twitch Partner
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl leading-[1.1] font-extrabold text-gray-900 lg:text-7xl">
                Grow Your
                <br />
                <span className="bg-gradient-to-r from-green-600 via-green-500 to-green-600 bg-clip-text text-transparent">
                  Twitch Channel
                </span>
                <br />
                Organically
              </h1>
              <p className="text-xl leading-relaxed text-gray-600 lg:text-2xl">
                Real viewers. Real engagement. Real results.
                <br />
                <span className="font-semibold text-green-600">
                  100% TOS Compliant
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-500/40"
              >
                View Packages
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white/80 px-8 py-4 text-lg font-bold text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:border-green-500 hover:bg-green-50"
              >
                How It Works
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="flex flex-col items-center rounded-xl border border-green-100/50 bg-white/80 p-4 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
                <Users className="mb-2 h-8 w-8 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">10K+</p>
                <p className="text-xs text-gray-600">Active Users</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-green-100/50 bg-white/80 p-4 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
                <TrendingUp className="mb-2 h-8 w-8 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">98%</p>
                <p className="text-xs text-gray-600">Success Rate</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-green-100/50 bg-white/80 p-4 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:shadow-lg">
                <Shield className="mb-2 h-8 w-8 text-green-600" />
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-xs text-gray-600">TOS Safe</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            {/* Floating Cards */}
            <div className="relative h-[600px]">
              {/* Main Card */}
              <div className="animate-float-center absolute top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border-2 border-green-500/50 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-green-600 text-2xl font-bold text-white">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Channel Growth</p>
                    <p className="text-3xl font-bold text-gray-900">+245%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Real Live Viewers
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Algorithm Boost
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-700">
                      Higher Rankings
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1 */}
              <div
                className="absolute top-20 right-0 animate-bounce rounded-full bg-gradient-to-br from-green-500 to-green-600 px-6 py-3 text-sm font-bold text-white shadow-xl"
                style={{ animationDuration: "3s" }}
              >
                GET 10% OFF
              </div>

              {/* Floating Badge 2 */}
              <div className="absolute bottom-20 left-0 animate-pulse rounded-2xl border-2 border-green-500/50 bg-white/90 p-4 shadow-xl backdrop-blur-sm">
                <p className="text-xs text-gray-600">Live Viewers</p>
                <p className="text-2xl font-bold text-green-600">+150</p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/3 -right-4 h-32 w-32 rounded-full bg-green-200 opacity-20 blur-3xl"></div>
              <div className="absolute bottom-1/3 -left-4 h-40 w-40 rounded-full bg-green-300 opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
        <div className="flex h-12 w-8 items-start justify-center rounded-full border-2 border-green-500/50 bg-white/50 p-2 backdrop-blur-sm">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
      </div>
    </section>
  );
}
