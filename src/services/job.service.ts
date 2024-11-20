import Job from '../types/job.type';
import FileService from './file.service';
import BackgroundService from './background.service';
import 'express-async-errors';

class JobService {
  static async getAllJobs(): Promise<Job[]> {
    const jobs: Job[] = await FileService.read();
    return jobs;
  }

  static async getJobById(id: string): Promise<Job | null> {
    const jobs: Job[] = await FileService.read();
    return jobs.find((job) => job.id === id) || null;
  }

  static async createJob(job: Job): Promise<void> {
    const jobs: Job[] = await FileService.read();
    job.resolutionTime = Date.now() + this.getRandomDelay(); // simulate async job
    jobs.push(job);
    await FileService.save(jobs);
    BackgroundService.addJob(job);
  }

  static getRandomDelay() {
    const maxDelayMs = 5 * 60 * 1000; // 5 mins
    const minDelayMs = 5 * 1000; // 5 sec
    const stepSize = 5 * 1000; // 5 sec
    const randomSteps = Math.floor(
      Math.random() * ((maxDelayMs - minDelayMs) / stepSize + 1)
    ); // steps to maxDelayMs
    return 1000; // TODO: remove this line
    return minDelayMs + randomSteps * stepSize;
  }
}

export default JobService;
