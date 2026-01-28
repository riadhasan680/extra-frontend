"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { storeService } from "@/services/store.service";

interface CartItem {
  id: string; // Product ID or Variant ID? Ideally Variant ID for Medusa
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variant_id?: string; // Add variant_id support
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load cart from local storage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart_items");
    const storedCartId = localStorage.getItem("cart_id");
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
    if (storedCartId) {
      setCartId(storedCartId);
    }
  }, []);

  // Save cart items to local storage
  useEffect(() => {
    localStorage.setItem("cart_items", JSON.stringify(items));
  }, [items]);

  const addItem = async (newItem: CartItem) => {
    setLoading(true);
    try {
      // 1. Ensure Cart Exists
      let currentCartId = cartId;
      if (!currentCartId) {
        const cart = await storeService.createCart();
        currentCartId = cart.id;
        setCartId(currentCartId);
        localStorage.setItem("cart_id", currentCartId);

        // 2. Attach Affiliate Code if exists
        const storedRef = localStorage.getItem("affiliate_ref");
        if (storedRef) {
          try {
            const { value, expiry } = JSON.parse(storedRef);
            if (new Date().getTime() < expiry) {
              await storeService.attachAffiliate(currentCartId, value);
              console.log("Affiliate code attached to cart");
            } else {
              localStorage.removeItem("affiliate_ref");
            }
          } catch (e) {
            console.error("Error parsing affiliate ref", e);
          }
        }
      }

      // 3. Add Item to Backend Cart (Mocking variant_id if missing for now, 
      // but in real app we need valid variant_id)
      // For this task, we will try to call the API but fallback to local if it fails 
      // (since we might not have valid variant IDs from the product list if they are just products)
      if (newItem.variant_id) {
         try {
            await storeService.addToCart(currentCartId, newItem.variant_id, 1);
         } catch (e) {
            console.warn("Backend add-to-cart failed (likely invalid variant_id), keeping local state", e);
         }
      }

      // 4. Update Local State
      setItems((prev) => {
        const existing = prev.find((item) => item.id === newItem.id);
        if (existing) {
          return prev.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { ...newItem, quantity: 1 }];
      });

    } catch (error) {
      console.error("Failed to add item to cart", error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setCartId(null);
    localStorage.removeItem("cart_items");
    localStorage.removeItem("cart_id");
  };

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, total, loading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
