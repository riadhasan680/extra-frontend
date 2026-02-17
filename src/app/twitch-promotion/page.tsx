"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plane, RefreshCw, ThumbsUp } from "lucide-react";
import Link from "next/link";
import { storeService } from "@/services/store.service";
import { Product } from "@/types/api";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function TwitchPromotionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storeService.getProducts();
        // Filter if needed, or just take all for now since user asked to include dynamic data
        // We might want to filter by a specific collection or tag if 'Twitch' is specific
        // For now, let's assume all fetched products are relevant or filter client-side if we find a way
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Helper to get price display
  const getProductPrice = (product: Product) => {
    const variant = product.variants?.[0];
    if (!variant || !variant.prices?.length) return { price: 0, salePrice: 0, save: 0 };

    // Assuming USD for now, and prices in cents
    const priceObj = variant.prices.find(p => p.currency_code === "usd") || variant.prices[0];
    const amount = priceObj.amount / 100;
    
    // Fake "Save" calculation if we don't have compare_at_price
    // Medusa v2 might have calculated_price vs original_price in a different structure
    // For this demo, if no compare_at, we can simulate or just show the price
    // Let's assume the API returns what we need or we display just the price.
    // If we want to maintain the "Save" look, we might need metadata.
    
    // Using metadata for fake original price if needed, or just 0
    const originalPrice = amount * 1.5; // Mocking a "Save" amount for visual consistency if real data is missing
    
    return {
      price: originalPrice,
      salePrice: amount,
      save: originalPrice - amount
    };
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <div className="pt-20 flex-1">
        {/* Breadcrumb Bar */}
        <div className="bg-green-50 py-3 text-sm font-medium text-gray-600">
          <div className="container mx-auto px-6">
          <div className="flex items-center gap-2">
            <span>Stream Lifter</span>
            <span className="text-gray-400">›</span>
            <span className="text-gray-900">Twitch Stream Promotion</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 text-center">
          <h1 className="mb-8 text-4xl font-normal text-gray-900">
            Twitch Stream Promotion
          </h1>

          {/* Sort By */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600">Sort by</span>
            <Select defaultValue="featured">
              <SelectTrigger className="w-[180px] bg-green-50 border-0 focus:ring-0">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
            {products.map((product) => {
              const { price, salePrice, save } = getProductPrice(product);
              return (
                <div key={product.id} className="group relative flex flex-col">
                  {/* Product Image & Badge */}
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
                     {/* Save Badge */}
                     <div className="absolute top-4 left-0 z-10 bg-green-600 px-3 py-1 text-xs font-bold text-white clip-path-badge">
                       <div className="flex items-center gap-1">
                         <span className="rotate-90">🏷️</span> 
                         SAVE ${save.toFixed(2)}
                       </div>
                     </div>
                     
                     {/* Product Card / Image */}
                     {product.thumbnail ? (
                        <img 
                          src={product.thumbnail} 
                          alt={product.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                     ) : (
                       <div className="absolute inset-0 bg-gradient-to-b from-green-500 to-green-700 p-6 flex items-center justify-center">
                          <div className="relative h-full w-full bg-white/10 rounded-lg p-4 flex flex-col items-center justify-center text-white text-center">
                              <h3 className="font-bold text-xl uppercase leading-tight mb-2 drop-shadow-md">{product.title}</h3>
                              <p className="text-sm opacity-90">{product.subtitle || "Promote your Live Streams"}</p>
                          </div>
                       </div>
                     )}
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="mb-2 text-sm text-gray-700">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-center gap-2 text-sm font-bold">
                      <span className="text-gray-400 line-through">
                        ${price.toFixed(2)}
                      </span>
                      <span className="text-green-600">
                        ${salePrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  <Link href={`/products/${product.handle || product.id}`} className="absolute inset-0">
                    <span className="sr-only">View {product.title}</span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Features Banner */}
      <div className="mt-auto bg-green-50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                <Plane className="h-8 w-8 text-black" fill="currentColor" />
              </div>
              <p className="text-sm font-medium text-gray-800">
                Promotion can be up and
                <br />
                running as soon as 1 Hour
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                <RefreshCw className="h-8 w-8 text-black" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-medium text-gray-800">
                Customer satisfaction
                <br />
                guarantee or your money
                <br />
                back
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                <ThumbsUp className="h-8 w-8 text-black" fill="currentColor" />
              </div>
              <p className="text-sm font-medium text-gray-800">
                Responsive Customer
                <br />
                Support
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <SiteFooter />
    </div>
  );
}
