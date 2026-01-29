"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { storeService } from "@/services/store.service";
import { Product, ProductVariant } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ShoppingCart, Check, Zap } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await storeService.getProduct(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleBuyItNow = async () => {
    if (!product) return;

    try {
      setIsBuying(true);

      // Step 1: Create Cart
      const cart = await storeService.createCart();
      
      // Step 2: Add Variant to Cart (Default to first variant or product ID)
      const variantId = product.variants && product.variants.length > 0 
        ? product.variants[0].id 
        : product.id;
        
      await storeService.addToCart(cart.id, variantId, 1);

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

      // Step 4: Redirect to Checkout
      router.push(`/checkout?cart_id=${cart.id}`);

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

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-4" variant="outline">
          <Link href="/products">Back to Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/products" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>
      </Button>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Image */}
        <div className="overflow-hidden rounded-xl border bg-gray-50 dark:bg-gray-900">
           {product.imageUrl ? (
             <img 
               src={product.imageUrl} 
               alt={product.title}
               className="h-full w-full object-cover"
             />
           ) : (
             <div className="flex h-96 items-center justify-center text-gray-400">
               No Image Available
             </div>
           )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <p className="mt-4 text-3xl font-bold text-purple-600">
              {product.price ? `$${(Number(product.price) / 100).toFixed(2)}` : "Price on Request"}
            </p>
          </div>
          
          <div className="prose dark:prose-invert">
            <p>{product.description}</p>
          </div>

          <div className="mt-8">
            <Button 
              size="lg" 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleBuyItNow}
              disabled={isBuying}
            >
              {isBuying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Buy It Now
                </>
              )}
            </Button>
            <p className="mt-2 text-center text-sm text-gray-500">
              Instant checkout. No account required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
