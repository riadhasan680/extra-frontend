"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { storeService } from "@/services/store.service";
import { Product, ProductVariant } from "@/types/api";
import { useRouter } from "next/navigation";

import { formatCurrency } from "@/lib/utils";

export function ProductSection({ initialProduct }: { initialProduct?: Product | null }) {
  const [product, setProduct] = useState<Product | null>(initialProduct || null);
  const [loading, setLoading] = useState(!initialProduct);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  
  const { toast } = useToast();
  const router = useRouter();

  // Initialize variant if product is provided initially
  useEffect(() => {
    if (initialProduct && initialProduct.variants && initialProduct.variants.length > 0) {
      setSelectedVariant(initialProduct.variants[0]);
    }
  }, [initialProduct]);

  // Fallback fetch if no initial product provided or if initial product is invalid (zero price)
  useEffect(() => {
    // Check if initial product is valid (has variants and price > 0)
    const isInitialValid = initialProduct && 
                          initialProduct.variants && 
                          initialProduct.variants.length > 0 && 
                          (initialProduct.variants[0].price > 0);

    if (isInitialValid) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await storeService.getProducts();
        const foundProduct = products[0]; 
        
        if (foundProduct) {
          setProduct(foundProduct);
          if (foundProduct.variants && foundProduct.variants.length > 0) {
            setSelectedVariant(foundProduct.variants[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [initialProduct]);

  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
  };

  const handleBuyItNow = async () => {
    if (!selectedVariant || !product) return;

    try {
      setIsBuying(true);

      // Step 1: Create Cart
      // Fetch regions to find US or default region ID to ensure prices are calculated
      let regionId: string | undefined;
      try {
        const regions = await storeService.getRegions();
        // Try to find US region or fallback to first region
        const usRegion = regions.find((r: any) => r.countries?.some((c: any) => c.iso_2 === 'us'));
        const defaultRegion = regions[0];
        
        if (usRegion) {
          regionId = usRegion.id;
        } else if (defaultRegion) {
          regionId = defaultRegion.id;
        }
      } catch (e) {
        console.warn("Failed to fetch regions, attempting to create cart without explicit region", e);
      }

      let cart;
      try {
        cart = await storeService.createCart(regionId ? { region_id: regionId } : undefined);
        await storeService.addToCart(cart.id, selectedVariant.id, 1);
      } catch (cartError: any) {
         const errMsg = cartError.response?.data?.message || "";
         // If error is related to stock location/sales channel, retry without explicit region
         // This handles cases where the API key's default sales channel doesn't match the region context
         if (errMsg.includes("stock location") || errMsg.includes("Sales Channel")) {
             console.warn("First attempt failed, retrying without explicit region...", cartError);
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
            // We continue even if affiliate fails, maybe just log it
          }
        }
      }

      // Step 4: Redirect to Cart (Step 1 of flow)
      // We redirect to cart page to allow user to adjust quantity and add Twitch link
      router.push(`/cart?cart_id=${cart.id}`);

    } catch (error: any) {
      console.error("Buy It Now failed", error);
      
      let errorMessage = "Failed to process request. Please try again.";
      // Handle specific Medusa errors (e.g., Stock Location missing)
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        // User friendly message for stock location error
        if (errorMessage.includes("associated with any stock location")) {
          errorMessage = "System Error: Sales Channel is not linked to Inventory. Please contact support.";
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsBuying(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-white py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </section>
    );
  }

  // Fallback if no product found
  if (!product) {
    return (
      <section className="bg-white py-20 flex justify-center">
        <div className="text-center">
           <p className="text-xl font-semibold text-gray-500">No products available.</p>
           <p className="text-sm text-gray-400 mt-2">Check your connection or try again later.</p>
           <Button 
             variant="outline" 
             className="mt-4"
             onClick={() => window.location.reload()}
           >
             Retry
           </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20 transition-colors duration-300">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Main Product */}
        <div className="mb-20 grid items-center gap-16 md:grid-cols-2">
          {/* Left - Product Image */}
          <div className="relative flex justify-center py-8">
            <div className="group perspective-1000 relative h-80 w-64">
              {/* CSS 3D Box Mockup */}
              <div className="transform-style-3d relative h-full w-full transition-transform duration-500 group-hover:rotate-y-12">
                {/* Front Face */}
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-lg border border-purple-400/30 bg-gradient-to-br from-purple-600 to-purple-800 p-1 text-white shadow-2xl backface-hidden overflow-hidden">
                   <img 
                     src={product.images && product.images.length > 0 ? product.images[0].url : "/product-placeholder.svg"} 
                     alt={product.title}
                     className="h-full w-full object-cover rounded"
                   />
                </div>

                {/* Side Face (Depth) */}
                <div className="absolute top-0 right-0 flex h-full w-12 origin-right translate-x-12 -translate-z-[1px] rotate-y-90 transform items-center justify-center overflow-hidden rounded-r-lg bg-purple-900 brightness-75">
                  <span className="-rotate-90 transform text-xs font-bold tracking-widest whitespace-nowrap text-white opacity-50">
                    TWITCH PROMO
                  </span>
                </div>

                {/* Shadow */}
                <div className="absolute right-4 -bottom-8 left-4 h-4 rounded-[100%] bg-black/20 blur-xl"></div>
              </div>
            </div>
          </div>

          {/* Right - Product Details */}
          <div className="space-y-4">
            <h2 className="text-3xl leading-tight font-normal text-[#1a1a1a] md:text-[34px]">
              {product.title}
              <br />
              <span className="text-lg opacity-80">{product.description}</span>
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              {selectedVariant && (
                <>
                  {/* Original Price (Strikethrough) - Compare At Price */}
                  {(selectedVariant.metadata?.compare_at_price || 0) > 0 && (
                    <span className="text-lg font-bold text-gray-400 line-through decoration-gray-400">
                      {formatCurrency(((selectedVariant.metadata?.compare_at_price || 0) / 100))}
                    </span>
                  )}
                  {/* Current Price */}
                  <span className="text-[24px] font-bold text-[#b02484]">
                    {formatCurrency((selectedVariant.prices?.[0]?.amount || selectedVariant.price || 0) / 100)}
                  </span>
                  {/* Discount Text */}
                  {product.metadata?.discount_text && (
                     <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold">
                       {product.metadata.discount_text}
                     </span>
                  )}
                </>
              )}
            </div>

            <div className="my-6 h-px w-full bg-gray-200"></div>

            {/* Variant Options */}
            <div>
              <p className="mb-2 text-sm font-normal text-[#4a4a4a]">Day</p>
              <div className="flex flex-wrap gap-3">
                {product.variants?.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => handleVariantSelect(variant)}
                    className={`cursor-pointer rounded px-6 py-2.5 text-sm font-bold shadow-sm transition-colors border ${
                      selectedVariant?.id === variant.id
                        ? "bg-[#9c2a8c] border-[#9c2a8c] text-white hover:bg-[#852277]"
                        : "border-[#e5e7eb] bg-white text-[#9c2a8c] hover:border-[#9c2a8c]"
                    }`}
                  >
                    {variant.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Buy Button */}
            <div className="space-y-4 pt-4">
              <Button 
                onClick={handleBuyItNow}
                disabled={!selectedVariant || isBuying}
                className="h-12 w-full cursor-pointer rounded bg-[#9c2a8c] text-[16px] font-bold text-white shadow transition-all hover:bg-[#852277] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuying ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingBag className="mr-2 h-5 w-5" />
                )}
                {isBuying ? "Processing..." : "Buy It Now"}
              </Button>

              {/* Full Details Link */}
              <Link
                href={`/products/${product.id}`}
                className="flex inline-block items-center text-sm text-[#3d4246] underline decoration-gray-300 underline-offset-4 hover:text-[#9c2a8c]"
              >
                Full details <span className="ml-1 text-xs">➜</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Partner Websites Examples */}
        <div className="mb-20 rounded bg-[#f8f9fa] p-12 text-center transition-colors">
          <h3 className="mb-2 text-xl font-bold text-[#1a1a1a] md:text-2xl">
            Here are a few examples of our current
          </h3>
          <h3 className="mb-8 text-xl font-normal text-[#1a1a1a] md:text-2xl">
            partnered websites where you can see examples of our advertisements
            at any time:
          </h3>

          <div className="mx-auto mb-8 flex max-w-lg flex-col items-center gap-4">
            <a
              href="#"
              className="border-b-2 border-black pb-0.5 font-bold text-black transition-colors hover:border-[#9c2a8c] hover:text-[#9c2a8c]"
            >
              https://www.thedoublekill.com/
            </a>
            <a
              href="#"
              className="border-b-2 border-black pb-0.5 font-bold text-black transition-colors hover:border-[#9c2a8c] hover:text-[#9c2a8c]"
            >
              https://pcgametrends.org/
            </a>
            <a
              href="#"
              className="border-b-2 border-black pb-0.5 font-bold text-black transition-colors hover:border-[#9c2a8c] hover:text-[#9c2a8c]"
            >
              https://www.gamingnews24.net/
            </a>
          </div>

          <p className="mx-auto max-w-3xl text-sm leading-relaxed text-[#4a4a4a] italic">
            This promotion is 100% compliant with Twitch TOS, we have many
            partner clients and have done tournament work for Esports and Gaming
            organizations and have never had an issue with a suspension or ban
            to date.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="mb-20 space-y-8">
          <div className="mb-10 text-center">
            <h3 className="inline-block border-b-2 border-black pb-1 text-xl font-bold text-[#1a1a1a] italic">
              Frequently Asked Questions:
            </h3>
          </div>

          <div className="mx-auto max-w-4xl space-y-12 text-center">
            {/* FAQ 1 */}
            <div>
              <h4 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[#1a1a1a]">
                👉 How many viewers will I get?
              </h4>
              <p className="text-[15px] leading-7 text-[#4a4a4a]">
                It is normal to see viewer count fluctuation given the methods
                we promote you. The viewership will depend on a lot of factors
                such as time of day, category you are streaming, website traffic
                etc.{" "}
                <span className="font-bold text-black">
                  On average most clients will see an increase in 10-20 viewers
                  throughout the stream.
                </span>
              </p>
            </div>

            {/* FAQ 2 */}
            <div>
              <h4 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[#1a1a1a]">
                Some suggestions from us to ensure best results 👇👇 :
              </h4>
              <div className="space-y-6 text-[15px] leading-7 text-[#4a4a4a]">
                <p>
                  <span className="font-bold text-black">
                    Turn off follower only chat
                  </span>{" "}
                  - This will undoubtedly discourage engagement from new
                  viewers. There are some people who will want to engage with
                  your stream before they decide to follow
                </p>
                <p>
                  <span className="font-bold text-black">
                    Turn off mature audience filter
                  </span>{" "}
                  - With this filter on you are avoiding being put on Twitch
                  categories such as the "live channels we think you will like"
                  section and others as well. The people viewing your
                  advertisements will also have to click an extra time to get
                  into your channel which is an extra objection we want to
                  overcome if possible. If your channel truly needs the mature
                  audience filter we understand though.
                </p>

                <p>
                  <span className="font-bold text-black">
                    Consider a less saturated game
                  </span>{" "}
                  - The whole basis behind our promotion strategy involves
                  raising your Twitch category ranking which will happen no
                  matter what category you are playing under. A game where you
                  can rank close to the top of the list will most likely yield
                  the best results, just something to keep in mind if you are at
                  early stages of community growth and struggling to get your
                  regulars.
                </p>
              </div>
            </div>

            {/* FAQ 3 */}
            <div>
              <h4 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-[#1a1a1a]">
                Avoid restarts whenever possible
              </h4>
              <p className="text-[15px] leading-7 text-[#4a4a4a]">
                - The most expensive part of running your ads is when your
                stream first goes live as our software has to find viewers that
                will stop scrolling for a bit, when your stream goes offline so
                will your ads and anyone viewing from an embed is going to be
                dropped as well. For best results and length of promotion time
                try to stream continuously
              </p>
              <p className="mt-6 text-[15px] leading-7 font-bold text-black">
                These suggestions above are simply just that, suggestions.
                Ultimately it is your channel and your choice what to do, these
                are just things we see help ensure the best results from
                utilization of our promotion!
              </p>
            </div>
          </div>
        </div>

        {/* Second Product - UNLIMITED (Purple BG Section now moved to CTA section file as requested earlier, keeping here just in case user wants structure kept but modified design) */}
        {/* We moved the unlimited product to `cta-product-section.tsx` in previous steps. Assuming this file focuses on the first product as per screenshot context. */}
      </div>
    </section>
  );
}
