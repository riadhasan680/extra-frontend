"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { Plane, RotateCcw, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { storeService } from "@/services/store.service";
import { Product, ProductVariant } from "@/types/api";
import { useRouter } from "next/navigation";

export function CtaProductSection({ initialProduct }: { initialProduct?: Product | null }) {
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [isBuying, setIsBuying] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  // Fallback fetch if no initial product provided
  useEffect(() => {
    if (initialProduct) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await storeService.getProducts();
        const foundProduct = products.length > 1 ? products[1] : products[0]; 
        
        if (foundProduct) {
          setProduct(foundProduct);
        }
      } catch (error) {
        console.error("Failed to fetch CTA product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [initialProduct]);

  const handleBuyItNow = async () => {
    if (!product) return;

    try {
      setIsBuying(true);

      // Step 1: Create Cart
      let regionId: string | undefined;
      try {
        const regions = await storeService.getRegions();
        const usRegion = regions.find((r: any) => r.countries?.some((c: any) => c.iso_2 === 'us'));
        const defaultRegion = regions[0];
        
        if (usRegion) {
          regionId = usRegion.id;
        } else if (defaultRegion) {
          regionId = defaultRegion.id;
        }
      } catch (e) {
        console.warn("Failed to fetch regions", e);
      }

      // Step 2: Add Variant to Cart
      if (!product.variants || product.variants.length === 0) {
        throw new Error("Product has no variants available");
      }
      const variantId = product.variants[0].id;

      let cart;
      try {
        cart = await storeService.createCart(regionId ? { region_id: regionId } : undefined);
        await storeService.addToCart(cart.id, variantId, 1);
      } catch (cartError: any) {
         const errMsg = cartError.response?.data?.message || "";
         if (errMsg.includes("stock location") || errMsg.includes("Sales Channel")) {
             console.warn("First attempt failed, retrying without explicit region...", cartError);
             cart = await storeService.createCart(); // Retry without region
             await storeService.addToCart(cart.id, variantId, 1);
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

      // Step 4: Redirect to Cart (Step 1 of flow)
      router.push(`/cart?cart_id=${cart.id}`);

    } catch (error) {
      console.error("Buy It Now failed", error);
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Purple Background with Twitch Pattern */}
      <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 py-20">
        {/* Twitch Logo Pattern Background */}
        <div className="pointer-events-none absolute inset-0 opacity-10">
          {/* Fallback pattern if image not available */}
          <div className="grid grid-cols-12 gap-8 p-8 opacity-20">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="rotate-12 transform text-4xl text-white">
                <svg
                  className="h-12 w-12"
                  viewBox="0 0 256 268"
                  fill="currentColor"
                >
                  <path d="M17.458 0L0 46.556v186.201h63.983v34.934h34.931l34.898-34.934h52.36L256 162.954V0H17.458zm23.259 23.263H232.73v128.029l-40.739 40.741H128L93.113 226.92v-34.886H40.717V23.263zm64.008 116.405H128V69.844h-23.275v69.824zm63.997 0h23.27V69.844h-23.27v69.824z" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto mb-16 max-w-6xl px-6 text-center text-white">
          <h2 className="mb-8 text-5xl font-normal md:text-6xl">
            So What Are You
            <br />
            Waiting For <span className="font-bold">?</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed font-medium md:text-2xl">
            It's time to start chasing those affiliate or partner goals through
            a<br />
            TOS compliant boost to your organic reach on Twitch
          </p>
        </div>
      </div>

      {/* White Product Section */}
      <div className="bg-white py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            {/* Left - Product Images */}
            <div className="relative flex justify-center">
              <div className="group perspective-1000 relative h-72 w-56 -rotate-3 transform transition-transform duration-500 hover:rotate-0">
                {/* CSS 3D Box Mockup */}
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border border-pink-400/30 bg-gradient-to-br from-[#9c2a8c] to-[#6a1b5f] p-1 text-white shadow-2xl overflow-hidden">
                   <img 
                     src={product?.images && product.images.length > 0 ? product.images[0].url : "/product-placeholder.svg"} 
                     alt={product?.title || "Product"}
                     className="h-full w-full object-cover rounded"
                   />
                </div>
                {/* Shadow */}
                <div className="absolute right-2 -bottom-6 left-2 h-4 rounded-[100%] bg-black/30 blur-lg"></div>
              </div>
            </div>

            {/* Right - Product Details */}
            <div className="space-y-8">
              <h3 className="text-4xl leading-tight font-normal text-gray-900">
                UNLIMITED Twitch Stream
                <br />
                Promotion - Embedding -<br />
                One Month (Recurring)
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-xl font-bold text-gray-900 line-through">
                  $659.95
                </span>
                <span className="text-xl font-bold text-[#b02484]">
                  $250.00
                </span>
              </div>

              {/* Day Options */}
              <div>
                <p className="mb-2 text-sm text-gray-600">Day</p>
                <div className="inline-block rounded-sm bg-[#9c2a8c] px-8 py-2 font-medium text-white">
                  1 Month
                </div>
              </div>

              {/* Buy Button */}
              <div>
                <Button 
                  onClick={handleBuyItNow}
                  disabled={!product || isBuying}
                  className="cursor-pointer h-12 w-full rounded-[4px] bg-[#9c2a8c] text-lg font-medium text-white shadow-md transition-all hover:bg-[#852277] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBuying ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                  )}
                  {isBuying ? "Processing..." : "Buy It Now"}
                </Button>

                <Link
                  href={product ? `/products/${product.id}` : "#details"}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-gray-500 underline decoration-gray-400 hover:text-purple-700"
                >
                  Full details <span className="no-underline">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Section - Matched to Screenshot */}
      <div className="bg-[#dad8f9] py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Badge 1 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <Plane className="h-8 w-8 fill-current text-black" />
              </div>
              <p className="text-[15px] leading-tight text-[#4a4a4a]">
                Promotion can be up and
                <br />
                running as soon as 1 Hour
              </p>
            </div>

            {/* Badge 2 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <RotateCcw className="h-8 w-8 text-black" />
              </div>
              <p className="text-[15px] leading-tight text-[#4a4a4a]">
                Customer satisfaction
                <br />
                guarantee or your money
                <br />
                back
              </p>
            </div>

            {/* Badge 3 */}
            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <ThumbsUp className="h-8 w-8 fill-current text-black" />
              </div>
              <div className="pt-1 text-[15px] leading-tight text-[#4a4a4a]">
                Responsive Customer
                <br />
                Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
