import Link from "next/link";
import { Button, Card, CardContent } from "@repo/ui";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Welcome to FlipKart Clone
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover amazing products at unbeatable prices
          </p>
          <Link href="/products">
            <Button size="lg">
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"].map((category) => (
            <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="h-24 bg-muted rounded-lg mb-4" />
                <h3 className="font-semibold">{category}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Link key={i} href={`/products`}>
              <Card className="hover:shadow-lg transition-shadow h-full">
                <CardContent className="p-0">
                  <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center text-muted-foreground">
                    Product Image
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">Sample Product {i}</h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      Experience premium quality with our featured collection.
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-lg font-bold">₹1,999</span>
                      <Button size="sm" variant="secondary">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
