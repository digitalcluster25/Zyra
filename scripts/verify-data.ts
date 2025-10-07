import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  try {
    console.log('🔍 Verifying database data...\n');

    // Fetch user with projects and tasks
    const users = await prisma.user.findMany({
      include: {
        projects: {
          include: {
            project: true,
          },
        },
        tasks: true,
        activities: true,
      },
    });

    console.log('👥 Users:');
    users.forEach((user) => {
      console.log(`  - ${user.name} (${user.email})`);
      console.log(`    Projects: ${user.projects.length}`);
      console.log(`    Tasks: ${user.tasks.length}`);
      console.log(`    Activities: ${user.activities.length}`);
    });

    // Fetch projects with members and tasks
    const projects = await prisma.project.findMany({
      include: {
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
      },
    });

    console.log('\n📁 Projects:');
    projects.forEach((project) => {
      console.log(`  - ${project.name}`);
      console.log(`    Description: ${project.description}`);
      console.log(`    Members: ${project.members.length}`);
      console.log(`    Tasks: ${project.tasks.length}`);
    });

    // Fetch tasks with details
    const tasks = await prisma.task.findMany({
      include: {
        assignee: true,
        project: true,
      },
    });

    console.log('\n📋 Tasks:');
    tasks.forEach((task) => {
      console.log(`  - ${task.title}`);
      console.log(`    Status: ${task.status} | Priority: ${task.priority}`);
      console.log(`    Assigned to: ${task.assignee?.name || 'Unassigned'}`);
      console.log(`    Project: ${task.project.name}`);
    });

    console.log('\n✅ All data verified successfully!');
    console.log('\n🎯 Database is working correctly!');
    console.log('   - SQLite database: prisma/dev.db');
    console.log('   - Prisma Studio: http://localhost:5555');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyData();
