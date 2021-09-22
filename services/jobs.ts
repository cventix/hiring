import { appwrite } from './appwrite';
import { JOBS_COLLECTION_ID } from './constants';

export interface IJob {
  $collection: string;
  $id: string;
  $permissions: {
    write: string[];
    read: string[];
  };
  description: string;
  isEnabled: boolean;
  owner: string;
  title: string;
}

export interface IJobsList {
  sum: number;
  documents: IJob[];
}

export const importFromExcelFile = async (
  fileId: string,
  fileName: string
): Promise<unknown> => {
  return appwrite.functions.createExecution(
    '6141f74e018e8',
    JSON.stringify({ fileId, fileName })
  );
};

export const getJobsList = async (
  filters: string[] = [],
  limit: number = 25,
  offset: number = 0
): Promise<IJobsList> => {
  return appwrite.database.listDocuments(JOBS_COLLECTION_ID, filters);
};

export const getJob = async (jobId: string): Promise<IJob> => {
  return appwrite.database.getDocument(JOBS_COLLECTION_ID, jobId);
};

export const updateJobStatus = async (
  jobId: string,
  status: boolean
): Promise<IJob> => {
  return appwrite.database.updateDocument(JOBS_COLLECTION_ID, jobId, {
    isEnabled: status,
  });
};
