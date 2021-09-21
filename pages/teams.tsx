import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withDashboardLayout } from '../layouts/dashboard-layout';
import { verifyMembership } from '../services/teams';

const TeamsPage: React.FC = () => {
  const { query } = useRouter();
  const { teamId, membershipId, userId, secret } = query;

  const validate = async () => {
    if (teamId && membershipId && userId && secret) {
      if (
        typeof teamId === 'string' &&
        typeof membershipId === 'string' &&
        typeof userId === 'string' &&
        typeof secret === 'string'
      ) {
        await verifyMembership(teamId, membershipId, userId, secret);
      }
    }
  };

  useEffect(() => {
    validate();
  }, [teamId, membershipId, userId, secret]);

  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Teams</h1>
        <p className="col-md-8 fs-4">
          Using a series of utilities, you can create this jumbotron, just like the one in previous
          versions of Bootstrap. Check out the examples below for how you can remix and restyle it
          to your liking.
        </p>
        <button className="btn btn-primary btn-lg" type="button">
          Example button
        </button>
      </div>
    </div>
  );
};

export default TeamsPage;
