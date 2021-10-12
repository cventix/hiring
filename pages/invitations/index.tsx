import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from 'react-bootstrap';
import { WorkspaceContext } from '../../contexts/workspace-context';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import {
  addInvitationNote,
  getInvitations,
  IInvitation,
  sendInvitationManually,
} from '../../services/invitations';
import { useAuth } from '../../hooks/useAuth';
import moment from 'moment';

interface IJobInvitations {
  [key: string]: IInvitation[];
}

const InvitationsPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] =
    useState<IInvitation | null>(null);
  const [invitations, setInvitations] = useState<IJobInvitations>({});
  const { workspace } = useContext(WorkspaceContext);

  const fetchInvitationsList = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const list = await getInvitations([`workspace=${workspace}`]);

      const invitations = list.documents.reduce(
        (state: IJobInvitations, current: IInvitation) => {
          if (!current.job) {
            return state;
          }
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

  const handleAddNote = async (invitation: IInvitation) => {
    setSelectedInvitation(invitation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedInvitation(null);
    setShowModal(false);
  };

  const handleResendInvitation = async (invitation: IInvitation) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      await sendInvitationManually(invitation);
      toast.success('Invitation sent successfully', { id: toastId });
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

        {Object.keys(invitations).length ? (
          Object.keys(invitations).map((key) => (
            <div className="mb-5" key={key}>
              <h3>{key}</h3>
              <table className="table mt-5">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Mobile</th>
                    <th scope="col">Submitted</th>
                    <th scope="col">Actions</th>
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
                      <td style={{ minWidth: 180 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAddNote(invitation)}
                        >
                          Add Note
                        </button>
                        <button
                          className="btn btn-warning btn-sm mx-1"
                          onClick={() => handleResendInvitation(invitation)}
                        >
                          Re-Send
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
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
            <div>There is no invitation</div>
          </div>
        )}
      </div>
      <AddNoteModal
        show={showModal}
        handleClose={() => handleCloseModal()}
        invitation={selectedInvitation}
        cb={fetchInvitationsList}
      />
    </div>
  );
};

type AddNoteModalProps = {
  show: boolean;
  handleClose: Function;
  invitation: IInvitation | null;
  cb?: Function;
};

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  show,
  handleClose,
  invitation,
  cb,
}) => {
  const [noteText, setNoteText] = useState('');
  const { account } = useAuth();

  const handleAddInvitationNote = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      if (invitation && account) {
        await addInvitationNote(invitation, noteText, account);
        handleClose();
        if (cb) cb();
      }
      toast.success('Note Added Successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{invitation?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ maxHeight: 400, overflowY: 'scroll' }}>
          {invitation?.notes?.map((note) => (
            <div
              className="card p-2 my-2"
              style={{ backgroundColor: '#fffad1' }}
            >
              <div className="card-body">
                <h5 className="card-title d-flex justify-content-between align-items-center">
                  <span>{note.user && JSON.parse(note.user)?.name} Said:</span>
                  {note.createdAt && (
                    <span className="text-muted" style={{ fontSize: 12 }}>
                      {moment(note.createdAt).format('YYYY-MM-DD / HH:mm')}
                    </span>
                  )}
                </h5>
                <p className="card-text">{note.text}</p>
              </div>
            </div>
          ))}
        </div>
        <hr />
        <textarea
          className="form-control"
          rows={5}
          value={noteText}
          placeholder="Add Note..."
          onChange={(e) => setNoteText(e.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={() => handleClose()}>
          Close
        </button>
        <button
          className="btn btn-primary"
          onClick={() => handleAddInvitationNote()}
        >
          Add Note
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default withDashboardLayout(InvitationsPage);
