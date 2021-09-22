import moment from 'moment';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { WorkspaceContext } from '../../contexts/workspace-context';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { createTeam } from '../../services/teams';

const WorkspacesAddPage: React.FC = () => {
  const [team, setTeam] = useState<string>('');
  const { replace } = useRouter();

  const handleCreateWorkspace = async () => {
    if (team) {
      let toastId;
      try {
        toastId = toast.loading('Loading...');
        await createTeam(team);
        toast.success('Workspace created successfully', { id: toastId });
        setTimeout(() => {
          replace('/workspaces');
        }, 1500);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message, { id: toastId });
      }
    }
  };

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Workspaces</h1>
        <div className="d-flex justify-content-between">
          <p className="col-md-8 fs-4">
            Here, you can see list of your workspaces.
          </p>
        </div>
        <hr />

        <div className="card p-4 w-100">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Workspace name"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleCreateWorkspace}
            >
              Create Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withDashboardLayout(WorkspacesAddPage);
