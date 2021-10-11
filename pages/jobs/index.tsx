import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Switch from 'react-switch';
import produce from 'immer';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { getJobsList, IJob, updateJobStatus } from '../../services/jobs';
import toast from 'react-hot-toast';
import { WorkspaceContext } from '../../contexts/workspace-context';

interface IJobStatus {
  status: boolean;
  id: string;
}

const JobsPage: React.FC = () => {
  const { push } = useRouter();
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [jobStatus, setJobStatus] = useState<IJobStatus[]>([]);
  const { workspace } = useContext(WorkspaceContext);

  const fetchJobsList = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const list = await getJobsList([`workspace=${workspace}`]);
      setJobStatus(
        list.documents.map((job) => ({ id: job.$id, status: job.isEnabled }))
      );
      setJobs(list.documents);
      toast.success('Jobs Loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleChangeJobStatus = async (status: boolean, jobId: string) => {
    try {
      setJobStatus((prev) =>
        produce(prev, (draft) => {
          const index = draft.findIndex((j) => j.id === jobId);
          if (index !== -1) {
            draft[index].status = status;
          } else {
            draft.push({ id: jobId, status });
          }
        })
      );
      await updateJobStatus(jobId, status);
      await fetchJobsList();
    } catch (error: any) {
      console.error(error);
    }
  };

  const getJobStatus = (jobId: string): boolean => {
    const status = jobStatus.find((status) => status.id === jobId);
    return (status && status.status) || false;
  };

  useEffect(() => {
    if (workspace) fetchJobsList();
  }, [workspace]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Jobs</h1>
        <p className="col-md-8 fs-4">
          Here, you can see list of active jobs that are available to submit CV.
        </p>
        <button
          className="btn btn-primary btn-lg"
          type="button"
          onClick={() => push('/jobs/import')}
        >
          Import From Jobinja
        </button>

        <hr />

        <table className="table mt-5">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">Status</th>
              <th scope="col">Reserved Meetings</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job, index: number) => (
              <tr key={job.$id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <Link href={`/jobs/${job.$id}/invitations`}>{job.title}</Link>
                </td>
                <td>
                  <Switch
                    onChange={(checked) =>
                      handleChangeJobStatus(checked, job.$id)
                    }
                    checked={getJobStatus(job.$id)}
                    height={20}
                    width={38}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    offColor="#dc3545"
                  />
                </td>
                <td>
                  <Link href={`/meetings/${job.$id}/list`}>Show List</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withDashboardLayout(JobsPage);
