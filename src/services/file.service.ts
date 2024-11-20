import fs from 'fs/promises';
import path from 'path';
import Job from '../types/job.type';

const filePath = path.join(__dirname, '../../data', 'jobs.json');

class FileService {
  static async save(jobs: Job[]) {
    await fs.writeFile(filePath, JSON.stringify(jobs));
  }

  static async updateOne(job: Job) {
    const jobs = await this.read();
    const index = jobs.findIndex((j) => j.id === job.id);
    if (index === -1) {
      throw new Error('Job not found');
    }
    jobs[index] = job;
    await this.save(jobs);
  }

  static async read(): Promise<Job[]> {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  }
}

export default FileService;
