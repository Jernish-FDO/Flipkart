"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Badge, Separator, Card, CardContent, Avatar, AvatarFallback, useToast } from "@repo/ui";
import { ShoppingCart, Star, Truck, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const { user } = useAuth();
  const { addItem, isLoading: cartLoading } = useCart();
  const { toast } = useToast();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const images = product.images || [];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to add items to cart",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    setIsAddingToCart(true);
    
    try {
      await addItem(product.id, quantity);
      toast({
        title: "Added to cart",
        description: `${product.name} (${quantity}) added to your cart`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add to cart",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to proceed",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    await handleAddToCart();
    router.push("/cart");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-muted rounded-lg mb-4 overflow-hidden">
            {images[selectedImage] ? (
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square bg-muted rounded-md overflow-hidden ${
                    idx === selectedImage ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.category?.name}</p>
            </div>
            {product.isFeatured && <Badge>Featured</Badge>}
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.reviews?.length || 0} reviews
            </span>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl font-bold">₹{product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ₹{product.compareAtPrice.toFixed(2)}
                  </span>
                  <Badge variant="destructive">
                    {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                  </Badge>
                </>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Inclusive of all taxes</p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Free delivery on orders above ₹500</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">1 Year Warranty</span>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-muted"
              >
                -
              </button>
              <span className="px-4 py-2 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                className="px-4 py-2 hover:bg-muted"
              >
                +
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              {product.stockQuantity} items available
            </p>
          </div>

          <div className="flex gap-4 mb-8">
            <Button 
              size="lg" 
              className="flex-1" 
              disabled={product.stockQuantity === 0 || isAddingToCart}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="flex-1"
              disabled={product.stockQuantity === 0 || isAddingToCart}
              onClick={handleBuyNow}
            >
              Buy Now
            </Button>
          </div>

          <Separator className="my-6" />

          <div>
            <h2 className="font-semibold mb-4">Product Description</h2>
            <p className="text-muted-foreground whitespace-pre-line">
              {product.description || product.shortDescription || 'No description available'}
            </p>
          </div>
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {product.reviews.map((review: any) => (
              <Card key={review.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarFallback>
                        {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">
                          {review.user?.firstName} {review.user?.lastName}
                        </p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <p>{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
