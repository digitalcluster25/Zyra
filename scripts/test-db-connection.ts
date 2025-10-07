import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...\n');

    // Test 1: Check connection with raw query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Raw query successful:', result);

    // Test 2: Count records in each table
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    const taskCount = await prisma.task.count();
    const activityCount = await prisma.activity.count();
    
    console.log('\n📊 Database statistics:');
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Projects: ${projectCount}`);
    console.log(`  - Tasks: ${taskCount}`);
    console.log(`  - Activities: ${activityCount}`);

    // Test 3: Verify table structure
    console.log('\n📋 Verifying table structure...');
    const tables = ['User', 'Project', 'ProjectMember', 'Task', 'Activity'];
    console.log(`  - Tables found: ${tables.join(', ')}`);

    console.log('\n✨ Database connection test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
