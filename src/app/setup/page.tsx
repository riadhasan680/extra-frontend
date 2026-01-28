"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";
import { MEDUSA_URL } from "@/lib/api";

export default function SetupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; key?: string } | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      // 0. Basic Validation
      if (!email.trim() || !password.trim()) {
        throw new Error("Email and password are required.");
      }

      // 1. Authenticate (Try Medusa v2 Auth first, then v1)
      let token = "";
      let useSession = false;
      
      try {
        // Try Medusa v2 Auth (Session-based)
        const v2LoginRes = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), password: password.trim() }),
          credentials: "include", // Important for v2 session cookies
        });

        if (v2LoginRes.ok) {
            useSession = true;
            // v2 might return a token or just set a cookie. We assume cookie if no token.
            const data = await v2LoginRes.json().catch(() => ({}));
            if (data.token) token = data.token;
            if (data.access_token) token = data.access_token;
          } else {
            throw new Error("v2 login failed");
          }
      } catch (err) {
        // Fallback to Medusa v1 Admin Token
        try {
          const loginRes = await fetch(`${MEDUSA_URL}/admin/auth/token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), password: password.trim() }),
          });
          
          if (loginRes.ok) {
            const data = await loginRes.json();
            token = data.access_token;
          } else {
             throw new Error("Admin login failed");
          }
        } catch (innerErr) {
          // Fallback to Store Login (if custom backend uses it for admin)
          const storeLoginRes = await fetch(`${MEDUSA_URL}/store/auth/login`, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ email: email.trim(), password: password.trim() }),
          });
          
          if (storeLoginRes.ok) {
             const data = await storeLoginRes.json();
             token = data.access_token || data.token; 
          } else {
             throw new Error("Invalid credentials. Please check your email and password.");
          }
        }
      }

      // 2. Create Key
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      
      // Try standard Medusa v1/v2 endpoints
      let keyRes = await fetch(`${MEDUSA_URL}/admin/publishable-api-keys`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title: "Web API Key" }),
        credentials: useSession ? "include" : "omit",
      });

      // Fallback to Medusa v2 unified api-keys endpoint
      if (!keyRes.ok) {
        console.log(`Initial key creation failed (${keyRes.status}). Trying fallback...`);
        keyRes = await fetch(`${MEDUSA_URL}/admin/api-keys`, {
          method: "POST",
          headers,
          body: JSON.stringify({ title: "Web API Key", type: "publishable" }),
          credentials: useSession ? "include" : "omit",
        });
      }

      if (!keyRes.ok) {
        const errText = await keyRes.text();
        console.error("API Key Creation Failed:", keyRes.status, errText);
        let errMsg = "Failed to create API Key.";
        try {
           const errJson = JSON.parse(errText);
           errMsg = errJson.message || errMsg;
        } catch (e) {}
        throw new Error(`${errMsg} (Status: ${keyRes.status})`);
      }

      const keyData = await keyRes.json();
      // Handle different response structures (v1 vs v2)
      const apiKey = keyData.publishable_api_key?.id || keyData.key?.id || keyData.id;

      if (!apiKey) {
        throw new Error("API Key created but ID not found in response.");
      }

      setResult({
        success: true,
        message: "API Key created successfully!",
        key: apiKey,
      });

    } catch (error: any) {
      console.error("Setup error:", error);
      setResult({
        success: false,
        message: error.message || "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Setup: Generate API Key</CardTitle>
          <CardDescription>
            Enter your Admin credentials to generate a Publishable API Key.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Admin Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="temp-admin@medusa-test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="supersecret"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Key"
              )}
            </Button>
          </form>

          {result && (
            <div className="mt-6">
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
                <AlertDescription className="mt-2 break-all">
                  {result.message}
                  {result.key && (
                    <div className="mt-4 rounded bg-muted p-3 font-mono text-sm">
                      <p className="mb-1 text-xs text-muted-foreground">Add this to .env.local:</p>
                      <p className="select-all font-bold">{result.key}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="mt-8 rounded-lg border bg-muted/50 p-4 text-sm">
            <div className="flex items-center gap-2 font-medium text-muted-foreground mb-2">
              <HelpCircle className="h-4 w-4" />
              <span>Forgot Credentials?</span>
            </div>
            <p className="text-muted-foreground mb-2">
              If you don't know your admin login, create a new one via your backend terminal:
            </p>
            <pre className="overflow-x-auto rounded bg-background p-2 font-mono text-xs border">
              npx medusa user -e temp-admin@medusa-test.com -p supersecret
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
