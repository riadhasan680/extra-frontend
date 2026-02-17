"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types/api";
import { authService } from "@/services/auth.service";
import { useToast } from "@/components/ui/toast";
import Cookies from "js-cookie";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { addToast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get("token");
      if (token) {
        const userData = await authService.getMe();
        setUser(userData);
      }
    } catch (error) {
      console.error("Auth check failed", error);
      // Valid token might be expired
      Cookies.remove("token");
      Cookies.remove("role");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await authService.login(credentials);

      // Cookies are set by authService
      setUser(response.user);

      addToast({
        type: "success",
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      if (response.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      addToast({
        type: "error",
        title: "Login failed",
        description:
          error.response?.data?.message ||
          "Invalid credentials. Please try again.",
      });
      throw error;
    }
  };

  const register = async (data: any) => {
    try {
      const response = await authService.register(data);

      // Cookies are set by authService
      setUser(response.user);

      addToast({
        type: "success",
        title: "Account created!",
        description: "Welcome to Stream Lifter.",
      });

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Registration failed", error);
      addToast({
        type: "error",
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong.",
      });
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
