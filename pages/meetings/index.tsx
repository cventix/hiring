import Link from 'next/link';
import { useEffect, useState, useContext } from 'react';
import toast from 'react-hot-toast';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { WorkspaceContext } from '../../contexts/workspace-context';
import { getJobsList, IJob } from '../../services/jobs';

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<IJob[]>([]);
  const { workspace } = useContext(WorkspaceContext);

  const fetchJobsList = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const list = await getJobsList([`workspace=${workspace}`, `isEnabled=1`]);
      setJobs(list.documents);
      toast.success('Jobs Loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  useEffect(() => {
    if (workspace) fetchJobsList();
  }, [workspace]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Job Meetings</h1>
        <div className="d-flex justify-content-between">
          <p className="col-md-8 fs-4">
            Here, you can see list of your "Active jobs". click on job title to
            see the list of meetings.
          </p>
        </div>
        <hr />

        {jobs.length ? (
          <table className="table mt-5">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job, index: number) => (
                <tr key={job.$id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <Link href={`/meetings/${job.$id}/list`}>{job.title}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div
            className="alert alert-warning d-flex align-items-center"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
              viewBox="0 0 16 16"
              role="img"
              aria-label="Warning:"
            >
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <div>There is no active job</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default withDashboardLayout(JobsPage);
