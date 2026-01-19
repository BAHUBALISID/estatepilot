import { Queue, Worker, Job } from 'bullmq';
import { redis } from '../../config/redis';
import { logger } from '../../config/logger';
import { FollowupsService } from './followups.service';

const FOLLOWUP_QUEUE_NAME = 'followups';

export const followupQueue = new Queue(FOLLOWUP_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: 100,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    }
  }
});

export const startFollowupScheduler = () => {
  const worker = new Worker(
    FOLLOWUP_QUEUE_NAME,
    async (job: Job) => {
      const { followupId } = job.data;
      const followupsService = new FollowupsService();
      
      logger.info(`Processing followup ${followupId}`);
      
      const processed = await followupsService.processFollowup(followupId);
      
      if (processed) {
        logger.info(`Successfully processed followup ${followupId}`);
      } else {
        logger.warn(`Failed to process followup ${followupId}`);
      }
      
      return { success: processed };
    },
    { connection: redis }
  );
  
  worker.on('completed', (job: Job) => {
    logger.debug(`Followup job ${job.id} completed`);
  });
  
  worker.on('failed', (job: Job | undefined, error: Error) => {
    logger.error(`Followup job ${job?.id} failed:`, error);
  });
  
  // Schedule periodic check for pending followups
  setInterval(async () => {
    try {
      const followupsService = new FollowupsService();
      const pendingFollowups = await followupsService.getPendingFollowups();
      
      for (const followup of pendingFollowups) {
        await followupQueue.add(
          'process-followup',
          { followupId: followup._id.toString() },
          { jobId: `followup-${followup._id}` }
        );
      }
      
      if (pendingFollowups.length > 0) {
        logger.info(`Scheduled ${pendingFollowups.length} followup jobs`);
      }
    } catch (error) {
      logger.error('Error scheduling followups:', error);
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
  
  logger.info('Followup scheduler started');
  
  return { worker, queue: followupQueue };
};
