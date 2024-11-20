import FileService from './file.service';
import UnsplashService from './unsplash.service';
import JobStatus from '../enums/job-status.enum';
import Job from '../types/job.type';
import { Heap } from 'heap-js';

// Note: It would be better to use a job queue system like Bull or Agenda for this kind of background processing
// but for the sake of simplicity, we are using a priority queue implemented with a binary heap

const jobComparator = (a: Job, b: Job) => {
  if (a.resolutionTime && b.resolutionTime) {
    return a.resolutionTime - b.resolutionTime;
  }
  return 0;
};

class BackgroundService {
  static jobQueue: Heap<Job> = new Heap(jobComparator);

  static addJob(job: Job) {
    this.jobQueue.push(job);
  }

  static async processJob() {
    try {
      const job = this.jobQueue.peek();

      if (!job) {
        return;
      }

      if (job.resolutionTime && job.resolutionTime > Date.now()) {
        return;
      }

      const url = await UnsplashService.getRandomFoodPhoto();

      if (!url) {
        console.log('Error fetching image');
        return;
      }
      job.result = url;
      job.status = JobStatus.RESOLVED;
      delete job.resolutionTime;

      await FileService.updateOne(job);

      this.jobQueue.pop(); // Remove the processed job

      console.log(`Job ${job.id} processed`);
    } catch (error) {
      console.error('Error processing job:', error);
    }
  }

  static async startCronJob() {
    try {
      // Load pending jobs from the file system
      const jobs = await FileService.read();
      jobs.forEach((job) => {
        if (job.status === JobStatus.PENDING) {
          this.jobQueue.push(job);
        }
      });
      setInterval(async () => {
        await this.processJob();
      }, 5000); // Check every 5 seconds
    } catch (error) {
      console.error('Error starting cron job:', error);
    }
  }
}

export default BackgroundService;
