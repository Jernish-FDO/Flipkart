import Link from "next/link";
import { ShoppingCart, User, Search } from "lucide-react";
import { Button } from "@repo/ui";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-primary">
              FlipKart
            </Link>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  <User className="h-5 w-5 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/cart">
                <Button variant="ghost" size="sm">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Cart
                </Button>
              </Link>
            </div>
          </div>

          <nav className="mt-4">
            <ul className="flex gap-6 text-sm">
              <li>
                <Link href="/products" className="hover:text-primary">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=electronics" className="hover:text-primary">
                  Electronics
                </Link>
              </li>
              <li>
                <Link href="/products?category=fashion" className="hover:text-primary">
                  Fashion
                </Link>
              </li>
              <li>
                <Link href="/products?category=home-kitchen" className="hover:text-primary">
                  Home & Kitchen
                </Link>
              </li>
              <li>
                <Link href="/products?category=books" className="hover:text-primary">
                  Books
                </Link>
              </li>
              <li>
                <Link href="/products?category=sports" className="hover:text-primary">
                  Sports
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/careers">Careers</Link></li>
                <li><Link href="/press">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Help</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/help/payments">Payments</Link></li>
                <li><Link href="/help/shipping">Shipping</Link></li>
                <li><Link href="/help/returns">Returns</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Policy</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Use</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Social</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#">Facebook</Link></li>
                <li><Link href="#">Twitter</Link></li>
                <li><Link href="#">Instagram</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2026 FlipKart Clone. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
