"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { storeService } from "@/services/store.service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Minus, Plus, ShoppingBag, Trash2, Lock, CreditCard, ShieldCheck, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
  
  // State for form inputs
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        service_link: twitchLink
      });
      
      toast({
        title: "Success",
        description: "Cart updated successfully",
      });
      
      // Refresh cart to get new totals
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

    // Validation
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
      
      // Ensure cart is updated with latest values before proceeding
      await storeService.updateLineItem(cartId, currentItemId, quantity, {
        service_link: twitchLink
      });

      // Redirect to Checkout (Step 2)
      router.push(`/checkout?cart_id=${cartId}`);
      
    } catch (error) {
      console.error("Failed to process to checkout", error);
      toast({
        title: "Error",
        description: "Failed to process request. Please try again.", // Matching user's error message
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
      <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
        <ShoppingBag className="h-16 w-16 text-gray-300" />
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <Link href="/">
          <Button className="bg-purple-600 hover:bg-purple-700">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const item = cart.items[0];
  const product = item.variant?.product;
  
  // Defensive check: If product is not loaded yet (should be handled by getCart expansion)
  if (!product) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-gray-500">Loading product details...</p>
        </div>
      );
  }

  // Handle image safely - check for array existence and validity
  const mainImage = (product.images && product.images.length > 0) ? product.images[0].url : (product.thumbnail || "/product-placeholder.svg");

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="border-b border-gray-100 bg-white py-4">
        <div className="container mx-auto flex max-w-7xl items-center justify-center px-6">
           <Link href="/">
            {/* Logo - using standard img to avoid config issues */}
            <img
              src="https://xtralifemarketing.com/cdn/shop/files/logo_x70.png?v=1614342404"
              alt="Xtra Marketing"
              className="h-auto max-h-12 w-auto"
            />
          </Link>
          <div className="absolute right-6 top-6">
             <div className="relative h-10 w-10 rounded-full bg-[#9c2a8c] p-2 text-white flex items-center justify-center">
                <ShoppingBag className="h-5 w-5" />
             </div>
          </div>
        </div>
      </header>

      {/* Cart Banner */}
      <div className="relative overflow-hidden bg-[#340c7f] py-20 text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a0a66] to-[#4c12a0]"></div>
          {/* Twitch Watermark Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] opacity-10 select-none pointer-events-none z-0">
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d3/Twitch_Glitch_Logo_Purple.svg" alt="" className="w-full h-auto grayscale brightness-0 invert" />
          </div>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        <div className="relative z-10 container mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight uppercase" style={{ fontFamily: 'Impact, sans-serif' }}>YOUR CART</h1>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Breadcrumb */}
        <div className="mb-10 text-sm">
          <Link href="/" className="text-gray-500 hover:text-purple-600">Home</Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-[#9c2a8c]">Checkout</span>
        </div>

        <div className="grid gap-12 lg:grid-cols-12">
          {/* Left Column: Product & Form */}
          <div className="lg:col-span-12 space-y-8">
            {/* Product Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 border-b border-gray-100 pb-4 text-sm font-bold text-gray-800 uppercase tracking-wide">
              <div className="col-span-6">Products</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Product Item */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-gray-100 pb-8">
              <div className="col-span-1 md:col-span-6 flex gap-6">
                <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-md border bg-gray-50 shadow-sm p-2">
                  <div className="relative h-full w-full">
                    {mainImage && (
                        <img
                        src={mainImage}
                        alt={product.title}
                        className="h-full w-full object-contain"
                        />
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="font-medium text-gray-700 text-lg leading-tight">{product.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.variant.title}</p>
                  <button className="text-xs text-[#9c2a8c] underline mt-3 text-left w-fit cursor-pointer">Remove</button>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 text-center font-bold text-gray-900 text-lg">
                {formatCurrency(item.unit_price / 100)}
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-center">
                <div className="flex items-center border border-gray-200 bg-white">
                  <button 
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                    disabled={updating || processing}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-10 text-center text-base font-medium text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
                    disabled={updating || processing}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 text-right font-bold text-gray-900 text-lg">
                {formatCurrency((item.unit_price * quantity) / 100)}
              </div>
            </div>

            {/* Twitch Link Input */}
            <div className="py-6 border-b border-gray-100">
              <Label htmlFor="twitch-link" className="text-base font-bold text-gray-900 mb-3 block">
                Your Twitch Profile Link
              </Label>
              <div className="bg-gray-50 p-6 rounded-sm border border-gray-200">
                <Input
                  id="twitch-link"
                  placeholder="https://twitch.tv/mychannel"
                  value={twitchLink}
                  onChange={(e) => setTwitchLink(e.target.value)}
                  className="bg-white border-gray-200 h-12 text-base"
                />
                <div className="flex justify-end mt-1">
                    <span className="text-[10px] text-gray-400 italic opacity-0">.</span>
                    <span className="h-3 w-3 border-r border-b border-gray-300 transform rotate-45 bg-gray-50 -mt-2 mr-4 opacity-0"></span>
                </div>
              </div>
            </div>
            
            {/* Footer Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 pt-4">
                {/* Secured Checkout */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <Lock className="h-4 w-4 text-[#9c2a8c]" />
                        <span>Secured Checkout</span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                         {/* McAfee Secure SVG */}
                         <div className="flex items-center border border-gray-200 rounded px-2 py-1 bg-white h-8">
                            <svg viewBox="0 0 1000 350" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M135.5 28.5L27 75V168C27 236 73 299 135.5 321.5C198 299 244 236 244 168V75L135.5 28.5Z" fill="#C01818"/>
                                <path d="M185 108L165 208H148L156 168H115L107 208H90L110 108H128L120 149H160L168 108H185Z" fill="white"/>
                                <text x="280" y="210" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="160" fill="#444">McAfee</text>
                                <text x="280" y="310" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="80" fill="#444">SECURE</text>
                            </svg>
                         </div>

                         {/* Payment Icons SVGs */}
                         <div className="flex gap-1">
                             {/* Visa */}
                             <div className="h-8 w-12 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                <svg viewBox="0 0 36 11" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.238 0.499939L8.35803 10.4999H5.65203L3.48303 2.76894C3.36103 2.27494 2.14803 1.62494 0.994031 1.09994L1.09203 0.499939H4.63403C5.22803 0.499939 5.76603 0.899939 5.90803 1.59994L6.96303 7.62494L9.89703 0.499939H12.238ZM22.868 7.37494C22.883 4.79994 19.333 4.67494 19.408 3.39994C19.432 2.99994 19.832 2.59994 21.363 2.52494C22.128 2.49994 24.162 2.44994 25.993 3.29994L26.463 1.09994C25.828 0.874939 24.998 0.599939 23.958 0.599939C20.318 0.599939 17.728 2.52494 17.708 5.32494C17.683 7.39994 19.533 8.52494 20.978 9.22494C22.453 9.94994 22.953 10.4249 22.953 11.0999C22.953 12.1249 21.738 12.5749 20.613 12.5749C19.123 12.5749 18.273 12.1749 17.583 11.8749L16.893 14.1249C17.783 14.5249 19.458 14.8749 21.033 14.8999C24.843 14.8999 27.363 13.0249 27.388 10.0749C27.393 8.64994 25.683 7.84994 22.868 7.37494ZM29.628 14.7499H32.258L34.708 0.499939H32.078C31.488 0.499939 30.988 0.849939 30.768 1.37494L26.273 12.2999L23.753 1.39994C23.518 0.499939 22.568 0.549939 22.378 0.499939H19.538L24.818 14.7499H29.628Z" fill="#1A1F71"/>
                                </svg>
                             </div>
                             {/* Mastercard */}
                             <div className="h-8 w-12 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                <svg viewBox="0 0 24 16" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="24" height="16" rx="2" fill="#253B80"/>
                                    <circle cx="8" cy="8" r="6" fill="#EB001B"/>
                                    <circle cx="16" cy="8" r="6" fill="#F79E1B"/>
                                    <path d="M12 13.6569C13.8836 12.6394 15.1913 10.5188 15.1913 8C15.1913 5.48125 13.8836 3.36062 12 2.34315C10.1164 3.36062 8.80872 5.48125 8.80872 8C8.80872 10.5188 10.1164 12.6394 12 13.6569Z" fill="#FF5F00"/>
                                </svg>
                             </div>
                             {/* Amex */}
                             <div className="h-8 w-12 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                <svg viewBox="0 0 24 16" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z" fill="#006FCF"/>
                                    <path d="M5.42 10.13L4.09 13.5H2L5.85 3.5H9.28L8.76 5.92H6.3L5.87 7.9H8.22L7.69 10.13H5.42ZM14.93 13.5H12.28L11.53 11.23H9.17L8.43 13.5H6.25L9.62 3.5H12.87L14.07 8.04L15.34 3.5H18.59L19.46 7.6L20.24 3.5H22.38L20.64 13.5H18.41L17.5 8.5L16.59 13.5H14.93ZM10.54 8.68L11.08 6.44L11.64 8.68H10.54Z" fill="white"/>
                                </svg>
                             </div>
                             {/* Discover */}
                             <div className="h-8 w-12 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                <svg viewBox="0 0 24 16" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="24" height="16" rx="2" fill="white"/>
                                    <path d="M11.5 8.00003C11.5 10.4853 9.48528 12.5 7 12.5C4.51472 12.5 2.5 10.4853 2.5 8.00003C2.5 5.51475 4.51472 3.50003 7 3.50003C9.48528 3.50003 11.5 5.51475 11.5 8.00003Z" fill="#F48120"/>
                                    <path d="M21.5 8.00003L16 8.00003" stroke="#4D4F53" strokeWidth="2.5"/>
                                </svg>
                             </div>
                         </div>
                    </div>
                </div>

                {/* Totals & Actions */}
                <div className="w-full md:w-96 bg-gray-50 p-8 rounded-sm">
                    <div className="flex justify-between mb-4">
                        <span className="font-bold text-gray-800">Subtotal</span>
                        <span className="font-bold text-gray-900 text-xl">{formatCurrency((item.unit_price * quantity) / 100)}</span>
                    </div>
                    <div className="flex justify-between mb-6">
                        <span className="font-bold text-gray-800">Free Shipping</span>
                        <span className="font-bold text-gray-900"></span>
                    </div>
                    
                    <div className="space-y-3">
                        <Button 
                            onClick={handleUpdateCart}
                            disabled={updating || processing}
                            variant="outline"
                            className="w-full border-gray-300 text-gray-700 hover:bg-gray-100 h-12 font-bold uppercase tracking-wide"
                        >
                            {updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <span className="mr-2">↻</span>}
                            Update Cart
                        </Button>
                        
                        <Button 
                            onClick={handleProcessToCheckout}
                            disabled={updating || processing}
                            className="w-full bg-[#8e24aa] hover:bg-[#7b1fa2] text-white h-12 font-bold uppercase tracking-wide shadow-md transition-all hover:shadow-lg"
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Process to Checkout"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Chat Icon (Mock) */}
      <div className="fixed bottom-6 left-6 z-50">
         <div className="bg-[#9c2a8c] h-14 w-14 rounded-full flex items-center justify-center shadow-lg text-white cursor-pointer hover:scale-105 transition-transform">
            <MessageCircle className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">1</span>
         </div>
      </div>

      {/* 10% OFF Badge */}
      <div className="fixed bottom-0 right-0 z-40 pointer-events-none hidden lg:block overflow-hidden h-40 w-40">
         <div className="bg-[#d500f9] text-white font-black -rotate-45 text-lg tracking-wider py-2 px-10 shadow-lg absolute bottom-8 -right-10 w-60 text-center transform origin-bottom-right">
             GET 10% OFF
         </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    }>
      <CartContent />
    </Suspense>
  );
}