# FlipKart Clone - Enterprise E-commerce Platform

A full-stack, enterprise-grade e-commerce SaaS platform built with modern technologies.

## 🏗️ Architecture

**Modular Monolith** architecture designed to evolve into microservices.

### Tech Stack

- **Monorepo**: Turborepo
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL 15+, Redis 7+
- **Auth**: NextAuth.js, Passport.js, JWT
- **Payments**: Stripe
- **Runtime/Package Manager**: Bun
- **DevOps**: Docker, Docker Compose, GitHub Actions

## 📁 Project Structure

```
flipkart-clone/
├── apps/
│   ├── web/              # Next.js Customer Frontend
│   ├── admin/            # Next.js Admin Dashboard
│   └── api/              # NestJS Backend API
├── packages/
│   ├── ui/               # Shared shadcn/ui Components
│   ├── database/         # Prisma Schema & Client
│   ├── types/            # Shared TypeScript Types
│   ├── config/           # Shared Configuration
│   └── utils/            # Shared Utilities
├── infrastructure/
│   └── docker/           # Docker Configurations
└── .github/
    └── workflows/        # CI/CD Pipelines
```

## ✅ Completed Features (Backend Integration)

The following core flows are fully integrated and functional:

1.  **Authentication**
    -   Secure Login/Register with JWT
    -   Persistent sessions via localStorage
    -   Role-based access control (RBAC)

2.  **Shopping Experience**
    -   **Product Catalog**: Browsing and product details
    -   **Cart**: Real-time cart management (add, update, remove)
    -   **Checkout**: Order placement with address validation
    -   **Orders**: Order history and status tracking

3.  **UI/UX**
    -   Toast notifications for user feedback
    -   Loading skeletons and error handling
    -   Responsive design for mobile/desktop

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- Docker & Docker Compose
- PostgreSQL 15+ (via Docker)
- Redis 7+ (via Docker)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd flipkart-clone
    ```

2.  **Install dependencies**
    ```bash
    bun install
    ```

3.  **Set up environment variables**
    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

4.  **Start Docker services**
    ```bash
    bun run docker:up
    ```

5.  **Initialize Database**
    ```bash
    # Push schema to database
    bun run db:push
    
    # Seed initial data (Admin user, categories)
    bun run db:seed
    ```

6.  **Start development servers**
    ```bash
    bun run dev
    ```

### Available Services

-   **Customer Web**: http://localhost:3000
    -   *Admin Credentials*: `admin@flipkart-clone.com` / `password123` (after seeding)
-   **Admin Dashboard**: http://localhost:3001
-   **API**: http://localhost:4000
-   **API Docs**: http://localhost:4000/api
-   **PostgreSQL**: localhost:5432
-   **Redis**: localhost:6379
-   **Prisma Studio**: `bun run db:studio`

## 📝 Development Commands

```bash
# Development
bun run dev              # Start all apps in dev mode
bun run build            # Build all apps
bun run lint             # Lint all code
bun run format           # Format code with Prettier
bun run type-check       # TypeScript type checking
bun run test             # Run all tests
bun run test:coverage    # Run tests with coverage

# Database
bun run db:push          # Deploy schema (prototyping)
bun run db:migrate       # Create/Run migrations (production)
bun run db:seed          # Seed database
bun run db:studio        # Open Prisma Studio

# Docker
bun run docker:up        # Start Docker services
bun run docker:down      # Stop Docker services
bun run docker:logs      # View Docker logs

# Clean
bun run clean            # Clean all build artifacts
```

## 🧪 Testing

```bash
# Run all tests
bun run test

# Run specific workspace tests
bun run test --filter=@repo/api
```

## 📦 Workspace Packages

### Apps

-   **web**: Customer-facing Next.js application
-   **admin**: Admin dashboard Next.js application
-   **api**: NestJS backend API

### Packages

-   **ui**: Shared React components (shadcn/ui)
-   **database**: Prisma schema and client
-   **types**: Shared TypeScript types
-   **config**: Shared configuration (ESLint, TypeScript, etc.)
-   **utils**: Shared utility functions

## 🔒 Environment Variables

See `.env.example` for all required environment variables.

**Critical variables**:
-   `DATABASE_URL`: PostgreSQL connection string
-   `REDIS_URL`: Redis connection string
-   `JWT_SECRET`: Secret for JWT tokens
-   `STRIPE_SECRET_KEY`: Stripe API secret key

## 🤝 Contributing

1.  Create a feature branch
2.  Make your changes
3.  Write tests
4.  Ensure all checks pass (`bun run lint`, `bun run type-check`, `bun run test`)
5.  Submit a pull request

## 📄 License

MIT

---

**Status**: Phase 1 - Backend Integration Complete
**Last Updated**: Feb 2026
