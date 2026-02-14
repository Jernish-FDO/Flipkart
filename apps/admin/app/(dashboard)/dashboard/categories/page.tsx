"use client";

import { Card, CardContent, Button } from "@repo/ui";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const categories = [
    {
      id: "1",
      name: "Electronics",
      slug: "electronics",
      isActive: true,
      productCount: 150,
    },
    {
      id: "2",
      name: "Fashion",
      slug: "fashion",
      isActive: true,
      productCount: 320,
    },
    {
      id: "3",
      name: "Home & Kitchen",
      slug: "home-kitchen",
      isActive: true,
      productCount: 210,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Slug</th>
                  <th className="text-left py-3 px-4">Products</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{category.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{category.slug}</td>
                    <td className="py-3 px-4">{category.productCount} products</td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
