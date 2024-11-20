import { Request, Response } from 'express';
import JobService from '../services/job.service';
import ApiError from '../utils/ApiError';
import Job from '../types/job.type';
import JobStatus from '../enums/job-status.enum';
import ApiResponse from '../types/api-response.type';

const getAllJobs = async (req: Request, res: Response<ApiResponse<Job[]>>) => {
  const jobs = await JobService.getAllJobs();

  const response = {
    message: 'Jobs found',
    data: jobs,
  };
  res.json(response);
};

const getJobById = async (req: Request, res: Response<ApiResponse<Job>>) => {
  const { jobId } = req.params;
  const job = await JobService.getJobById(jobId);
  if (!job) {
    throw ApiError.notFound('Job not found');
  }

  const response = {
    message: 'Job found',
    data: job,
  };

  res.json(response);
};

const createJob = async (req: Request, res: Response<ApiResponse<Job>>) => {
  const id = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
  const job: Job = {
    id,
    status: JobStatus.PENDING,
  };
  await JobService.createJob(job);

  const response = {
    message: 'Job created',
    data: job,
  };

  res.status(201).json(response);
};

export { getAllJobs, getJobById, createJob };
