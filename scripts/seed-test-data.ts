import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    console.log('🌱 Seeding test data...\n');

    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        avatar: 'https://i.pravatar.cc/150?img=1',
      },
    });
    console.log('✅ Created user:', user.name);

    // Create test project
    const project = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'A test project for Zyra',
        members: {
          create: {
            userId: user.id,
            role: 'owner',
          },
        },
      },
    });
    console.log('✅ Created project:', project.name);

    // Create test tasks
    const task1 = await prisma.task.create({
      data: {
        title: 'Setup development environment',
        description: 'Install dependencies and configure the project',
        status: 'done',
        priority: 'high',
        projectId: project.id,
        assigneeId: user.id,
      },
    });

    const task2 = await prisma.task.create({
      data: {
        title: 'Create dashboard UI',
        description: 'Design and implement the main dashboard',
        status: 'in_progress',
        priority: 'medium',
        projectId: project.id,
        assigneeId: user.id,
      },
    });

    const task3 = await prisma.task.create({
      data: {
        title: 'Write documentation',
        description: 'Document all features and APIs',
        status: 'todo',
        priority: 'low',
        projectId: project.id,
      },
    });

    console.log(`✅ Created ${3} tasks`);

    // Create activity log
    const activity = await prisma.activity.create({
      data: {
        action: 'project_created',
        description: `Created project "${project.name}"`,
        userId: user.id,
      },
    });
    console.log('✅ Created activity log');

    // Verify data
    console.log('\n📊 Final statistics:');
    const counts = {
      users: await prisma.user.count(),
      projects: await prisma.project.count(),
      tasks: await prisma.task.count(),
      activities: await prisma.activity.count(),
    };
    console.log(`  - Users: ${counts.users}`);
    console.log(`  - Projects: ${counts.projects}`);
    console.log(`  - Tasks: ${counts.tasks}`);
    console.log(`  - Activities: ${counts.activities}`);

    console.log('\n✨ Test data seeded successfully!');
    console.log('\n💡 Open Prisma Studio to view the data:');
    console.log('   npx prisma studio');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();
