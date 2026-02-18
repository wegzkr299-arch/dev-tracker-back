const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');

const redisOptions = {
  host: '127.0.0.1', 
  port: 6379,
  maxRetriesPerRequest: null, 
};

const connection = new Redis(redisOptions);

const autoCompleteQueue = new Queue('autoCompleteQueue', { connection });

const worker = new Worker('autoCompleteQueue', async (job) => {
  const { developerId, projectId, taskId } = job.data;
  console.log(`[Queue] Timer expired for Task: ${taskId}. Auto-completing...`);

  try {
    const { completeTaskService } = require('../modules/auth/services/task.service');
    await completeTaskService(developerId, projectId, taskId, "AUTO");
  } catch (error) {
    console.error(`[Queue Error] Failed to auto-complete ${taskId}:`, error.message);
  }
}, { connection });

worker.on('error', err => console.error('Worker Error:', err));

module.exports = { autoCompleteQueue };