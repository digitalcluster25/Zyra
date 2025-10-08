import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';


const connection = new IORedis(process.env.REDIS_URL || '');
export const stravaSyncQueue = new Queue('strava-sync', { connection });
new QueueEvents('strava-sync', { connection });

export const addStravaSyncJob = (userId: string) => {
  return stravaSyncQueue.add('sync', { userId });
};

new Worker('strava-sync', async job => {
  // TODO: Реализовать синхронизацию с Strava для userId
  const { userId } = job.data;
  console.log(`Sync Strava for user ${userId}`);
  // ...
}, { connection });
