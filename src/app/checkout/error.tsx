"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Checkout Page Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md space-y-4 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Something went wrong!</h2>
        <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded text-left overflow-auto max-h-32">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex flex-col gap-2">
            <Button onClick={() => reset()} className="w-full bg-[#9c2a8c] hover:bg-[#852277]">
            Try again
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/cart'} className="w-full">
            Return to Cart
            </Button>
        </div>
      </div>
    </div>
  );
}
