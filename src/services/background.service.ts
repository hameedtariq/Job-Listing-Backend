import FileService from './file.service';
import UnsplashService from './unsplash.service';
import JobStatus from '../enums/job-status.enum';
import Job from '../types/job.type';
import { Heap } from 'heap-js';

// Note: It would be better to use a job queue system like Bull or Agenda for this kind of background processing
// but for the sake of simplicity, we are using a cron job here
// Also, this implementation is not efficient as it reads the jobs from the file system on every cron job run
// A better approach would be to use a database to store the jobs and update their status

const jobComparator = (a: Job, b: Job) => {
  if (a.executionTime && b.executionTime) {
    return a.executionTime - b.executionTime;
  }
  return 0;
};

class BackgroundService {
  static jobQueue: Heap<Job> = new Heap(jobComparator);

  static addJob(job: Job) {
    this.jobQueue.push(job);
  }

  static async processJob() {
    const job = this.jobQueue.peek();

    if (!job) {
      return;
    }

    if (job.executionTime && job.executionTime > Date.now()) {
      return;
    }

    const url = await UnsplashService.getRandomFoodPhoto();

    if (!url) {
      console.log('Error fetching image');
      return;
    }
    job.result = url;
    job.status = JobStatus.RESOLVED;

    await FileService.updateOne(job);

    this.jobQueue.pop(); // Remove the processed job

    console.log(`Job ${job.id} processed`);
  }

  static async startCronJob() {
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
  }
}

export default BackgroundService;
