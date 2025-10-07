# Database Scripts

This directory contains utility scripts for testing and managing the database.

## Available Scripts

### Test Database Connection
```bash
npm run db:test
```
Tests the database connection and displays basic statistics.

### Seed Test Data
```bash
npm run db:seed
```
Creates sample data in the database:
- 1 test user
- 1 test project
- 3 test tasks
- 1 activity log

### Verify Data
```bash
npm run db:verify
```
Reads and displays all data from the database to verify everything is working correctly.

## Files

- `test-db-connection.ts` - Tests basic database connectivity
- `seed-test-data.ts` - Seeds the database with test data
- `verify-data.ts` - Verifies and displays database contents

## Usage Example

```bash
# 1. Test connection
npm run db:test

# 2. Seed data
npm run db:seed

# 3. Verify data was created
npm run db:verify

# 4. View in Prisma Studio
npm run db:studio
```

## Notes

- All scripts use the DATABASE_URL from `.env`
- Scripts automatically disconnect from the database when complete
- Safe to run multiple times (may create duplicate data)
