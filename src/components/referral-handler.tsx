"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function ReferralHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    if (refCode) {
      // Save to localStorage for 30 days
      const item = {
        value: refCode,
        expiry: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days
      };
      localStorage.setItem("affiliate_ref", JSON.stringify(item));
      console.log("Affiliate code captured:", refCode);
    }
  }, [searchParams]);

  return null;
}
