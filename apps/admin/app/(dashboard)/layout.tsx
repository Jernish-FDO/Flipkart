import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  FolderTree,
  BarChart,
  Settings,
  LogOut
} from "lucide-react";
import { Button, Separator, Avatar, AvatarFallback } from "@repo/ui";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/dashboard/products", icon: Package },
  { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Categories", href: "/dashboard/categories", icon: FolderTree },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-muted/10">
        <div className="p-6">
          <Link href="/dashboard" className="text-2xl font-bold text-primary">
            FlipKart Admin
          </Link>
        </div>

        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} href={item.href}>
                <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4" />

        <div className="px-6 space-y-2">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">admin@flipkart.com</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="flex-1">
        <header className="border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold">Dashboard</h1>
          </div>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
