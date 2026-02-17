"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Plane, RefreshCw, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
        variant: "success",
      });
      
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <span className="text-gray-900">Contact Us</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-4xl px-6 py-16">
        <h1 className="mb-12 text-center text-4xl font-normal text-gray-900">
          Contact Us
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Input
                name="name"
                placeholder="Name"
                required
                className="h-14 rounded-md border border-green-300 bg-green-50 px-4 text-base placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <Input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="h-14 rounded-md border border-green-300 bg-green-50 px-4 text-base placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-green-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Input
              name="phone"
              type="tel"
              placeholder="Phone Number"
              className="h-14 rounded-md border border-green-300 bg-green-50 px-4 text-base placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <div className="space-y-2">
            <Textarea
              name="message"
              placeholder="Message"
              required
              className="min-h-[200px] resize-none rounded-md border border-green-300 bg-green-50 p-4 text-base placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-green-500"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-32 cursor-pointer rounded-md bg-green-600 text-base font-semibold text-white transition-colors hover:bg-green-700"
            >
              {loading ? (
                "Sending..."
              ) : (
                <>
                  Send <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
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
