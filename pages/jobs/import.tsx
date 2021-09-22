import { useState } from 'react';
import toast from 'react-hot-toast';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { uploadFile } from '../../services/file';
import { importFromExcelFile } from '../../services/jobs';

const ImportJobPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

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
          uploadFile.name
        );
        console.log('#exec', exec);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFileChange = async (selectorFiles: FileList | null) => {
    if (selectorFiles) setFile(selectorFiles[0]);
  };

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold">Import Candidates</h1>
        <form onSubmit={handleSubmit}>
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
