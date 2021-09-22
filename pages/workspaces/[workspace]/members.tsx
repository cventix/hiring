import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { withDashboardLayout } from '../../../layouts/dashboard-layout';
import {
  createTeamMembership,
  createTeamMembershipServer,
  getTeamMembers,
  IMembership,
} from '../../../services/teams';

const WorkspaceMembersPage: React.FC = () => {
  const { query } = useRouter();
  const { workspace } = query;
  const [email, setEmail] = useState<string>('');
  const [memberships, setMemberships] = useState<IMembership[]>([]);

  const fetchMemberships = async (teamId: string) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const { memberships } = await getTeamMembers(teamId);
      setMemberships(memberships);
      toast.success('Memberships Loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  const handleAddMembership = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      if (workspace && typeof workspace === 'string') {
        await createTeamMembershipServer(workspace, email);
        await fetchMemberships(workspace);
        toast.success('Membership added successfully', { id: toastId });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  useEffect(() => {
    if (workspace && typeof workspace === 'string') fetchMemberships(workspace);
  }, [workspace]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Workspace Memberships</h1>
        <div className="d-flex justify-content-between">
          <p className="col-md-8 fs-4">
            Here, you can see list of your workspace memberships.
          </p>
        </div>
        <hr />

        <div className="card p-4 w-100">
          <div className="input-group">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleAddMembership}
            >
              Invite Membership
            </button>
          </div>
        </div>

        <table className="table mt-5">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Verified</th>
              <th scope="col">Joined</th>
              <th scope="col">Roles</th>
            </tr>
          </thead>
          <tbody>
            {memberships.map((membership, index: number) => (
              <tr key={membership.$id}>
                <th scope="row">{index + 1}</th>
                <td>{membership.name}</td>
                <td>{membership.email}</td>
                <td>{membership.confirm ? 'Verified' : 'Not-Verified'}</td>
                <td>{moment(membership.joined * 1000).format('YYYY-MM-DD')}</td>
                <td>
                  {membership.roles.map((role) => (
                    <span
                      key={role}
                      className={`badge ${
                        role === 'owner' ? 'bg-primary' : 'bg-warning'
                      }`}
                    >
                      {role}
                    </span>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withDashboardLayout(WorkspaceMembersPage);
