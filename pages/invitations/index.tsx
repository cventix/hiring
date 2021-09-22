import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WorkspaceContext } from '../../contexts/workspace-context';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { getInvitations, IInvitation } from '../../services/invitations';

interface IJobInvitations {
  [key: string]: IInvitation[];
}

const InvitationsPage: React.FC = () => {
  const [invitations, setInvitations] = useState<IJobInvitations>({});
  const { workspace } = useContext(WorkspaceContext);

  const fetchInvitationsList = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const list = await getInvitations([`workspace=${workspace}`]);

      const invitations = list.documents.reduce(
        (state: IJobInvitations, current: IInvitation) => {
          if (!state[current.job.title]) state[current.job.title] = [];
          state[current.job.title].push(current);
          return state;
        },
        {}
      );
      setInvitations(invitations);
      toast.success('Invitations Loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  useEffect(() => {
    if (workspace) fetchInvitationsList();
  }, [workspace]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Invitations</h1>
        <div className="d-flex justify-content-between">
          <p className="col-md-8 fs-4">
            Here, you can see list of your invitations.
          </p>
        </div>
        <hr />

        {Object.keys(invitations).map((key) => (
          <div className="mb-5" key={key}>
            <h3>{key}</h3>
            <table className="table mt-5">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {invitations[key].map((invitation, index: number) => (
                  <tr key={invitation.$id}>
                    <th scope="row">{index + 1}</th>
                    <td>{invitation.name}</td>
                    <td>{invitation.email}</td>
                    <td>{invitation.mobile}</td>
                    <td>{invitation.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default withDashboardLayout(InvitationsPage);
