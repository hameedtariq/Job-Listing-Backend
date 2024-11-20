import JobStatus from '../enums/job-status.enum';

type Job = {
  id: string;
  status: JobStatus;
  result?: string;
  executionTime?: number;
};

export default Job;
