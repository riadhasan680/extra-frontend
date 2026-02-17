"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Chrome } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { addToast } = useToast();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login({ email, password });
      // Redirect and Toast are handled by AuthContext
    } catch (error) {
      // Error is handled by AuthContext
      console.error("Login page caught error:", error);
    } finally {
      // We don't set loading to false immediately if successful because we are redirecting
      // But if we want to be safe:
      // setIsLoading(false);
      // Actually, if we redirect, component unmounts. If we fail, we need to stop loading.
      // Since login() throws on error, this works.
    }

    // Safety timeout to stop loading if redirect fails or takes too long
    setTimeout(() => setIsLoading(false), 3000);
  }

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    try {
      // For Google, we might need a specific method in AuthContext or just fake it here
      // But better to use the same pattern
      await login({
        email: "user@gmail.com",
        password: "google_mock_password",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsGoogleLoading(false), 3000);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-100 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-4 h-72 w-72 animate-pulse rounded-full bg-green-300 opacity-20 blur-3xl" />
        <div className="absolute -right-4 bottom-20 h-96 w-96 animate-pulse rounded-full bg-green-400 opacity-20 blur-3xl delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-green-200 opacity-10 blur-xl delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Logo */}
        <Link href="/" className="mb-8 flex justify-center">
          <div>
            <Image
              src="/logo.svg"
              alt="Stream Lifter"
              width={100}
              height={90}
              className="h-auto w-64"
            />
          </div>
        </Link>

        <Card className="border border-green-100 bg-white/80   backdrop-blur-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-3xl font-bold text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Sign in to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-gray-200 bg-white py-6 text-base font-medium transition-all hover:border-green-300 hover:bg-green-50 hover:shadow-md"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-5 w-5 text-green-600" />
                  Continue with Google
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="border-2 border-green-100 py-6 pl-11 text-base transition-all outline-none focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    href="#"
                    className="text-sm font-medium text-green-600 transition-colors hover:text-green-800 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="border-2 border-green-100 py-6 pl-11 text-base transition-all outline-none focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-700 py-6 text-white tracking-wider cursor-pointer font-semibold shadow-lg shadow-green-500/30 transition-all hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-500/40"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-gray-100 bg-gray-50/50 py-5">
            <div className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-green-600 transition-colors hover:text-green-800 hover:underline"
              >
                Create account
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <p className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-green-600 hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-green-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
