import Link from "next/link";
import { Card, CardContent, Badge, Button } from "@repo/ui";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: string[];
    stockQuantity: number;
    isFeatured: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden group">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square bg-muted">
          {product.isFeatured && (
            <Badge className="absolute top-2 left-2 z-10">Featured</Badge>
          )}
          {hasDiscount && (
            <Badge variant="destructive" className="absolute top-2 right-2 z-10">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </span>
          <Button size="sm" disabled={product.stockQuantity === 0}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
