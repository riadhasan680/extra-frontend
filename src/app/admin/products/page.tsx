"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Plus, Trash2, Edit, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast";
import { adminService } from "@/services/admin.service";

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null); // null = Add, object = Edit
  const { addToast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await adminService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      // Fallback empty state
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await adminService.deleteProduct(id);
        const newProducts = products.filter((p) => p.id !== id);
        setProducts(newProducts);
        addToast({
          type: "success",
          title: "Product deleted",
          description: "The product has been successfully removed.",
        });
      } catch (error) {
        addToast({
          type: "error",
          title: "Error",
          description: "Failed to delete product.",
        });
      }
    }
  };

  const handleEdit = (product: any) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string) * 100; // Convert to cents
    const commission_rate = parseInt(formData.get("commission") as string);

    try {
      if (!currentProduct) {
        // Create
        await adminService.createProduct({
          title,
          description: "Product description", // Add a field if needed
          price,
          commission_rate,
        });
        addToast({
          type: "success",
          title: "Product added",
          description: "New product has been successfully created.",
        });
      } else {
        // Update (Simplification: re-fetch or optimistically update)
        // await adminService.updateProduct(currentProduct.id, { ... });
        addToast({
          type: "info",
          title: "Update Feature",
          description: "Product update logic needs to be implemented fully.",
        });
      }
      setIsModalOpen(false);
      fetchProducts(); // Refresh list
    } catch (error) {
      addToast({
        type: "error",
        title: "Error",
        description: "Failed to save product.",
      });
    }
  };

  return (
    <div className="relative flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="bg-linear-to-r from-purple-600 to-purple-900 bg-clip-text text-3xl font-bold text-transparent dark:from-purple-400 dark:to-purple-200">
          Products
        </h1>
        <Button
          onClick={handleAdd}
          className="bg-purple-600 text-white hover:bg-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading products...
                  </div>
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground h-24 text-center"
                >
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {product.title}
                  </TableCell>
                  <TableCell>
                    ${(product.price / 100).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {product.commission_rate}%
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "active"
                          ? "default"
                          : "secondary"
                      }
                      className="bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                    >
                      {product.status || "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Edit className="h-4 w-4 text-gray-500 hover:text-purple-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:border dark:border-gray-800 dark:bg-gray-900">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              {currentProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Product Name</Label>
                <Input
                  name="name"
                  defaultValue={currentProduct?.title}
                  placeholder="Product Name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price ($)</Label>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    defaultValue={
                      currentProduct
                        ? currentProduct.variants?.[0]?.prices?.[0]?.amount /
                          100
                        : ""
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Commission (%)</Label>
                  <Input
                    name="commission"
                    type="number"
                    defaultValue={currentProduct?.metadata?.commission_rate}
                    placeholder="%"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  {currentProduct ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
