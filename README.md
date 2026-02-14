# 🛍️ FlipKart Clone - Enterprise E-commerce Platform

[![Status](https://img.shields.io/badge/Status-Phase%201%20MVP-blue)](https://github.com/Jernish-FDO/Flipkart)
[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20NestJS%20%7C%20Prisma%20%7C%20Bun-black)](https://bun.sh)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

A scalable, high-performance, multi-tenant e-commerce SaaS platform built from scratch. Designed as a **Modular Monolith** with a clear migration path to **Microservices**.

---

## 🚀 Key Features

### 🛒 Customer Experience
-   **Authentication**: Secure JWT-based login/register with RBAC (Customer, Admin, Vendor).
-   **Product Discovery**: Category browsing, advanced search, and product details.
-   **Shopping Cart**: Real-time cart management with persistent state.
-   **Checkout Flow**: Multi-step checkout with address validation and order summary.
-   **Order Tracking**: Real-time status updates (Processing, Shipped, Delivered).
-   **User Dashboard**: Manage profile, addresses, and view order history.

### 💼 Vendor & Admin Management
-   **Admin Dashboard**: Comprehensive analytics, user management, and platform settings.
-   **Product Management**: CRUD operations for products, categories, and inventory.
-   **Order Processing**: Fulfillment workflow, cancellation handling, and refunds.
-   **Vendor Portal**: (Upcoming) Multi-vendor support for marketplace operations.

### ⚙️ Technical Capabilities
-   **Performance**: Server-side rendering (SSR) with Next.js 14 App Router.
-   **Type Safety**: End-to-end TypeScript from database to frontend.
-   **Scalability**: Dockerized services, Redis caching, and connection pooling.
-   **Developer Experience**: Monorepo setup with Turborepo and Bun for lightning-fast builds.

---

## 🏗️ Architecture

The platform follows a **Modular Monolith** architecture. This ensures development velocity while maintaining strict boundaries between domains, allowing modules to be extracted into microservices in the future.

### System Components

1.  **Apps**:
    -   `apps/web`: Next.js Customer Storefront (Client & Server Components)
    -   `apps/admin`: Next.js Admin Dashboard (Internal tools)
    -   `apps/api`: NestJS Backend API (Modular architecture)

2.  **Shared Packages**:
    -   `packages/database`: Prisma Schema & Client (Single source of truth)
    -   `packages/ui`: Shared Design System (shadcn/ui + Tailwind)
    -   `packages/types`: Shared DTOs and interfaces
    -   `packages/config`: ESLint, TSConfig, and build settings

3.  **Infrastructure**:
    -   **Database**: PostgreSQL 15 (Multi-schema: `base`, `shop`)
    -   **Cache**: Redis 7 (Session storage, API caching)
    -   **Runtime**: Bun (Package manager & script runner)

---

## 🛠️ Tech Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14** (App Router) | React Framework |
| | **TypeScript** | Static Typing |
| | **Tailwind CSS** | Utility-first Styling |
| | **shadcn/ui** | Component Library |
| | **Zustand** | State Management |
| | **React Hook Form** + **Zod** | Form Validation |
| **Backend** | **NestJS** | Node.js Framework |
| | **Prisma ORM** | Database Access |
| | **Passport.js** | Authentication Strategies |
| | **BullMQ** | Job Queues (Emails, Background tasks) |
| **Data** | **PostgreSQL** | Primary Relational DB |
| | **Redis** | Caching & Pub/Sub |
| **DevOps** | **Turborepo** | Monorepo Build System |
| | **Docker** | Containerization |
| | **Bun** | Package Manager |

---

## 📂 Project Structure

```bash
flipkart-clone/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/modules/     # Domain Modules (Auth, Cart, Order, Product)
│   │   └── src/shared/      # Guards, Decorators, Interceptors
│   ├── web/                 # Customer Frontend
│   │   ├── app/(shop)/      # Shop Routes (Products, Cart, Checkout)
│   │   ├── app/(auth)/      # Auth Routes (Login, Register)
│   │   └── contexts/        # React Contexts (Auth, Cart)
│   └── admin/               # Admin Dashboard
├── packages/
│   ├── database/            # Prisma Schema (`schema.prisma`)
│   ├── ui/                  # UI Components (`@repo/ui`)
│   ├── types/               # Shared Types (`@repo/types`)
│   └── config/              # Shared Config (`@repo/config`)
├── infrastructure/          # Docker Compose & K8s configs
└── README.md
```

---

## 🚦 Getting Started

### Prerequisites
-   [Bun](https://bun.sh) (v1.0+)
-   Docker & Docker Compose

### Step-by-Step Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Jernish-FDO/Flipkart.git
    cd flipkart-clone
    ```

2.  **Install Dependencies**
    ```bash
    bun install
    ```

3.  **Configure Environment**
    ```bash
    cp .env.example .env
    # Update .env with your local credentials if needed
    ```

4.  **Start Infrastructure (DB & Redis)**
    ```bash
    bun run docker:up
    ```
    *Wait for containers `flipkart-postgres` and `flipkart-redis` to be healthy.*

5.  **Initialize Database**
    ```bash
    # Push schema to DB
    bun run db:push
    
    # Seed initial data (Admin user, Categories)
    bun run db:seed
    ```

6.  **Run Development Servers**
    ```bash
    bun run dev
    ```

### Access Points
-   **Web Store**: [http://localhost:3000](http://localhost:3000)
-   **Admin Panel**: [http://localhost:3001](http://localhost:3001)
-   **API Swagger**: [http://localhost:4000/api](http://localhost:4000/api)
-   **Prisma Studio**: `bun run db:studio` (Database GUI)

---

## 🔐 Environment Variables

| Variable | Description | Default (Local) |
| :--- | :--- | :--- |
| `DATABASE_URL` | PostgreSQL Connection | `postgresql://postgres:password@localhost:5432/flipkart_dev?schema=public` |
| `REDIS_URL` | Redis Connection | `redis://localhost:6379` |
| `JWT_SECRET` | Auth Token Secret | `development-secret-key-12345` |
| `NEXT_PUBLIC_API_URL` | API Base URL for Frontend | `http://localhost:4000` |
| `STRIPE_SECRET_KEY` | Stripe Payment Key | `sk_test_...` |

---

## 📡 API Reference

The backend exposes a RESTful API. Key endpoints include:

### Auth
-   `POST /auth/login` - Authenticate user
-   `POST /auth/register` - Create new account
-   `GET /auth/me` - Get current user profile

### Products
-   `GET /products` - List products (pagination, filters)
-   `GET /products/:id` - Get product details
-   `POST /products` - Create product (Admin only)

### Cart
-   `GET /cart` - Get user cart
-   `POST /cart/items` - Add item
-   `PUT /cart/items/:id` - Update quantity
-   `DELETE /cart/items/:id` - Remove item

### Orders
-   `POST /orders` - Place new order
-   `GET /orders` - List user orders
-   `PUT /orders/:id/cancel` - Cancel order

---

## 🗺️ Roadmap

-   [x] **Phase 1: MVP Foundation**
    -   [x] Monorepo & Infrastructure Setup
    -   [x] Database Schema & Auth System
    -   [x] Core Shopping Flow (Cart, Checkout)
    -   [x] Basic Admin Dashboard
-   [ ] **Phase 2: Marketplace Features**
    -   [ ] Vendor Portal & Onboarding
    -   [ ] Advanced Search (Elasticsearch)
    -   [ ] Reviews & Ratings
-   [ ] **Phase 3: Scale & Optimization**
    -   [ ] Recommendation Engine (AI/ML)
    -   [ ] Performance Tuning (CDN, Caching)
    -   [ ] Mobile App (React Native)

---

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all unit tests
bun run test

# Run integration tests
bun run test:integration

# Check test coverage
bun run test:coverage
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Developed by Jernish** | Phase 1 Complete | Feb 2026
