"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Label, Textarea, Separator, useToast, Skeleton } from "@repo/ui";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { ordersApi } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { items, subtotal, clearCart, isLoading: cartLoading } = useCart();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    if (!user && !cartLoading) {
      router.push("/login?redirect=/checkout");
    } else if (items.length === 0 && !cartLoading) {
      router.push("/cart");
    }
  }, [user, items, cartLoading, router]);

  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setAddress((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.firstName || !address.phone || !address.address1 || !address.city || !address.postalCode) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    if (!token) return;

    setIsProcessing(true);
    try {
      const orderData = {
        shippingAddress: address,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentMethod: "COD",
        total: total
      };

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed.",
      });
      
      router.push("/orders");
    } catch (error) {
      toast({
        title: "Order failed",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <div>
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="flex gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-2 rounded-full ${
              s <= step ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={address.firstName} onChange={handleInputChange} placeholder="John" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={address.lastName} onChange={handleInputChange} placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={address.phone} onChange={handleInputChange} placeholder="+91 98765 43210" required />
                  </div>
                  <div>
                    <Label htmlFor="address1">Address Line 1</Label>
                    <Input id="address1" value={address.address1} onChange={handleInputChange} placeholder="123 Main Street" required />
                  </div>
                  <div>
                    <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                    <Input id="address2" value={address.address2} onChange={handleInputChange} placeholder="Apartment, suite, etc." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={address.city} onChange={handleInputChange} placeholder="Mumbai" required />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input id="state" value={address.state} onChange={handleInputChange} placeholder="Maharashtra" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" value={address.postalCode} onChange={handleInputChange} placeholder="400001" required />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" value={address.country} onChange={handleInputChange} disabled />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button type="submit">Continue to Payment</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border rounded-md p-4 flex items-center gap-4 cursor-pointer bg-muted/50 border-primary">
                  <div className="h-4 w-4 rounded-full border border-primary bg-primary" />
                  <span className="font-medium">Cash on Delivery (COD)</span>
                </div>
                
                <div className="border rounded-md p-4 flex items-center gap-4 cursor-not-allowed opacity-50">
                  <div className="h-4 w-4 rounded-full border" />
                  <span className="font-medium">Credit / Debit Card (Coming Soon)</span>
                </div>

                <div className="border rounded-md p-4 flex items-center gap-4 cursor-not-allowed opacity-50">
                  <div className="h-4 w-4 rounded-full border" />
                  <span className="font-medium">UPI (Coming Soon)</span>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? "Placing Order..." : `Pay ₹${total.toFixed(2)}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (18%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-semibold text-lg mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-md overflow-hidden">
                      {item.product.images?.[0] && (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">₹{item.product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
