# Docker Configuration

This directory contains Docker-related configuration files for the FlipKart Clone platform.

## Services

### PostgreSQL (`postgres/`)
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Database**: flipkart_dev
- **Extensions**: uuid-ossp, pgcrypto
- **Schemas**: base, shop

### Redis (`redis/`)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Persistence**: AOF enabled

## Usage

### Start all services:
```bash
docker-compose up -d
```

### Stop all services:
```bash
docker-compose down
```

### View logs:
```bash
docker-compose logs -f
```

### Check service health:
```bash
docker-compose ps
```

### Access PostgreSQL:
```bash
docker exec -it flipkart-postgres psql -U postgres -d flipkart_dev
```

### Access Redis CLI:
```bash
docker exec -it flipkart-redis redis-cli
```

## Volumes

Data is persisted in Docker volumes:
- `postgres_data`: PostgreSQL database files
- `redis_data`: Redis persistence files

To remove volumes (⚠️ **destroys data**):
```bash
docker-compose down -v
```

## Network

All services communicate via the `flipkart-network` bridge network.

## Health Checks

Both PostgreSQL and Redis have health checks configured:
- PostgreSQL: `pg_isready` check every 10s
- Redis: `redis-cli ping` check every 10s

Services will be marked as healthy when checks pass.
