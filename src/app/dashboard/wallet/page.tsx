"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { storeService } from "@/services/store.service";
import { Wallet, Commission, Payout } from "@/types/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

export default function WalletPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const { addToast } = useToast();

  const fetchData = async () => {
    try {
      const [walletData, commissionsData, payoutsData] = await Promise.all([
        storeService.getWallet(),
        storeService.getCommissions().catch(() => []),
        storeService.getPayouts().catch(() => [])
      ]);
      setWallet(walletData);
      setCommissions(commissionsData || []);
      setPayouts(payoutsData || []);
    } catch (error) {
      console.error("Failed to fetch wallet data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequestPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      addToast({
        type: "error",
        title: "Invalid Amount",
        description: "Please enter a valid positive amount.",
      });
      return;
    }

    if (Number(amount) > (wallet?.balance || 0)) {
       addToast({
        type: "error",
        title: "Insufficient Balance",
        description: "You cannot withdraw more than your available balance.",
      });
      return;
    }

    setRequestLoading(true);
    try {
      await storeService.requestPayout({ 
        amount: Number(amount),
        method: method || "Default" 
      });
      addToast({
        type: "success",
        title: "Request Submitted",
        description: "Your payout request has been submitted successfully.",
      });
      setAmount("");
      setMethod("");
      // Refetch data
      await fetchData();
    } catch (error: any) {
      console.error("Payout request failed", error);
       addToast({
        type: "error",
        title: "Request Failed",
        description: error.response?.data?.message || "Failed to submit payout request.",
      });
    } finally {
      setRequestLoading(false);
    }
  };

  const pendingAmount = commissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);

  const paidAmount = commissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Wallet & Withdraw</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Available Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(wallet?.balance || 0)}</div>
            <p className="text-xs text-gray-500">Ready to withdraw</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Pending Commission</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingAmount)}</div>
            <p className="text-xs text-gray-500">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
            <p className="text-xs text-gray-500">Lifetime payouts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Withdraw Form */}
        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
            <CardDescription>
              Request a payout to your preferred method.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input 
                  id="amount" 
                  placeholder="0.00" 
                  type="number" 
                  max={wallet?.balance} 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="method">Payment Method</Label>
                <Input 
                  id="method" 
                  placeholder="PayPal Email / Bank Details" 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                disabled={!wallet?.balance || wallet.balance <= 0 || requestLoading}
                type="submit"
              >
                {requestLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Request Withdrawal
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Payout History */}
        <Card>
          <CardHeader>
            <CardTitle>Payout History</CardTitle>
          </CardHeader>
          <CardContent>
            {payouts.length === 0 ? (
               <div className="text-center text-gray-500 py-4">No payout history found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payouts.slice(0, 5).map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell>{formatDate(payout.created_at)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(payout.amount)}</TableCell>
                      <TableCell className="text-right">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          payout.status === 'processed' ? 'bg-green-100 text-green-800' : 
                          payout.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {payout.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
