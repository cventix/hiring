import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WorkspaceContext } from '../../contexts/workspace-context';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { uploadFile } from '../../services/file';
import { getJobsList, IJob, importFromExcelFile } from '../../services/jobs';

const ImportJobPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const { workspace } = useContext(WorkspaceContext);

  const getJobs = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const { documents, sum } = await getJobsList([`workspace=${workspace}`]);
      setJobs(documents);
      toast.success('Jobs loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      try {
        toast.promise(uploadFile(file), {
          success: 'Uploaded successfully',
          loading: 'Uploading in progress...',
          error: 'Error uploading file',
        });
        const uploadedFile = await uploadFile(file);
        console.log('#file', uploadedFile);
        const exec = await importFromExcelFile(
          uploadedFile.$id,
          uploadedFile.name,
          jobId
        );
        console.log('#exec', exec);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setJobId(value);
  };

  const handleFileChange = async (selectorFiles: FileList | null) => {
    if (selectorFiles) setFile(selectorFiles[0]);
  };

  useEffect(() => {
    if (workspace) getJobs();
  }, [workspace]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold">Import Candidates</h1>
        <form onSubmit={handleSubmit}>
          <div className="col-sm-6 mb-2">
            <label htmlFor="jobId" className="form-label">
              Select Existing Job
            </label>
            <select
              className="form-select"
              id="jobId"
              onChange={handleJobChange}
            >
              <option value="">Choose...</option>
              {jobs.map((job) => (
                <option key={job.$id} value={job.$id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="excelfile">Select List of candidates</label>
            <input
              type="file"
              name="file"
              id="file"
              className="form-control"
              onChange={(e) => handleFileChange(e.target.files)}
            />
            <small id="excelfile" className="text-muted">
              Please choose an excel file
            </small>
          </div>
          <div className="form-group mt-3">
            <button className="btn btn-primary btn-lg" type="submit">
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default withDashboardLayout(ImportJobPage);
