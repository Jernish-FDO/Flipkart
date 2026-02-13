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

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- PostgreSQL 15+ (via Docker)
- Redis 7+ (via Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flipkart-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start Docker services**
   ```bash
   npm run docker:up
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. **Start development servers**
   ```bash
   npm run dev
   ```

### Available Services

- **Customer Web**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **API**: http://localhost:4000
- **API Docs**: http://localhost:4000/api
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Prisma Studio**: `npm run db:studio`

## 📝 Development Commands

```bash
# Development
npm run dev              # Start all apps in dev mode
npm run build            # Build all apps
npm run lint             # Lint all code
npm run format           # Format code with Prettier
npm run type-check       # TypeScript type checking
npm run test             # Run all tests
npm run test:coverage    # Run tests with coverage

# Database
npm run db:migrate       # Run Prisma migrations
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio

# Docker
npm run docker:up        # Start Docker services
npm run docker:down      # Stop Docker services
npm run docker:logs      # View Docker logs

# Clean
npm run clean            # Clean all build artifacts
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific workspace tests
npm run test --filter=@repo/api
```

## 📦 Workspace Packages

### Apps

- **web**: Customer-facing Next.js application
- **admin**: Admin dashboard Next.js application
- **api**: NestJS backend API

### Packages

- **ui**: Shared React components (shadcn/ui)
- **database**: Prisma schema and client
- **types**: Shared TypeScript types
- **config**: Shared configuration (ESLint, TypeScript, etc.)
- **utils**: Shared utility functions

## 🔒 Environment Variables

See `.env.example` for all required environment variables.

**Critical variables**:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT tokens
- `STRIPE_SECRET_KEY`: Stripe API secret key

## 🐳 Docker

The project includes Docker Compose configuration for local development:

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up -d --build
```

## 🚢 Deployment

Deployment guides for various platforms:

- **Vercel**: For Next.js apps (web, admin)
- **Railway/Render**: For NestJS API
- **AWS/GCP/Azure**: For production infrastructure

See `docs/deployment/` for detailed guides.

## 📚 Documentation

- [Architecture Overview](docs/architecture/README.md)
- [API Documentation](http://localhost:4000/api) (when running)
- [Database Schema](docs/database/schema.md)
- [Deployment Guide](docs/deployment/README.md)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Ensure all checks pass (`npm run lint`, `npm run type-check`, `npm run test`)
5. Submit a pull request

## 📄 License

MIT

## 🙏 Acknowledgments

Built with modern technologies and best practices for enterprise e-commerce.

---

**Status**: Phase 1 - MVP Development In Progress
**Version**: 0.1.0
