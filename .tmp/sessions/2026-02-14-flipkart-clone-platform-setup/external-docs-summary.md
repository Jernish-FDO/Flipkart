# External Documentation Summary

Session ID: 2026-02-14-flipkart-clone-platform-setup
Generated: 2026-02-14T00:35:00Z

---

## 1. Next.js 14+ App Router

**Source**: Official Next.js Documentation (v16.1.6)
**Task ID**: bg_56b0ad5c

### Key Concepts for E-commerce

#### Architecture & File Conventions
- `layout.tsx` - Shared UI that persists across navigations (Nav, Footer)
- `page.tsx` - Unique UI of a route (publicly accessible)
- `loading.tsx` - Instant loading states using React Suspense
- `error.tsx` - Runtime error boundaries
- `route.ts` - Custom API endpoints (Route Handlers)
- `(route-groups)` - Organize routes without affecting URLs

**Recommended Structure for E-commerce**:
```
app/
├── (shop)/           # Customer storefront with shared layout
│   ├── layout.tsx    # Global Nav/Cart
│   ├── page.tsx      # Home page
│   └── product/      # Product pages
├── (auth)/           # Authentication flows
└── api/              # API routes and webhooks
```

#### Server vs Client Components
- **Server Components (default)**: Ideal for data-heavy pages (Product listings, details)
  - Zero JavaScript sent to client
  - Direct database/API access
  - SEO-friendly
- **Client Components (`'use client'`)**: For interactivity
  - Event handlers (onClick, onChange)
  - Browser APIs
  - useState, useEffect hooks

**Best Practice**: Keep product info as Server Components, use Client Components only for interactive elements (Add to Cart, Image Carousel)

#### Data Fetching Patterns
- **Server-side**: `await fetch()` directly in async Server Components
- **Request Memoization**: Automatic deduplication of identical fetch calls
- **Deduplication**: Use `React.cache` for non-fetch calls (ORM queries)
- **On-demand Revalidation**: Use `revalidateTag()` for webhook-triggered updates

#### Performance Optimization
- **Image Optimization**: `<Image>` component with `priority` for main product images
- **generateStaticParams**: Pre-render top products at build time
- **Streaming**: Use `Suspense` for slow data without blocking main content
- **Optimistic UI**: Use `useOptimistic` for instant cart feedback

#### TypeScript Integration
- **Typed Routes**: Enable `experimental.typedRoutes` for compile-time link checking
- **Typed Env Vars**: Use `experimental.typedEnv` for type-safe environment variables
- **Async Components**: Full support with TypeScript 5.1+

#### Production Best Practices
- Use Suspense boundaries for progressive rendering
- Implement streaming for slow data
- Leverage Full Route Cache for static pages
- Use ISR (Incremental Static Regeneration) for product catalog

**Performance Targets**:
- LCP (Largest Contentful Paint) < 2s
- TTFB (Time to First Byte) < 200ms
- Use generateStaticParams for top 1,000 products

---

## 2. NestJS (Node.js Framework)

**Source**: Official NestJS Documentation
**Task ID**: bg_25db3d45

### Key Patterns for Modular Monolith

#### Monorepo Architecture
- **Standard Mode**: Single project (simple APIs)
- **Monorepo Mode**: Multiple apps and libs
  - **Apps**: Entry points (HTTP, Microservice, CLI)
  - **Libs**: Domain logic, shared DTOs, database clients

**Recommended Structure**:
```json
{
  "monorepo": true,
  "projects": {
    "api-gateway": { "type": "application" },
    "auth-service": { "type": "application" },
    "shared-logic": { "type": "library" }
  }
}
```

#### Core Building Blocks
- **Controllers**: Handle HTTP requests (thin layer)
- **Services/Providers**: Business logic (`@Injectable()`)
- **Dependency Injection**: Constructor-based, managed by IoC container

```typescript
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}
  
  @Post()
  async create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }
}
```

#### Request Lifecycle
**Pipeline**: Middleware → Guards → Interceptors → Pipes → Handler

- **Pipes**: Validation and transformation (use `ValidationPipe` globally)
- **Guards**: Authentication and Authorization (RBAC)
- **Exception Filters**: Standardize error responses

**Global Validation**:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

#### Database Integration
**Prisma Pattern**:
```typescript
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

**Best Practice**: Place database service in shared library for reuse across apps

#### Authentication & Authorization
- Use `@nestjs/passport` for JWT/Session auth
- Implement RBAC Guards with Reflector

```typescript
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
```

#### Testing Strategy
1. **Unit Tests**: Use `Test.createTestingModule` to mock providers
2. **Integration Tests**: Test modules with real/mocked database
3. **E2E Tests**: Use `supertest` for full HTTP stack

#### Evolution to Microservices
**Key Patterns**:
1. **Interface-Driven Libraries**: Define domain logic in libs
2. **Shared DTOs**: Store in shared-types library for contract consistency
3. **Hybrid Applications**: Use `app.connectMicroservice()` for gradual migration
4. **Outbox Pattern**: Use database table for event delivery
5. **Platform Agnosticism**: Use `ClientProxy` for internal communication

**Microservice Bootstrap**:
```typescript
const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
  transport: Transport.TCP,
  options: { port: 3001 },
});
```

---

## 3. Prisma ORM

**Source**: Official Prisma Documentation
**Task ID**: bg_58d0ecb9

### Enterprise E-commerce Patterns

#### Multi-Schema Support
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["base", "shop"]
}

model User {
  id     Int     @id @default(autoincrement())
  orders Order[]
  @@schema("base")
}

model Order {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int
  @@schema("shop")
}
```

#### PostgreSQL Specific Features

**JSONB with GIN Indexes** (for dynamic product attributes):
```prisma
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearchPostgres", "postgresqlExtensions"]
}

datasource db {
  provider   = "postgresql"
  url        = env("DATABASE_URL")
  extensions = [pgcrypto]
}

model Product {
  id         Int  @id @default(autoincrement())
  attributes Json // Metadata like color, size
  @@index([attributes(ops: JsonbPathOps)], type: Gin)
}
```

#### Migrations Workflow
- **Deployment**: `npx prisma migrate deploy` in CI/CD
- **Seeding**: Configure in `prisma.config.ts`

```typescript
// prisma.config.ts
export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts"
  }
});
```

#### Connection Pooling & Performance
- **Manual Tuning**: `?connection_limit=20&pool_timeout=10`
- **Optimization**: Use `include` to avoid N+1 queries

```typescript
const products = await prisma.product.findMany({
  include: { categories: true }, // Batches queries
});
```

#### E-commerce Database Patterns

| Feature | Pattern | Benefit |
|---------|---------|---------|
| Product Variants | JSONB + GIN index | Avoids complex EAV tables |
| Inventory | Atomic updates with `$transaction` | Prevents overselling |
| Search | `fullTextSearchPostgres` | Real-time search |
| Relations | Explicit m:n (OrderItems) | Track price/quantity at purchase |
| Scaling | Prisma Accelerate + `$extends` | Edge caching |

**OrderItems Pattern** (Explicit Join Table):
```prisma
model Order {
  id    String      @id @default(uuid())
  items OrderItem[]
}

model OrderItem {
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  price     Decimal // Snapshotted price at checkout
  quantity  Int
  @@id([orderId, productId])
}
```

**Performance Tip**: Use **Prisma Optimize** to identify slow queries during peak traffic

---

## 4. Turborepo (Monorepo Management)

**Source**: Official Turborepo Documentation (v2.x)
**Task ID**: bg_599d1ba5

### Monorepo Setup

**Workspace Structure**:
```json
{
  "name": "my-turborepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "devDependencies": {
    "turbo": "^2.6.1"
  }
}
```

**Pattern**:
- **Apps**: Next.js, NestJS, Vite (runnable applications)
- **Packages**: tsconfig, eslint-config, ui, api-types, db (shared libraries)

#### Workspace Configuration

**turbo.json**:
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local", "**/tsconfig*.json"],
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "lint": {
      "env": ["TIMING"]
    }
  }
}
```

#### Build Pipeline
- **Topological Sort**: Tasks run in correct dependency order
- **Parallelism**: Independent tasks run simultaneously
- **`^` Symbol**: Build dependencies before dependent packages

#### Caching Strategies
- **Local Cache**: `.turbo/cache`
- **Remote Cache**: Shared across team/CI (Vercel Remote Cache)
- **Hashing**: Based on inputs, env vars, and dependency hashes

#### Shared Packages Strategies
- **JIT (Just-in-Time)**: Export TypeScript source, consumer transpiles (fast local dev)
- **Compiled**: Build to `dist/` via tsc/tsup (robust for large repos)

**Package Dependencies**:
```json
"devDependencies": {
  "@repo/eslint-config": "workspace:*",
  "@repo/typescript-config": "workspace:*"
}
```

#### CI/CD Integration
- Use `turbo-ignore` to skip builds for unchanged files
- Filter tasks: `turbo run build --filter=[...changed]`

#### Environment Variables
**Strict Mode** (default in v2.x):
```json
{
  "tasks": {
    "build": {
      "env": ["DATABASE_URL", "NEXT_PUBLIC_API_URL"]
    }
  }
}
```

### Next.js + NestJS Patterns

#### A. Shared DTOs
Create `packages/api-types` for type-safe network boundaries:
```
packages/api-types/
  ├── src/index.ts  # export interface UserDTO { ... }
  └── package.json
```

#### B. Database Sharing
Centralize schema in `packages/database`:
- NestJS imports Prisma client for service logic
- Next.js imports types or client for Server Actions

#### C. Dev Mode for Long-Running Tasks
```json
{
  "tasks": {
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

#### Best Practices for Large Monorepos
1. **Strict Mode**: Use `envMode: "strict"` to avoid ghost cache hits
2. **Boundaries**: Enforce import rules (prevent cross-contamination)
3. **Pruning**: Use `turbo prune --scope=web` for Docker builds
4. **Codegen Caching**: Cache GraphQL/Prisma generation outputs

---

## 5. shadcn/ui (Component Library)

**Source**: Official shadcn/ui Documentation
**Task ID**: bg_0355f471

### Installation

```bash
npx shadcn@latest create
```

**Features**:
- Framework support: Next.js, Vite, Remix, Astro
- Registry choice: Radix UI or Base UI
- Configuration stored in `components.json`

### Component Architecture

**Headless Approach**:
- **Radix UI**: Handles accessibility, focus, keyboard navigation
- **Tailwind CSS**: Handles styling
- **CVA (class-variance-authority)**: Manages variants

**Example (Sheet Component)**:
```typescript
const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
    </SheetPrimitive.Content>
  </SheetPortal>
))
```

**Key Utilities**:
- `cn` - Merges Tailwind classes using `clsx` + `tailwind-merge`

### Theming & Dark Mode

**CSS Variables (OKLCH format)**:
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

- Dark mode via `.dark` class on `html` or `body`
- Variables mapped to Tailwind (`bg-primary`, `text-foreground`)

### Forms with React Hook Form & Zod

```tsx
const formSchema = z.object({
  username: z.string().min(2),
})

function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  return (
    <Form {...form}>
      <FormField
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="shadcn" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Form>
  )
}
```

### E-commerce UI Patterns

#### A. Product Discovery
- **Components**: Card, Badge, Button
- **Pattern**: Badge for status (Sale, New), Button for actions
- **Accessibility**: Proper `alt` text, semantic HTML

#### B. Inventory Management
- **Component**: DataTable (TanStack Table)
- **Features**: Column visibility, server-side pagination

#### C. Multi-step Checkout
- **Components**: Form, Tabs, Separator
- **Pattern**: Step-by-step validation with Zod schemas

#### D. Quick View & Filters
- **Components**: Dialog (Quick View), Sheet (Mobile Filters)
- **Accessibility**: Focus trapping, scroll locking

### Available Components

| Category | Components |
|----------|-----------|
| Layout | Card, Sidebar, Separator, Aspect Ratio |
| Inputs | Input, Textarea, Select, Radio, Checkbox, Switch, Slider |
| Feedback | Alert, Badge, Progress, Skeleton, Toast, Sonner |
| Navigation | Breadcrumb, Navigation Menu, Pagination, Tabs |
| Overlays | Dialog, Sheet, Popover, Tooltip, Dropdown Menu |
| Data | Table, Carousel, Calendar, Chart |

**Best Practice**: Use **shadcn/blocks** to copy entire sections for consistency

---

## 6. Stripe Payment Integration

**Source**: Official Stripe Documentation
**Task ID**: bg_418e5107

### Payment Intents API

**Lifecycle Management**:
```typescript
// Server-side (Next.js Server Action or API Route)
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000, // $20.00
  currency: 'usd',
  automatic_payment_methods: { enabled: true },
  metadata: { orderId: 'ord_123' },
});

return { clientSecret: paymentIntent.client_secret };
```

**Security**: Only pass `client_secret` to frontend, never expose full PaymentIntent or secret key

**3D Secure**: Use `requires_action` status to trigger authentication modals via `stripe.confirmPayment()`

### Stripe Checkout

**Hosted vs Embedded**:
- **Hosted**: Redirects to Stripe URL (simple, PCI-compliant)
- **Embedded**: iframe on your site (`ui_mode: 'embedded'`)

```typescript
const session = await stripe.checkout.sessions.create({
  ui_mode: 'embedded',
  line_items: [{ price: 'price_123', quantity: 1 }],
  mode: 'payment',
  return_url: 'https://example.com/return?session_id={CHECKOUT_SESSION_ID}',
});
```

### Webhook Security (Next.js App Router)

**Critical**: Verify webhook signatures to prevent replay attacks

```typescript
// app/api/webhooks/route.ts
export async function POST(req: Request) {
  const body = await req.text(); // Raw body required
  const signature = req.headers.get('stripe-signature') as string;

  try {
    const event = stripe.webhooks.constructEvent(
      body, 
      signature, 
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      // Fulfill order here
    }
    return Response.json({ received: true });
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
}
```

### Customer & Payment Method Management

- **Customer Creation**: Store `stripeCustomerId` in database
- **Reusable Methods**: Use `setup_future_usage: 'off_session'` for saved cards
- **Migration**: Use PaymentMethods API (not legacy Tokens)

### Testing

**Test Cards**:
- Success: `4242 4242 4242 4242`
- 3D Secure: `pm_card_visa_requires_action`
- Failures: Various test cards for different scenarios

**Test Clocks**: Time-travel for subscription testing (renewals, trials)

### Compliance & Security

**PCI Compliance**:
- Using Stripe Elements/Checkout = SAQ-A (minimal burden)
- No card data storage/transmission on your servers

**SCA (Strong Customer Authentication)**:
- Auto-handled by `automatic_payment_methods`
- Required in EU/UK

**Next.js Security**:
- `STRIPE_SECRET_KEY` in `.env.local` (server-only)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` for frontend
- Implement idempotency keys to prevent double-charging

### E-commerce Checklist

1. ✅ Frontend: Use `@stripe/react-stripe-js` and `Elements`
2. ✅ Backend: Use `stripe` Node SDK in Server Actions/API Routes
3. ✅ Async: Implement webhook listener for `payment_intent.succeeded`
4. ✅ Safety: Always validate amounts on server, never trust frontend

---

## Summary & Integration Strategy

### For Phase 1 (MVP Development)

**Frontend Stack**:
- Next.js 14 App Router with TypeScript
- shadcn/ui for consistent, accessible components
- React Hook Form + Zod for validation
- Stripe Elements for payment UI

**Backend Stack**:
- NestJS with modular architecture
- Prisma ORM with PostgreSQL
- JWT authentication with Passport
- Stripe SDK for payment processing

**Monorepo Management**:
- Turborepo for build orchestration
- Shared packages: ui, types, database, config
- Strict env mode for security
- Remote caching for CI/CD

**Key Integration Points**:
1. Shared TypeScript types between Next.js and NestJS
2. Prisma client used in both frontend (Server Actions) and backend
3. Stripe webhooks handled in Next.js API routes
4. shadcn/ui components used across all frontend apps

**Performance Optimization**:
- generateStaticParams for top products
- Streaming with Suspense for slow data
- Optimistic UI for cart interactions
- Edge caching with Prisma Accelerate

**Security Measures**:
- All payments via Stripe (PCI-compliant)
- Webhook signature verification
- Environment variable validation
- Input sanitization with Zod

---

**Last Updated**: 2026-02-14T00:35:00Z
