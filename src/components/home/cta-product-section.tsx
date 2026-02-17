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

export function CtaProductSection({
  initialProduct,
}: {
  initialProduct?: Product | null;
}) {
  const [product, setProduct] = useState<Product | null>(
    initialProduct || null
  );
  const [loading, setLoading] = useState(!initialProduct);
  const [isBuying, setIsBuying] = useState(false);

  const primaryVariant: ProductVariant | undefined = product?.variants?.[0];

  const parseQuantity = (value: any, fallback: number) => {
    if (typeof value === "number") {
      return Number.isFinite(value) && value > 0 ? value : fallback;
    }
    if (typeof value === "string") {
      const parsed = parseInt(value, 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    }
    return fallback;
  };

  const priceEntry =
    primaryVariant?.prices && primaryVariant.prices.length > 0
      ? primaryVariant.prices.find((p) => p.currency_code === "usd") ||
        primaryVariant.prices[0]
      : undefined;

  const salePrice =
    priceEntry && typeof priceEntry.amount === "number"
      ? priceEntry.amount / 100
      : undefined;

  const originalPrice =
    salePrice !== undefined
      ? primaryVariant?.metadata?.original_price_cents != null
        ? primaryVariant.metadata.original_price_cents / 100
        : salePrice * 1.5
      : undefined;

  const durationLabel =
    (primaryVariant?.metadata &&
      (primaryVariant.metadata as any).duration_label) ||
    primaryVariant?.title ||
    "1 Month";

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

      if (!product.variants || product.variants.length === 0) {
        throw new Error("Product has no variants available");
      }
      const variant = product.variants[0];
      const variantMeta = (variant.metadata || {}) as any;
      const productMeta = (product.metadata || {}) as any;

      const mainQuantity = parseQuantity(
        variantMeta.bundle_main_quantity ?? productMeta.bundle_main_quantity,
        1
      );
      const extraQuantity = parseQuantity(
        variantMeta.bundle_extra_quantity ?? productMeta.bundle_extra_quantity,
        1
      );

      const variantId = variant.id;

      let cart;
      try {
        cart = await storeService.createCart(
          regionId ? { region_id: regionId } : undefined
        );
        await storeService.addToCart(cart.id, variantId, mainQuantity);
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
          cart = await storeService.createCart();
          await storeService.addToCart(cart.id, variantId, mainQuantity);
        } else {
          throw cartError;
        }
      }

      // Step 2b: Optionally add bundled Twitch promotion product to the same cart
      try {
        const metadata: any = productMeta;

        const bundledVariantId: string | undefined =
          metadata.bundle_extra_variant_id;

        const bundledHandle: string | undefined =
          metadata.bundle_extra_product_handle || metadata.bundle_extra_product_id;

        if (bundledVariantId) {
          await storeService.addToCart(cart.id, bundledVariantId, extraQuantity);
        } else if (bundledHandle) {
          try {
            const bundledProduct = await storeService.getProduct(bundledHandle);
            const bundledVariant = bundledProduct.variants?.[0];
            if (bundledVariant?.id) {
              await storeService.addToCart(
                cart.id,
                bundledVariant.id,
                extraQuantity
              );
            }
          } catch (bundleError) {
            console.error("Failed to load bundled product", bundleError);
          }
        } else {
          // Fallback: if no metadata is configured, try to find another Twitch product dynamically
          try {
            const allProducts = await storeService.getProducts();
            const fallback = allProducts.find(
              (p) =>
                p.id !== product.id &&
                p.title.toLowerCase().includes("twitch stream promotion")
            );
            const fallbackVariant = fallback?.variants?.[0];
            if (fallbackVariant?.id) {
              await storeService.addToCart(
                cart.id,
                fallbackVariant.id,
                extraQuantity
              );
            }
          } catch (fallbackError) {
            console.error("Failed to add fallback bundled product", fallbackError);
          }
        }
      } catch (bundleError) {
        console.error("Bundled product step failed", bundleError);
        // Do not block checkout if bundle step fails – user still gets the Unlimited package
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
    } catch (error: any) {
      console.error("Buy It Now failed", error);
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message;
      toast({
        title: "Error",
        description:
          backendMessage ||
          "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <section className="relative overflow-hidden">
      {/* Green Background with Twitch Pattern */}
      <div className="bg-gradient-to-br from-green-900 via-green-800 to-green-900 py-20">
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
              <div className="group perspective-1000 relative h-[500px] w-full">
                {/* CSS 3D Box Mockup */}
                <div className="absolute   inset-0 flex flex-col items-center justify-center overflow-hidden">
                  <img
                    src={
                      product?.images && product.images.length > 0
                        ? product.images[0].url
                        : "/product-placeholder.svg"
                    }
                    alt={product?.title || "Product"}
                    className="h-full   rounded object-cover"
                  />
                </div>
                {/* Shadow */}
                <div className="absolute right-2 -bottom-6 left-2 h-4 rounded-[100%] bg-black/30 blur-lg"></div>
              </div>
            </div>

            {/* Right - Product Details */}
            <div className="space-y-8">
              <h3 className="text-4xl leading-tight font-normal text-gray-900">
                {product?.title ||
                  "UNLIMITED Twitch Stream Promotion - Embedding - One Month (Recurring)"}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {originalPrice !== undefined && (
                  <span className="text-xl font-bold text-gray-900 line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xl font-bold text-[#22c55e]">
                  {salePrice !== undefined ? `$${salePrice.toFixed(2)}` : "$0.00"}
                </span>
              </div>

              {/* Day Options */}
              <div>
                <p className="mb-2 text-sm text-gray-600">Day</p>
                <div className="inline-block rounded-sm bg-[#22c55e] px-8 py-2 font-medium text-white">
                  {durationLabel}
                </div>
              </div>

              {/* Buy Button */}
              <div>
                <Button
                  onClick={handleBuyItNow}
                  disabled={!product || isBuying}
                  className="h-12 w-full cursor-pointer rounded-[4px] bg-[#22c55e] text-lg font-medium text-white shadow-md transition-all hover:bg-[#16a34a] disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="mt-4 inline-flex items-center gap-1 text-sm text-gray-500 underline decoration-gray-400 hover:text-green-700"
                >
                  Full details <span className="no-underline">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Section - Matched to Screenshot */}
      <div className="bg-white py-16">
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
