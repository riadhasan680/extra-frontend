"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { storeService } from "@/services/store.service";
import { Product } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ShoppingCart, Check } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/ui/toast";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
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

  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      title: product.title,
      price: Number(product.price) || 0,
      image: product.thumbnail
    });

    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
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
           {product.thumbnail ? (
             <img 
               src={product.thumbnail} 
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

          <div className="mt-auto pt-6">
            <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
