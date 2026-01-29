"use client";

import { useEffect, useState } from "react";
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
import { Check, Copy, Loader2, User as UserIcon } from "lucide-react";
import { authService } from "@/services/auth.service";
import { User } from "@/types/api";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getMe();
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const affiliateLink = user?.referral_code 
    ? `${window.location.origin}/register?ref=${user.referral_code}` 
    : "Loading...";

  const copyLink = () => {
    if (!user?.referral_code) return;
    navigator.clipboard.writeText(affiliateLink);
    setCopied(true);
    toast({
      title: "Copied!",
      description: "Affiliate link copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Personal Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Your account details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || user?.email || ''}
                readOnly
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                readOnly
                className="bg-muted"
              />
            </div>
          </CardContent>
        </Card>

        {/* Affiliate Link Card */}
        <Card className="border-purple-200 bg-purple-50/50 dark:border-purple-900 dark:bg-purple-900/20">
          <CardHeader>
            <CardTitle className="text-purple-700 dark:text-purple-300">
              Your Affiliate Link
            </CardTitle>
            <CardDescription>
              Share this link to earn commissions on sales.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="affiliate-link">Referral URL</Label>
              <div className="flex gap-2">
                <Input
                  id="affiliate-link"
                  value={affiliateLink}
                  readOnly
                  className="bg-white font-mono text-sm dark:bg-black"
                />
                <Button onClick={copyLink} variant="outline" className="shrink-0">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Anyone who registers via this link will be attributed to you.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
