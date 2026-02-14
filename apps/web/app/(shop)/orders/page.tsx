"use client";

import { Card, CardContent, Badge, Button } from "@repo/ui";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  const orders = [
    {
      id: "123",
      orderNumber: "ORD-1234567890",
      status: "PROCESSING",
      createdAt: new Date().toISOString(),
      total: 2358.82,
      itemCount: 1,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-semibold">Order #{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge>{order.status}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                  </p>
                  <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                </div>
                <Link href={`/orders/${order.id}`}>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
