"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { storeService } from "@/services/store.service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Minus, Plus, ShoppingBag, Lock } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

function CartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const cartId = searchParams.get("cart_id");

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [twitchLink, setTwitchLink] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);

  useEffect(() => {
    if (!cartId) {
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        setLoading(true);
        const cartData = await storeService.getCart(cartId);
        setCart(cartData);

        if (cartData.items && cartData.items.length > 0) {
          const item = cartData.items[0];
          setQuantity(item.quantity);
          setTwitchLink(item.metadata?.service_link || "");
          setCurrentItemId(item.id);
        }
      } catch (error) {
        console.error("Failed to load cart", error);
        toast({
          title: "Error",
          description: "Failed to load cart details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [cartId]);

  const handleQuantityChange = (delta: number) => {
    const newQty = Math.max(1, quantity + delta);
    setQuantity(newQty);
  };

  const handleUpdateCart = async () => {
    if (!cartId || !currentItemId) return;

    try {
      setUpdating(true);
      await storeService.updateLineItem(cartId, currentItemId, quantity, {
        service_link: twitchLink,
      });

      toast({
        title: "Success",
        description: "Cart updated successfully",
      });

      const updatedCart = await storeService.getCart(cartId);
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to update cart", error);
      toast({
        title: "Error",
        description: "Failed to update cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleProcessToCheckout = async () => {
    if (!cartId || !currentItemId) return;

    if (!twitchLink.trim()) {
      toast({
        title: "Required",
        description: "Please enter your Twitch Profile Link",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);

      await storeService.updateLineItem(cartId, currentItemId, quantity, {
        service_link: twitchLink,
      });

      router.push(`/checkout?cart_id=${cartId}`);
    } catch (error) {
      console.error("Failed to process to checkout", error);
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-white">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <Link href="/">
          <Button className="bg-green-600 hover:bg-green-700">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  const item = cart.items[0];
  const product = item.variant?.product;

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        <p className="text-gray-500">Loading product details...</p>
      </div>
    );
  }

  const mainImage =
    product.images && product.images.length > 0
      ? product.images[0].url
      : product.thumbnail || "/product-placeholder.svg";

  const computedSubtotal = cart.items.reduce((sum: number, line: any) => {
    const lineQuantity = line.id === currentItemId ? quantity : line.quantity;
    return sum + (line.unit_price * lineQuantity) / 100;
  }, 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Compact */}
      <header className="border-b border-gray-200 bg-white py-3">
        <div className="container mx-auto flex max-w-6xl items-center justify-between px-4">
          <Link href="/">
            <img src="/logo.svg" alt="StreamLifter" className="h-9 w-auto" />
          </Link>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 p-2 text-white">
            <ShoppingBag className="h-4 w-4" />
          </div>
        </div>
      </header>

      {/* Banner - Compact */}
      <div className="relative overflow-hidden bg-linear-to-br from-[#2a0a66] via-[#340c7f] to-gren-700 py-12 text-white">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 w-96 -translate-x-1/2 -translate-y-1/2">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg"
              alt=""
              className="w-full brightness-0 grayscale invert"
            />
          </div>
        </div>
        <div className="relative container mx-auto max-w-6xl px-4 text-center">
          <h1 className="text-4xl font-black tracking-tight uppercase">
            YOUR CART
          </h1>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-6">
        {/* Breadcrumb - Compact */}
        <div className="mb-6 text-xs">
          <Link href="/" className="text-gray-500 hover:text-green-600">
            Home
          </Link>
          <span className="mx-1.5 text-gray-300">/</span>
          <span className="font-medium text-green-600">Checkout</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-12">
            {/* Table Header - Compact */}
            <div className="hidden grid-cols-12 gap-3 border-b border-gray-200 pb-2.5 text-xs font-bold tracking-wider text-gray-700 uppercase md:grid">
              <div className="col-span-6">PRODUCTS</div>
              <div className="col-span-2 text-center">PRICE</div>
              <div className="col-span-2 text-center">QUANTITY</div>
              <div className="col-span-2 text-right">TOTAL</div>
            </div>

            {/* Product Row - Compact (Primary Item) */}
            <div className="grid grid-cols-1 items-center gap-4 border-b border-gray-200 pb-5 md:grid-cols-12">
              <div className="col-span-1 flex gap-4 md:col-span-6">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50 p-1.5">
                  <img
                    src={mainImage}
                    alt={product.title}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-sm leading-tight font-semibold text-gray-800">
                    {product.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.variant.title}
                  </p>
                  <button className="mt-2 text-left text-xs text-green-600 underline">
                    Remove
                  </button>
                </div>
              </div>

              <div className="col-span-1 text-center text-base font-bold text-gray-900 md:col-span-2">
                {formatCurrency(item.unit_price / 100)}
              </div>

              <div className="col-span-1 flex justify-center md:col-span-2">
                <div className="flex items-center rounded border border-gray-300">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="px-2.5 py-1.5 text-green-600 cursor-pointer transition-colors hover:bg-green-100"
                    disabled={updating || processing}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="px-2.5 py-1.5 text-green-600 cursor-pointer transition-colors hover:bg-green-100"
                    disabled={updating || processing}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="col-span-1 text-right text-base font-bold text-gray-900 md:col-span-2">
                {formatCurrency((item.unit_price * quantity) / 100)}
              </div>
            </div>

            {/* Additional Cart Items (read-only, for bundles like Unlimited + Twitch Promotion) */}
            {cart.items.slice(1).map((extraItem: any) => {
              const extraProduct = extraItem.variant?.product;
              if (!extraProduct) return null;

              const extraImage =
                extraProduct.images && extraProduct.images.length > 0
                  ? extraProduct.images[0].url
                  : extraProduct.thumbnail || "/product-placeholder.svg";

              return (
                <div
                  key={extraItem.id}
                  className="grid grid-cols-1 items-center gap-4 border-b border-gray-200 pb-5 md:grid-cols-12"
                >
                  <div className="col-span-1 flex gap-4 md:col-span-6">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-50 p-1.5">
                      <img
                        src={extraImage}
                        alt={extraProduct.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm leading-tight font-semibold text-gray-800">
                        {extraProduct.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {extraItem.variant?.title}
                      </p>
                    </div>
                  </div>

                  <div className="col-span-1 text-center text-base font-bold text-gray-900 md:col-span-2">
                    {formatCurrency(extraItem.unit_price / 100)}
                  </div>

                  <div className="col-span-1 flex justify-center md:col-span-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {extraItem.quantity}
                    </span>
                  </div>

                  <div className="col-span-1 text-right text-base font-bold text-gray-900 md:col-span-2">
                    {formatCurrency(
                      (extraItem.unit_price * extraItem.quantity) / 100
                    )}
                  </div>
                </div>
              );
            })}

            {/* Twitch Link - Compact */}
            <div className="border-b border-gray-200 py-4">
              <Label
                htmlFor="twitch-link"
                className="mb-2 block text-sm font-bold text-gray-900"
              >
                Your Twitch Profile Link
              </Label>
              <Input
                id="twitch-link"
                placeholder="https://twitch.tv/mychannel"
                value={twitchLink}
                onChange={(e) => setTwitchLink(e.target.value)}
                className="h-10 border-green-300 bg-white text-sm"
              />
            </div>

            {/* Footer - Compact */}
            <div className="flex flex-col items-start justify-between gap-5 pt-3 md:flex-row">
              {/* Security Badges - Compact */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                  <Lock className="h-3.5 w-3.5 text-green-600" />
                  <span>Secured Checkout</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex h-6 items-center rounded border border-gray-200 bg-white px-1.5 py-0.5">
                    <svg
                      viewBox="0 0 1000 350"
                      className="h-full w-auto"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M135.5 28.5L27 75V168C27 236 73 299 135.5 321.5C198 299 244 236 244 168V75L135.5 28.5Z"
                        fill="#C01818"
                      />
                      <path
                        d="M185 108L165 208H148L156 168H115L107 208H90L110 108H128L120 149H160L168 108H185Z"
                        fill="white"
                      />
                      <text
                        x="280"
                        y="210"
                        fontFamily="Arial, sans-serif"
                        fontWeight="bold"
                        fontSize="160"
                        fill="#444"
                      >
                        McAfee
                      </text>
                      <text
                        x="280"
                        y="310"
                        fontFamily="Arial, sans-serif"
                        fontWeight="bold"
                        fontSize="80"
                        fill="#444"
                      >
                        SECURE
                      </text>
                    </svg>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex h-6 w-9 items-center justify-center rounded border border-gray-200 bg-white p-0.5">
                      <svg
                        viewBox="0 0 36 11"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.238 0.499939L8.35803 10.4999H5.65203L3.48303 2.76894C3.36103 2.27494 2.14803 1.62494 0.994031 1.09994L1.09203 0.499939H4.63403C5.22803 0.499939 5.76603 0.899939 5.90803 1.59994L6.96303 7.62494L9.89703 0.499939H12.238Z"
                          fill="#1A1F71"
                        />
                      </svg>
                    </div>
                    <div className="flex h-6 w-9 items-center justify-center rounded border border-gray-200 bg-white p-0.5">
                      <svg
                        viewBox="0 0 24 16"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="8" cy="8" r="5" fill="#EB001B" />
                        <circle cx="16" cy="8" r="5" fill="#F79E1B" />
                        <path
                          d="M12 12.6569C13.5 11.8 14.5 10.1 14.5 8C14.5 5.9 13.5 4.2 12 3.34315C10.5 4.2 9.5 5.9 9.5 8C9.5 10.1 10.5 11.8 12 12.6569Z"
                          fill="#FF5F00"
                        />
                      </svg>
                    </div>
                    <div className="flex h-6 w-9 items-center justify-center rounded border border-gray-200 bg-white p-0.5">
                      <svg
                        viewBox="0 0 24 16"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z"
                          fill="#006FCF"
                        />
                        <path
                          d="M5.42 10.13L4.09 13.5H2L5.85 3.5H9.28L8.76 5.92H6.3L5.87 7.9H8.22L7.69 10.13H5.42Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                    <div className="flex h-6 w-9 items-center justify-center rounded border border-gray-200 bg-white p-0.5">
                      <svg
                        viewBox="0 0 24 16"
                        className="h-full w-full"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect width="24" height="16" rx="2" fill="white" />
                        <path
                          d="M11.5 8C11.5 10.2 9.7 12 7.5 12C5.3 12 3.5 10.2 3.5 8C3.5 5.8 5.3 4 7.5 4C9.7 4 11.5 5.8 11.5 8Z"
                          fill="#F48120"
                        />
                        <path d="M20 8L17 8" stroke="#4D4F53" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Totals Box - Compact */}
              <div className="w-full rounded border border-gray-200 bg-gray-50 p-5 md:w-80">
                <div className="mb-3 flex justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Subtotal
                  </span>
                  <span className="text-base font-bold text-green-600">
                    {formatCurrency(computedSubtotal)}
                  </span>
                </div>
                <div className="mb-4 flex justify-between border-b border-gray-200 pb-4">
                  <span className="text-sm font-semibold text-gray-700">
                    Free Shipping
                  </span>
                  <span className="text-sm text-gray-500">—</span>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleUpdateCart}
                    disabled={updating || processing}
                    variant="outline"
                    className="h-10 w-full border-gray-300 cursor-pointer text-sm font-bold tracking-wide text-gray-700 uppercase hover:bg-gray-100"
                  >
                    {updating ? (
                      <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span className="mr-1.5">↻</span>
                    )}
                    UPDATE CART
                  </Button>

                  <Button
                    onClick={handleProcessToCheckout}
                    disabled={updating || processing}
                    className="h-10 w-full bg-green-600 cursor-pointer text-sm font-bold tracking-wide text-white uppercase shadow-md transition-all hover:bg-green-700 hover:shadow-lg"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      "PROCEED TO CHECKOUT"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
