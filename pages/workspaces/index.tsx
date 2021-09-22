import moment from 'moment';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { withDashboardLayout } from '../../layouts/dashboard-layout';
import { getTeams, ITeam } from '../../services/teams';

const WorkspacesPage: React.FC = () => {
  const [teams, setTeems] = useState<ITeam[]>([]);

  const fetchTeams = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const { teams } = await getTeams();
      setTeems(teams);
      toast.success('Workspaces Loaded successfully', { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message, { id: toastId });
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

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

        <table className="table mt-5">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Date Created</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index: number) => (
              <tr key={team.$id}>
                <th scope="row">{index + 1}</th>
                <td>
                  <Link href={`/workspaces/${team.$id}/members`}>
                    <a>{team.name}</a>
                  </Link>
                </td>
                <td>{moment(team.dateCreated * 1000).format('YYYY-MM-DD')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default withDashboardLayout(WorkspacesPage);
