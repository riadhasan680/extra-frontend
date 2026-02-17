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
import { Loader2, Mail, Lock, User, Chrome } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import { useAuth } from "@/context/auth-context";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { addToast } = useToast();
  const { register } = useAuth();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      addToast({
        type: "error",
        title: "Password mismatch",
        description: "Passwords do not match. Please try again.",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      addToast({
        type: "warning",
        title: "Weak password",
        description: "Password must be at least 6 characters long.",
      });
      setIsLoading(false);
      return;
    }

    try {
      await register({ name, email, password });
      // AuthContext handles success toast and redirect
    } catch (error) {
      // AuthContext handles error toast
      console.error(error);
    } finally {
      // Safety timeout
      setTimeout(() => setIsLoading(false), 3000);
    }
  }

  async function handleGoogleSignup() {
    setIsGoogleLoading(true);
    try {
      // Mock google register
      await register({
        name: "Google User",
        email: "google@gmail.com",
        password: "google_mock_password",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => setIsGoogleLoading(false), 3000);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-linear-to-br from-green-50 via-white to-green-100 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-4 h-72 w-72 animate-pulse rounded-full bg-green-300 opacity-20 blur-3xl" />
        <div className="absolute -right-4 bottom-20 h-96 w-96 animate-pulse rounded-full bg-green-400 opacity-20 blur-3xl delay-1000" />
        <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-green-200 opacity-10 blur-3xl delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Brand Logo */}
        <Link href="/" className="mb-8 flex justify-center">
          <div>
            <Image
              src="/logo.svg"
              alt="Stream Lifter"
              width={180}
              height={90}
              className="h-auto w-64"
            />
          </div>
        </Link>

        <Card className="border border-green-100 bg-white/80 backdrop-blur-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="bg-linear-to-r from-green-600 to-green-900 bg-clip-text text-3xl font-bold text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Join Stream Lifter to boost your channel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Google Sign Up */}
            <Button
              type="button"
              variant="outline"
              className="w-full border-2 border-gray-200 bg-white py-6 text-base font-medium transition-all hover:border-green-300 hover:bg-green-50 hover:shadow-md"
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-5 w-5 text-green-600" />
                  Sign up with Google
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
                  Or sign up with email
                </span>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    required
                    className="border-2 border-green-100 py-6 pl-11 text-base transition-all outline-none focus:ring-0 focus:outline-none"
                  />
                </div>
              </div>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
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
                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm
                  </Label>
                  <div className="relative">
                    <Lock className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      className="border-2 border-green-100 py-6 pl-11 text-base transition-all outline-none focus:ring-0 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="mt-2 w-full cursor-pointer bg-gradient-to-r from-green-600 to-green-700 py-6 text-white tracking-wider font-semibold shadow-lg shadow-green-500/30 transition-all hover:from-green-700 hover:to-green-800 hover:shadow-xl hover:shadow-green-500/40"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-gray-100 bg-gray-50/50 py-5">
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-green-600 transition-colors hover:text-green-800 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <p className="mt-6 text-center text-sm text-gray-500">
          By creating an account, you agree to our{" "}
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
