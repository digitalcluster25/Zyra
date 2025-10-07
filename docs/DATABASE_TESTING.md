# Database Testing Guide

This document describes how to test the Prisma database connection.

## Quick Test

Run all tests in sequence:

```bash
# 1. Test connection
npm run db:test

# 2. Seed test data
npm run db:seed

# 3. Verify data
npm run db:verify

# 4. Open Prisma Studio
npm run db:studio
```

## Test Results

### ✅ Connection Test
- Raw SQL queries work
- All tables are accessible
- Prisma Client connects successfully

### ✅ Data Operations
Successfully tested:
- CREATE: Users, Projects, Tasks, Activities
- READ: All models with relations
- Relations: User ↔ Project (many-to-many), Task ↔ User, Task ↔ Project

### ✅ Prisma Studio
- Accessible at http://localhost:5555
- Shows all tables and data
- Allows visual data inspection

## Database Schema

### Tables Created
1. **User** - User accounts
2. **Project** - Projects
3. **ProjectMember** - User-Project relationships
4. **Task** - Tasks with assignments
5. **Activity** - Activity logs

### Test Data
- 1 User: "Test User" (test@example.com)
- 1 Project: "Test Project"
- 3 Tasks: done, in_progress, todo
- 1 Activity log

## Verification Checklist

- [x] Database file exists (`prisma/dev.db`)
- [x] Migrations applied successfully
- [x] `prisma db push` works
- [x] `prisma generate` creates client
- [x] Raw queries execute
- [x] CRUD operations work
- [x] Relations work correctly
- [x] Prisma Studio opens and displays data

## Troubleshooting

### Connection Issues
```bash
# Check DATABASE_URL
cat .env | grep DATABASE_URL

# Regenerate Prisma Client
npm run db:generate

# Reset database (⚠️ destructive)
npx prisma migrate reset
```

### Studio Not Opening
```bash
# Kill existing process
pkill -f "prisma studio"

# Restart
npm run db:studio
```

## Next Steps

1. ✅ Local SQLite working
2. Ready for Railway PostgreSQL deployment
3. Switch `provider` to `postgresql` in production
4. Run migrations on Railway: `railway run npx prisma migrate deploy`
