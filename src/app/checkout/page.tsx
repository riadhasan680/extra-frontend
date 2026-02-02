"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { storeService } from "@/services/store.service";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

// Replaced next/image with standard img to prevent config/emit errors
// import Image from "next/image"; 
import { Loader2, CheckCircle2, ChevronRight, CreditCard, AlertCircle, Tag, X } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const cartId = searchParams.get("cart_id");

  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null); // Critical error preventing page load
  const [paymentError, setPaymentError] = useState<string | null>(null); // Error during payment submission

  // Form states
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address1, setAddress1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("us");
  const [province, setProvince] = useState("");
  
  const [deliveryMethod, setDeliveryMethod] = useState("ship");
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  // Discount states
  const [discountCode, setDiscountCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  // Use ref to track initialization to prevent infinite loops
  const initialized = useRef(false);
  const currentCartId = useRef<string | null>(null);

  // Check for Dodo Payment Return
  useEffect(() => {
      const checkPaymentReturn = async () => {
          const pendingCartId = localStorage.getItem("dodo_pending_cart_id");
          const urlSessionId = searchParams.get("session_id"); // Dodo usually sends this
          const isPaymentReturn = searchParams.get("payment_return") === "true";
          
          if (pendingCartId && (urlSessionId || searchParams.get("payment_status") || isPaymentReturn)) {
             console.log("Detected return from Dodo Payment. Completing cart:", pendingCartId);
             setLoading(true);
             
             try {
                 const order = await storeService.completeCart(pendingCartId);
                 // Strict check: Ensure it is an ORDER, not just a cart
                 if (order && order.type === "order") {
                     // Success!
                     localStorage.removeItem("dodo_pending_cart_id");
                     // Mark user as returning customer
      localStorage.setItem("is_returning_customer", "true");
      setCompleted(true);
                 } else {
                     console.warn("Cart completion returned non-order (likely still cart due to payment pending):", order);
                     // Check if payment status is captured/authorized in the returned cart
                     if (order.payment_session?.status === "authorized" || order.payment_session?.status === "captured") {
                         // It seems authorized but order not created? Retry or assume success?
                         // Ideally completeCart should return order.
                         setPageError("Payment authorized but order creation failed. Please contact support.");
                     } else {
                         setPageError("Payment verification failed. Status: " + (order.payment_session?.status || "unknown"));
                     }
                 }
             } catch (error: any) {
                 console.error("Failed to complete cart after return:", error);
                 // Don't clear localStorage yet, maybe transient error? 
                 // Actually, if it failed, we probably want to let user try again.
                 localStorage.removeItem("dodo_pending_cart_id"); 
                 setPageError(error.message || "Payment verification failed.");
             } finally {
                 setLoading(false);
             }
          }
      };
      
      checkPaymentReturn();
  }, [searchParams]);

  useEffect(() => {
    // Prevent double init for same cart ID
    if (initialized.current && currentCartId.current === cartId) return;
    
    const initCheckout = async () => {
      try {
        initialized.current = true;
        currentCartId.current = cartId;
        
        setLoading(true);
        setPageError(null);

        if (cartId) {
            // 2. Try to Fetch latest cart data
            try {
              const cartData = await storeService.getCart(cartId);
              if (cartData) {
                setCart(cartData);
                if (cartData.email) setEmail(cartData.email);
              } else {
                throw new Error("Cart not found");
              }
            } catch (e) {
               console.error("Cart fetch failed", e);
               setPageError("Failed to load your cart. Please try again.");
            }
        } else {
          setPageError("No cart ID found. Please return to home and try again.");
        }
      } catch (error) {
        console.error("Checkout init failed", error);
        setPageError("Failed to load checkout. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initCheckout();
  }, [cartId]);

  // Auto-apply WELCOME30 for new users
  useEffect(() => {
    const isReturning = localStorage.getItem("is_returning_customer");
    if (!isReturning && cart && cart.promotions?.length === 0 && !discountCode) {
       // Try to apply WELCOME30
       setDiscountCode("WELCOME30");
       // We don't auto-submit here to avoid infinite loops or UI flickering, 
       // but we could pre-fill it or show a toast.
       // Better: Just apply it if cart is loaded.
       const applyNewUserPromo = async () => {
         try {
           setPromoLoading(true);
           const updatedCart = await storeService.addPromotion(cartId, "WELCOME30");
           setCart(updatedCart);
           toast({
             title: "Welcome Gift!",
             description: "30% discount applied for your first order.",
           });
         } catch (e) {
           // Ignore error if code doesn't exist
           console.log("Auto-apply WELCOME30 failed (probably doesn't exist in backend)");
         } finally {
           setPromoLoading(false);
         }
       };
       applyNewUserPromo();
    }
  }, [cartId, cart?.id]); // Run once when cart is loaded

  const handleApplyDiscount = async () => {
    if (!discountCode.trim() || !cartId) return;
    
    setPromoLoading(true);
    try {
      const updatedCart = await storeService.addPromotion(cartId, discountCode);
      setCart(updatedCart);
      setDiscountCode("");
      toast({
        title: "Promotion applied",
        description: "Your discount has been applied successfully.",
      });
    } catch (error: any) {
      console.error("Failed to apply promotion:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to apply promotion code. Please check if it's valid.",
        variant: "destructive",
      });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemoveDiscount = async (code: string) => {
    if (!cartId) return;
    
    setPromoLoading(true);
    try {
      const updatedCart = await storeService.removePromotion(cartId, code);
      setCart(updatedCart);
      toast({
        title: "Promotion removed",
        description: "The discount code has been removed.",
      });
    } catch (error: any) {
      console.error("Failed to remove promotion:", error);
      toast({
        title: "Error",
        description: "Failed to remove promotion code",
        variant: "destructive",
      });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setProcessing(true);
      setPaymentError(null);
      
      if (cartId) {
          // 0. Update Cart with Email and Address (Required for Order Creation)
          const addressData = {
              first_name: firstName,
              last_name: lastName,
              address_1: address1,
              city: city,
              country_code: countryCode,
              postal_code: postalCode,
              phone: phone,
              province: province,
          };

          try {
              // Send address data to Medusa
              // We use billing_address same as shipping for now as per UI logic
              await storeService.updateCart(cartId, { 
                  email,
                  shipping_address: addressData,
                  billing_address: billingSameAsShipping ? addressData : addressData // TODO: Add separate billing form
              });
          } catch (e) {
              console.warn("Failed to update cart address/email", e);
              // We continue because maybe it was already set? 
              // But likely it will fail later if address is missing.
          }

          // Call Dodo Payment API (Medusa v2 Flow)
          console.log("Initiating Dodo Payment for cart:", cartId);
          const response = await storeService.createDodoPaymentSession(cartId);
          
          // Check for checkout URL in the response
          // Priority 1: Direct in response (unlikely but possible)
          // Priority 2: In payment_session.data (standard)
          // Priority 3: In payment_collection.payment_sessions array (Medusa v2 collection response)
          
          let checkoutUrl = response?.payment_session?.data?.checkout_url;
          
          if (!checkoutUrl && response?.payment_collection?.payment_sessions) {
              // Try to find the Dodo session in the array
              const dodoSession = response.payment_collection.payment_sessions.find(
                  (s: any) => s.provider_id === 'pp_dodo_dodo'
              );
              checkoutUrl = dodoSession?.data?.checkout_url;
          }

          // Fallback: Check root level checkout_url if custom response
          if (!checkoutUrl) {
              checkoutUrl = response?.checkout_url;
          }

          // Fallback 2: If we see status 'pending' but no URL, it might be that the Dodo API
          // didn't return it yet, or we need to construct it.
          // However, for now, we will assume if the provider is pp_dodo_dodo, we might need to 
          // manually redirect to a constructed URL if the API is failing to provide one.
          // BUT, we can't guess the Dodo URL.
          
          // DEBUG: If checkoutUrl is still null, let's look closer at the response in console
          if (!checkoutUrl) {
             console.warn("DEBUG: Full Payment Response", JSON.stringify(response, null, 2));
          }
          
          if (checkoutUrl) {
              // DETECT BROKEN SANDBOX URL FROM BACKEND
              // The Medusa Dodo plugin in 'sandbox' mode returns 'sandbox.dodo.com' which does not exist.
              // It also generates a fake session ID that cannot be used on the real Test environment.
              if (checkoutUrl.includes("sandbox.dodo.com")) {
                  console.error("Blocked redirect to invalid Sandbox URL:", checkoutUrl);
                  toast({
                      title: "Backend Configuration Error",
                      description: "Your Medusa Backend is in 'Sandbox Mode' and returned a fake URL. Please configure Dodo Payments with valid keys in your backend to use Test Mode.",
                      variant: "destructive",
                      duration: 10000,
                  });
                  setProcessing(false);
                  return;
              }

              console.log("Redirecting to Dodo:", checkoutUrl);
              
              // Save cart ID to localStorage to detect return
              localStorage.setItem("dodo_pending_cart_id", cartId);

              // Redirect to Dodo Checkout
              window.location.href = checkoutUrl;
              return; // Stop execution here, wait for redirect
          } else {
              // DETAILED ERROR MESSAGE FOR USER
              console.error("Invalid payment response:", response);
              
              // Check if we have a pending session without URL
              const hasPendingDodo = response?.payment_collection?.payment_sessions?.some(
                  (s: any) => s.provider_id === 'pp_dodo_dodo' && s.data?.status === 'pending'
              );

              if (hasPendingDodo) {
                  throw new Error("Dodo Payment initialized but no Checkout URL returned. The Provider might be misconfigured in Backend (Missing API Key or Secret?).");
              }

              throw new Error("Could not find checkout URL in payment response. Please check if Dodo Payment is enabled in Admin.");
          }
      } else {
        throw new Error("Cart ID is missing");
      }
      
    } catch (error: any) {
       console.error("Payment initiation failed", error);
       setPaymentError(error.message || "Failed to initiate payment. Please try again.");
       setProcessing(false);
       
       toast({
        title: "Payment Error",
        description: "Could not initiate payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-[#9c2a8c]" />
          <p className="text-gray-500 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (pageError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-md space-y-4 bg-white p-8 rounded-lg shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Unable to load checkout</h2>
          <p className="text-sm text-gray-500">{pageError}</p>
          <Button onClick={() => window.location.reload()} className="w-full bg-[#9c2a8c] hover:bg-[#852277]">
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push("/cart")} className="w-full">
            Return to Cart
          </Button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-6 px-4 text-center bg-gray-50">
        <div className="rounded-full bg-green-100 p-4 dark:bg-green-900/20">
          <CheckCircle2 className="h-20 w-20 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">Order Confirmed!</h1>
        <p className="text-lg text-gray-600 max-w-md">
          Thank you for your purchase. We have received your order and will begin processing it shortly.
        </p>
        <Button onClick={() => router.push("/")} className="mt-8 min-w-[200px] bg-[#9c2a8c] hover:bg-[#852277] h-12 text-lg">
          Return to Home
        </Button>
      </div>
    );
  }

  if (!cart) return null; 

  return (
    <div className="min-h-screen bg-white lg:flex lg:flex-row-reverse">
      {/* Right Column - Order Summary (Gray Background) */}
      <div className="w-full bg-[#f5f5f5] p-6 lg:w-[45%] lg:border-l lg:p-12 lg:pt-16">
        <div className="mx-auto max-w-lg space-y-8">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.items?.map((item: any) => {
              // Safe image access: Try product images[2], then thumbnail, then placeholder
              const productImages = item.variant?.product?.images;
              // Use image index 2 for Checkout per requirements, fallback to 0 or thumbnail
              const imageUrl = (productImages && productImages.length > 2) 
                ? productImages[2].url 
                : (productImages && productImages.length > 0 ? productImages[0].url : (item.thumbnail || "/product-placeholder.svg"));

              return (
                <div key={item.id} className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                    <span className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gray-500 text-xs font-medium text-white ring-2 ring-white">
                      {item.quantity}
                    </span>
                    {/* Replaced next/image with img for stability */}
                    <img
                      src={imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium text-gray-900">{item.title}</span>
                    <span className="text-sm text-gray-500">{item.variant?.title}</span>
                    {item.metadata?.service_link && (
                      <span className="text-xs text-[#9c2a8c] mt-1 break-all bg-purple-50 p-1 rounded w-fit">
                        Link: {item.metadata.service_link}
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: cart.currency_code || 'USD' }).format((item.unit_price * item.quantity) / 100)}
                  </span>
                </div>
              );
            })}
          </div>

          <Separator className="bg-gray-200" />

          {/* Discount Code */}
          <div className="flex gap-2">
            <Input 
              placeholder="Discount code or gift card" 
              className="bg-white border-gray-300 focus-visible:ring-[#9c2a8c]"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled={promoLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyDiscount();
                }
              }}
            />
            <Button 
              variant="outline" 
              className="border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-600"
              onClick={handleApplyDiscount}
              disabled={promoLoading || !discountCode.trim()}
            >
              {promoLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
            </Button>
          </div>

          {/* Applied Promotions */}
          {cart.promotions && cart.promotions.length > 0 && (
            <div className="mt-4 space-y-2">
              {cart.promotions.map((promo: any) => (
                <div key={promo.id} className="flex items-center justify-between bg-purple-50 p-2 rounded text-sm text-[#9c2a8c]">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{promo.code}</span>
                    <span className="text-xs bg-white px-1 rounded border border-purple-200">Applied</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveDiscount(promo.code)}
                    className="text-gray-500 hover:text-red-500"
                    disabled={promoLoading}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Separator className="bg-gray-200" />

          {/* Totals */}
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-gray-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: cart.currency_code || 'USD' }).format(cart.subtotal / 100)}
              </span>
            </div>
            {cart.discount_total > 0 && (
              <div className="flex justify-between text-[#9c2a8c]">
                <span>Discount</span>
                <span className="font-medium">
                  -{new Intl.NumberFormat('en-US', { style: 'currency', currency: cart.currency_code || 'USD' }).format(cart.discount_total / 100)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-xs text-gray-500">Calculated at next step</span>
            </div>
            <div className="flex justify-between items-center pt-4">
              <span className="text-lg font-medium text-gray-900">Total</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xs text-gray-500">{cart.currency_code?.toUpperCase() || 'USD'}</span>
                <span className="text-2xl font-bold text-gray-900">
                   {new Intl.NumberFormat('en-US', { style: 'currency', currency: cart.currency_code || 'USD' }).format(cart.total / 100)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Left Column - Checkout Form (White Background) */}
      <div className="w-full bg-white p-6 lg:w-[55%] lg:p-12 lg:pt-16">
        <div className="mx-auto max-w-lg">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Extra Marketing</h1>
            <nav className="flex items-center text-xs text-gray-500">
              <span className="text-[#9c2a8c] font-medium">Cart</span>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span className="text-gray-900 font-medium">Information</span>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span>Shipping</span>
              <ChevronRight className="h-3 w-3 mx-2" />
              <span>Payment</span>
            </nav>
          </div>

          {/* Express Checkout */}
          <div className="mb-8">
            <div className="mb-4 text-center text-xs text-gray-500">Express checkout</div>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="bg-[#5a31f4] text-white hover:bg-[#4a26d1] border-none h-10 shadow-sm cursor-pointer">
                <span className="font-bold italic">Shop</span> Pay
              </Button>
              <Button variant="outline" className="bg-[#ffc439] text-black hover:bg-[#f4bb34] border-none h-10 shadow-sm cursor-pointer">
                <span className="font-bold italic">PayPal</span>
              </Button>
              <Button variant="outline" className="bg-black text-white hover:bg-gray-800 border-none h-10 shadow-sm cursor-pointer">
                <span className="font-bold">GPay</span>
              </Button>
            </div>
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">OR</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleCompleteOrder} className="space-y-8">
            {/* Contact */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-medium text-gray-900">Contact</h2>
                <button type="button" className="text-sm text-[#9c2a8c] underline">Log in</button>
              </div>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-gray-300 focus-visible:ring-[#9c2a8c] h-12"
                required
              />
              <div className="mt-3 flex items-center space-x-2">
                <Checkbox id="marketing" className="border-gray-300 text-[#9c2a8c] focus:ring-[#9c2a8c]" />
                <label htmlFor="marketing" className="text-sm text-gray-500 cursor-pointer select-none">
                  Email me with news and offers
                </label>
              </div>
            </section>

            {/* Delivery Method */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-3">Delivery</h2>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="grid grid-cols-2 gap-0 rounded-md border border-gray-200 p-1">
                <div className={`flex items-center space-x-2 rounded px-3 py-3 cursor-pointer transition-colors ${deliveryMethod === 'ship' ? 'bg-gray-50 border border-[#9c2a8c]' : 'hover:bg-gray-50'}`}>
                  <RadioGroupItem value="ship" id="ship" className="text-[#9c2a8c] border-gray-400" />
                  <Label htmlFor="ship" className="cursor-pointer flex-1 font-normal">Ship</Label>
                </div>
                <div className={`flex items-center space-x-2 rounded px-3 py-3 cursor-pointer transition-colors ${deliveryMethod === 'pickup' ? 'bg-gray-50 border border-[#9c2a8c]' : 'hover:bg-gray-50'}`}>
                  <RadioGroupItem value="pickup" id="pickup" className="text-[#9c2a8c] border-gray-400" />
                  <Label htmlFor="pickup" className="cursor-pointer flex-1 font-normal">Pick up</Label>
                </div>
              </RadioGroup>
            </section>

            {/* Shipping Address */}
            <section className="space-y-3">
              <h2 className="text-lg font-medium text-gray-900">Shipping address</h2>
              <Select value={countryCode} onValueChange={setCountryCode}>
                <SelectTrigger className="w-full bg-white border-gray-300 h-12">
                  <SelectValue placeholder="Country/Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="bd">Bangladesh</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-3">
                <Input 
                  placeholder="First name" 
                  className="bg-white border-gray-300 h-12" 
                  required 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input 
                  placeholder="Last name" 
                  className="bg-white border-gray-300 h-12" 
                  required 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <Input 
                placeholder="Address" 
                className="bg-white border-gray-300 h-12" 
                required 
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
              <Input placeholder="Apartment, suite, etc. (optional)" className="bg-white border-gray-300 h-12" />
              <div className="grid grid-cols-3 gap-3">
                <Input 
                  placeholder="City" 
                  className="bg-white border-gray-300 h-12" 
                  required 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Select value={province} onValueChange={setProvince}>
                  <SelectTrigger className="bg-white border-gray-300 h-12">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ca">California</SelectItem>
                    <SelectItem value="ny">New York</SelectItem>
                    <SelectItem value="tx">Texas</SelectItem>
                    <SelectItem value="dhaka">Dhaka</SelectItem>
                  </SelectContent>
                </Select>
                <Input 
                  placeholder="ZIP code" 
                  className="bg-white border-gray-300 h-12" 
                  required 
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                />
              </div>
              <Input 
                placeholder="Phone" 
                type="tel" 
                className="bg-white border-gray-300 h-12" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </section>

            {/* Payment */}
            <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Payment</h2>
              <p className="text-sm text-gray-500">All transactions are secure and encrypted.</p>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="overflow-hidden rounded-lg border border-gray-200">
                {/* Credit Card */}
                <div className="border-b border-gray-200 bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit_card" id="cc" className="text-[#9c2a8c] border-gray-400" />
                      <Label htmlFor="cc" className="font-medium cursor-pointer">Credit card</Label>
                    </div>
                    <div className="flex gap-1">
                      {/* Icons */}
                      <div className="h-6 w-9 bg-white border border-gray-200 rounded flex items-center justify-center p-0.5">
                        <svg viewBox="0 0 36 11" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.238 0.499939L8.35803 10.4999H5.65203L3.48303 2.76894C3.36103 2.27494 2.14803 1.62494 0.994031 1.09994L1.09203 0.499939H4.63403C5.22803 0.499939 5.76603 0.899939 5.90803 1.59994L6.96303 7.62494L9.89703 0.499939H12.238ZM22.868 7.37494C22.883 4.79994 19.333 4.67494 19.408 3.39994C19.432 2.99994 19.832 2.59994 21.363 2.52494C22.128 2.49994 24.162 2.44994 25.993 3.29994L26.463 1.09994C25.828 0.874939 24.998 0.599939 23.958 0.599939C20.318 0.599939 17.728 2.52494 17.708 5.32494C17.683 7.39994 19.533 8.52494 20.978 9.22494C22.453 9.94994 22.953 10.4249 22.953 11.0999C22.953 12.1249 21.738 12.5749 20.613 12.5749C19.123 12.5749 18.273 12.1749 17.583 11.8749L16.893 14.1249C17.783 14.5249 19.458 14.8749 21.033 14.8999C24.843 14.8999 27.363 13.0249 27.388 10.0749C27.393 8.64994 25.683 7.84994 22.868 7.37494ZM29.628 14.7499H32.258L34.708 0.499939H32.078C31.488 0.499939 30.988 0.849939 30.768 1.37494L26.273 12.2999L23.753 1.39994C23.518 0.499939 22.568 0.549939 22.378 0.499939H19.538L24.818 14.7499H29.628Z" fill="#1A1F71"/>
                        </svg>
                      </div>
                      <div className="h-6 w-9 bg-white border border-gray-200 rounded flex items-center justify-center p-0.5">
                        <svg viewBox="0 0 24 16" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="16" rx="2" fill="#253B80"/>
                            <circle cx="8" cy="8" r="6" fill="#EB001B"/>
                            <circle cx="16" cy="8" r="6" fill="#F79E1B"/>
                            <path d="M12 13.6569C13.8836 12.6394 15.1913 10.5188 15.1913 8C15.1913 5.48125 13.8836 3.36062 12 2.34315C10.1164 3.36062 8.80872 5.48125 8.80872 8C8.80872 10.5188 10.1164 12.6394 12 13.6569Z" fill="#FF5F00"/>
                        </svg>
                      </div>
                      <div className="h-6 w-9 bg-white border border-gray-200 rounded flex items-center justify-center p-0.5">
                        <svg viewBox="0 0 24 16" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 2C0 0.895431 0.895431 0 2 0H22C23.1046 0 24 0.895431 24 2V14C24 15.1046 23.1046 16 22 16H2C0.895431 16 0 15.1046 0 14V2Z" fill="#006FCF"/>
                            <path d="M5.42 10.13L4.09 13.5H2L5.85 3.5H9.28L8.76 5.92H6.3L5.87 7.9H8.22L7.69 10.13H5.42ZM14.93 13.5H12.28L11.53 11.23H9.17L8.43 13.5H6.25L9.62 3.5H12.87L14.07 8.04L15.34 3.5H18.59L19.46 7.6L20.24 3.5H22.38L20.64 13.5H18.41L17.5 8.5L16.59 13.5H14.93ZM10.54 8.68L11.08 6.44L11.64 8.68H10.54Z" fill="white"/>
                        </svg>
                      </div>
                      <div className="h-6 w-9 bg-white border border-gray-200 rounded flex items-center justify-center p-0.5">
                        <svg viewBox="0 0 24 16" className="h-full w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="16" rx="2" fill="white"/>
                            <path d="M11.5 8.00003C11.5 10.4853 9.48528 12.5 7 12.5C4.51472 12.5 2.5 10.4853 2.5 8.00003C2.5 5.51475 4.51472 3.50003 7 3.50003C9.48528 3.50003 11.5 5.51475 11.5 8.00003Z" fill="#F48120"/>
                            <path d="M21.5 8.00003L16 8.00003" stroke="#4D4F53" strokeWidth="2.5"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {paymentMethod === "credit_card" && (
                    <div className="mt-4 grid gap-3 bg-gray-50 p-4 rounded border border-gray-200 animate-in slide-in-from-top-2 duration-200">
                      <div className="relative">
                        <Input placeholder="Card number" className="bg-white border-gray-300 pr-10 h-12" />
                        <CreditCard className="absolute right-3 top-3.5 h-5 w-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Input placeholder="Expiration date (MM / YY)" className="bg-white border-gray-300 h-12" />
                        <Input placeholder="Security code" className="bg-white border-gray-300 h-12" />
                      </div>
                      <Input placeholder="Name on card" className="bg-white border-gray-300 h-12" />
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className="bg-gray-50/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="pp" className="text-[#9c2a8c] border-gray-400" />
                      <Label htmlFor="pp" className="font-medium cursor-pointer">PayPal</Label>
                    </div>
                    <div className="h-6 w-16 bg-[#ffc439] rounded flex items-center justify-center border border-yellow-400">
                        <span className="text-[10px] font-bold italic text-[#003087]">PayPal</span>
                    </div>
                  </div>
                  {paymentMethod === "paypal" && (
                    <div className="mt-4 bg-gray-50 p-4 rounded border border-gray-200 text-center animate-in slide-in-from-top-2 duration-200">
                       <p className="text-sm text-gray-500 mb-3">After clicking "Pay now", you will be redirected to PayPal to complete your purchase securely.</p>
                    </div>
                  )}
                </div>
              </RadioGroup>
            </section>

             {/* Billing Address */}
             <section className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900">Billing address</h2>
              <RadioGroup 
                value={billingSameAsShipping ? "same" : "different"} 
                onValueChange={(v) => setBillingSameAsShipping(v === "same")}
                className="overflow-hidden rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-2 border-b border-gray-200 bg-gray-50/50 p-4">
                   <RadioGroupItem value="same" id="same_billing" className="text-[#9c2a8c] border-gray-400" />
                   <Label htmlFor="same_billing" className="font-medium cursor-pointer">Same as shipping address</Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50/50 p-4">
                   <RadioGroupItem value="different" id="diff_billing" className="text-[#9c2a8c] border-gray-400" />
                   <Label htmlFor="diff_billing" className="font-medium cursor-pointer">Use a different billing address</Label>
                </div>
              </RadioGroup>
            </section>

            {paymentError && (
              <div className="rounded-md bg-red-50 p-4 border border-red-200 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Payment Error</h3>
                    <div className="mt-1 text-sm text-red-700">
                      <p>{paymentError}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-semibold bg-[#9c2a8c] hover:bg-[#852277] shadow-lg transition-all"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Pay now"
              )}
            </Button>
            
            <div className="flex justify-center space-x-4 text-xs text-gray-500 underline">
                <a href="#">Refund policy</a>
                <a href="#">Shipping policy</a>
                <a href="#">Privacy policy</a>
                <a href="#">Terms of service</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#9c2a8c]" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
