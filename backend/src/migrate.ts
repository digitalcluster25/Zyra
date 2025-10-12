import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { pool, closePool } from './config/database';

async function runMigrations() {
  try {
    console.log('🚀 Starting database migrations...\n');

    const migrationsPath = join(__dirname, '../migrations');
    const files = readdirSync(migrationsPath)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      console.log(`  Executing: ${file}`);
      const sql = readFileSync(join(migrationsPath, file), 'utf8');
      await pool.query(sql);
      console.log(`  ✅ ${file} completed\n`);
    }

    console.log('✅ All migrations completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await closePool();
  }
}

runMigrations();

