# Prisma Database Schema

This directory contains the Prisma database schema and migrations.

## Database Models

- **User**: User accounts with email, name, and avatar
- **Project**: Projects with name and description
- **ProjectMember**: Many-to-many relationship between users and projects
- **Task**: Tasks assigned to projects and users
- **Activity**: Activity log for tracking user actions

## Commands

### Database Management
```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database (development)
npm run db:push

# Create and apply migrations
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio
```

### Testing & Data
```bash
# Test database connection
npm run db:test

# Seed test data
npm run db:seed

# Verify database contents
npm run db:verify
```

## Database

### Development
Using SQLite for local development (`dev.db`). Update your local `.env`:
```
DATABASE_URL="file:./dev.db"
```

### Production (Railway)
Using PostgreSQL on Railway. The DATABASE_URL is automatically provided by Railway:
```
DATABASE_URL="postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway"
```

Railway automatically sets the DATABASE_URL environment variable in production.

### Switching Databases

**Local Development (SQLite):**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL") // "file:./dev.db"
}
```

**Production on Railway (PostgreSQL):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL") // Railway provides this
}
```

**Steps to switch:**
1. Update `provider` in `schema.prisma`
2. Update `DATABASE_URL` in your environment
3. Run migrations:
   - Dev: `npx prisma migrate dev`
   - Production: `railway run npx prisma migrate deploy`

**Note:** The project is configured for SQLite in development. Railway automatically uses PostgreSQL in production with the correct DATABASE_URL.

### Railway Deployment

The project is configured for Railway deployment:
- Project: Digital Cluster 25
- Service: Postgres (PostgreSQL database)
- Environment: production
- DATABASE_URL is automatically injected by Railway
