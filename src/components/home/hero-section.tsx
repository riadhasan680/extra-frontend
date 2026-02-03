"use client";

import Image from "next/image";
import { CheckCircle2, TrendingUp, Users, Shield, Loader2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { storeService } from "@/services/store.service";
import { Product, ProductVariant } from "@/types/api";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  // Fetch Product (Prioritize "Unlimited" or fallback to first)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await storeService.getProducts();
        // Try to find "Unlimited" product, or use the first one
        const foundProduct = products.find(p => p.title?.toLowerCase().includes("unlimited")) || products[0];
        
        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            setSelectedVariant(foundProduct.variants[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch hero product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  // Helper to get display price (prioritize USD)
  const getDisplayPrice = (variant: ProductVariant | null) => {
    if (!variant) return { amount: 0, currency: "USD" };

    // 1. Try to find USD price
    const usdPrice = variant.prices?.find(
      (p) => p.currency_code.toLowerCase() === "usd"
    );
    if (usdPrice) return { amount: usdPrice.amount, currency: "USD" };

    // 2. Fallback to first price in prices array
    if (variant.prices && variant.prices.length > 0) {
      return {
        amount: variant.prices[0].amount,
        currency: variant.prices[0].currency_code.toUpperCase(),
      };
    }

    // 3. Fallback to legacy price field
    return { amount: variant.price || 0, currency: "USD" };
  };

  const handleBuyItNow = async () => {
    if (!selectedVariant || !product) return;

    try {
      setIsBuying(true);

      // Step 1: Create Cart
      let regionId: string | undefined;
      try {
        const regions = await storeService.getRegions();
        // Try to find US region or fallback to first region
        const usRegion = regions.find((r: any) =>
          r.countries?.some((c: any) => c.iso_2 === "us")
        );
        const defaultRegion = regions[0];

        if (usRegion) {
          regionId = usRegion.id;
        } else if (defaultRegion) {
          regionId = defaultRegion.id;
        }
      } catch (e) {
        console.warn("Failed to fetch regions", e);
      }

      let cart;
      try {
        cart = await storeService.createCart(
          regionId ? { region_id: regionId } : undefined
        );
        await storeService.addToCart(cart.id, selectedVariant.id, 1);
      } catch (cartError: any) {
        const errMsg = cartError.response?.data?.message || "";
        if (
          errMsg.includes("stock location") ||
          errMsg.includes("Sales Channel")
        ) {
          console.warn(
            "First attempt failed, retrying without explicit region...",
            cartError
          );
          cart = await storeService.createCart(); // No region_id, let Medusa pick default
          await storeService.addToCart(cart.id, selectedVariant.id, 1);
        } else {
          throw cartError;
        }
      }

      // Step 3: Apply Affiliate (if exists in localStorage)
      const affiliateData = localStorage.getItem("affiliate_ref");
      if (affiliateData) {
        const { value: refCode, expiry } = JSON.parse(affiliateData);
        if (new Date().getTime() < expiry) {
          try {
            await storeService.attachAffiliate(cart.id, refCode);
          } catch (err) {
            console.error("Failed to attach affiliate code", err);
          }
        }
      }

      // Step 4: Redirect to Cart
      router.push(`/cart?cart_id=${cart.id}`);
    } catch (error: any) {
      console.error("Buy It Now failed", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to process request.",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  const { amount: priceAmount, currency: priceCurrency } = getDisplayPrice(selectedVariant);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-white via-green-50/20 to-white">
      {/* Animated Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="animate-blob absolute -top-40 -left-40 h-96 w-96 rounded-full bg-green-500/40 blur-3xl will-change-transform"></div>
        <div className="animate-blob animation-delay-2000 absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-green-400/30 blur-3xl will-change-transform"></div>
        <div className="animate-blob animation-delay-4000 absolute bottom-20 left-1/4 h-64 w-64 rounded-full bg-green-400/50 blur-2xl will-change-transform"></div>

        {/* Geometric Shapes */}
        <div className="animate-spin-slow absolute top-20 right-1/4 h-32 w-32 rotate-45 border-2 border-green-400/20 will-change-transform"></div>
        <div className="animate-float-slow absolute bottom-40 left-1/3 h-24 w-24 rounded-lg border-2 border-green-500/20 will-change-transform"></div>

        {/* Subtle Grid Lines - Fixed Opacity FOUC */}
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hero-grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(34, 197, 94, 0.15)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid-pattern)" />
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
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 text-lg font-medium text-white shadow-lg shadow-green-500/30 transition-all hover:scale-105 hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-500/40"
              >
                View Packages
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border-2 border-gray-300 bg-white/80 px-8 py-4 text-lg font-medium text-gray-700 shadow-lg backdrop-blur-sm transition-all hover:scale-105 hover:border-green-500 hover:bg-green-50"
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

          {/* Right Visual - Dynamic Product Card */}
          <div className="relative hidden lg:block">
            {loading ? (
              <div className="flex h-[600px] items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-green-600" />
              </div>
            ) : product ? (
              <div className="relative h-[600px]">
                {/* Product Card */}
                <div className="animate-float-center absolute top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-3xl border-2 border-green-500/20 bg-white p-6 shadow-2xl backdrop-blur-md transition-all hover:border-green-500/50">
                  {/* Product Image */}
                  <div className="relative mb-6 h-48 w-full overflow-hidden rounded-2xl bg-gray-100">
                     <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0].url
                          : "/product-placeholder.svg"
                      }
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                      Best Seller
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold leading-tight text-gray-900">
                      {product.title}
                    </h3>
                    
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-green-600">
                        {formatCurrency(priceAmount / 100, priceCurrency)}
                      </span>
                      {(selectedVariant?.metadata?.compare_at_price || 0) > 0 && (
                        <span className="text-sm font-medium text-gray-400 line-through">
                          {formatCurrency(
                            (selectedVariant?.metadata?.compare_at_price as number) / 100,
                            priceCurrency
                          )}
                        </span>
                      )}
                    </div>

                    {/* Variant Selector (if multiple) */}
                    {product.variants && product.variants.length > 1 && (
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => handleVariantSelect(variant)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                              selectedVariant?.id === variant.id
                                ? "bg-green-100 text-green-700 ring-2 ring-green-500"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {variant.title}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Buy Button */}
                    <Button
                      onClick={handleBuyItNow}
                      disabled={!selectedVariant || isBuying}
                      className="h-14 w-full cursor-pointer rounded-xl bg-gradient-to-r from-green-600 to-green-700 text-lg font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:scale-[1.02] hover:from-green-700 hover:to-green-800 disabled:opacity-70"
                    >
                      {isBuying ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Buy It Now
                        </>
                      )}
                    </Button>
                    
                    <p className="text-center text-xs text-gray-500">
                      Instant Delivery • 24/7 Support • Secure Payment
                    </p>
                  </div>
                </div>

                {/* Floating Elements (Decorations) */}
                <div className="absolute top-20 -right-4 animate-bounce rounded-full bg-white p-3 shadow-xl" style={{ animationDuration: "3s" }}>
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="absolute bottom-20 -left-4 animate-pulse rounded-full bg-white p-3 shadow-xl">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
            ) : (
              // Fallback to static if fetch fails (Original Static Content)
              <div className="relative h-[600px]">
                <div className="animate-float-center absolute top-2/3 left-3/4 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border-2 border-green-500/50 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
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
              </div>
            )}
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
