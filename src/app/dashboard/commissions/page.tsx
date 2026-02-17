"use client";

import { useEffect, useState } from "react";
import { storeService } from "@/services/store.service";
import { Commission } from "@/types/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommissions = async () => {
      try {
        const data = await storeService.getCommissions();
        setCommissions(data || []);
      } catch (error) {
        console.error("Failed to fetch commissions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCommissions();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Commission History</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View all your earnings from referrals.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Commissions</CardTitle>
        </CardHeader>
        <CardContent>
          {commissions.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No commission records found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {commissions.map((comm) => (
                  <TableRow key={comm.id}>
                    <TableCell className="font-medium">#{comm.order_id?.slice(0, 8)}</TableCell>
                    <TableCell>{formatDate(comm.created_at)}</TableCell>
                    <TableCell>Commission for Order #{comm.order_id?.slice(0, 8)}</TableCell>
                    <TableCell className="text-right font-bold text-green-600">
                      {formatCurrency(comm.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        comm.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {comm.status || 'Pending'}
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
  );
}
