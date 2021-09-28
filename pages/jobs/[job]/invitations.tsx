import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { WorkspaceContext } from '../../../contexts/workspace-context';
import { withDashboardLayout } from '../../../layouts/dashboard-layout';
import { getInvitations, IInvitation } from '../../../services/invitations';
import { AddNoteModal } from '../../invitations';

const JobInvitationsPage: React.FC = () => {
  const { push, query } = useRouter();
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] =
    useState<IInvitation | null>(null);
  const { workspace } = useContext(WorkspaceContext);

  async function fetchJob(jobId: string) {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const list = await getInvitations([
        `workspace=${workspace}`,
        `job.$id=${jobId}`,
      ]);
      setInvitations(list.documents);
      toast.success('Invitations Loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  }

  const handleAddNote = async (invitation: IInvitation) => {
    setSelectedInvitation(invitation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedInvitation(null);
    setShowModal(false);
  };

  useEffect(() => {
    if (query.job && typeof query.job === 'string') fetchJob(query.job);
  }, [query]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Invitations</h1>
        <p className="col-md-8 fs-4">
          Here, you can see list of the invitations.
        </p>

        <hr />

        <table className="table mt-5">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Mobile</th>
              <th scope="col">Submitted At</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation, index: number) => (
              <tr key={invitation.$id}>
                <th scope="row">{index + 1}</th>
                <td>{invitation.name}</td>
                <td>{invitation.email}</td>
                <td>{invitation.mobile}</td>
                <td>{invitation.submittedAt}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddNote(invitation)}
                  >
                    Add Note
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddNoteModal
        show={showModal}
        handleClose={() => handleCloseModal()}
        invitation={selectedInvitation}
      />
    </div>
  );
};

export default withDashboardLayout(JobInvitationsPage);
