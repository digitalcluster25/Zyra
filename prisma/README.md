# Prisma Database Schema

This directory contains the Prisma database schema and migrations.

## Database Models

- **User**: User accounts with email, name, and avatar
- **Project**: Projects with name and description
- **ProjectMember**: Many-to-many relationship between users and projects
- **Task**: Tasks assigned to projects and users
- **Activity**: Activity log for tracking user actions

## Commands

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

## Database

Currently using SQLite for development (`dev.db`). The database file is gitignored.

To switch to PostgreSQL or another database:
1. Update `DATABASE_URL` in `.env`
2. Change `provider` in `schema.prisma`
3. Run `npx prisma migrate dev`
