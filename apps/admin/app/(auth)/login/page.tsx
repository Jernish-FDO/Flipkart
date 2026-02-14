import { Card, CardHeader, CardTitle, CardContent, Button } from "@repo/ui";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Admin authentication UI will be implemented in the next step
          </p>
          <Button className="w-full">Continue to Admin Login</Button>
        </CardContent>
      </Card>
    </div>
  );
}
