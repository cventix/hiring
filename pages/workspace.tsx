import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { WorkspaceContext } from '../contexts/workspace-context';
import { withSimpleLayout } from '../layouts/simple-layout';
import { createTeam } from '../services/teams';

const WorkspacePage: React.FC = () => {
  const [team, setTeam] = useState<string>('');
  const { setWorkspace } = useContext(WorkspaceContext);
  const { replace } = useRouter();

  const handleCreateWorkspace = async () => {
    if (team) {
      let toastId;
      try {
        toastId = toast.loading('Loading...');
        const workspace = await createTeam(team);
        setWorkspace(workspace.$id);
        toast.success('Workspace created successfully', { id: toastId });
        setTimeout(() => {
          replace('/');
        }, 1500);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message, { id: toastId });
      }
    }
  };

  return (
    <>
      <h1 className="display-5 fw-bold mt-0">Define a Workspace</h1>
      <p className="col-md-12 fs-4">
        Please create your workspace. then you can manage your hiring.
      </p>
      <div className="d-flex justify-content-start w-100">
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
    </>
  );
};

export default withSimpleLayout(WorkspacePage, true);
