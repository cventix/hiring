import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { IAccount } from '../services/auth';
import SidebarLayout from './sidebar-layout';
import HeaderLayout from './header-layout';
import { useEffect } from 'react';
import { getTeams, ITeam } from '../services/teams';
import { WorkspaceContext } from '../contexts/workspace-context';
import { account } from '../services/appwrite-server';

interface IProps {
  account: IAccount | null;
  teams: ITeam[] | undefined;
  loading: boolean;
}

const DashboardLayout: React.FC<IProps> = ({
  children,
  account,
  teams,
  loading,
}) => {
  const Loading = () => (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <strong>Loading...</strong>
    </div>
  );

  if (loading) return <Loading />;

  return (
    <>
      <HeaderLayout />
      <div className="container py-5">
        <main>
          <div className="row g-5">
            <SidebarLayout account={account} teams={teams} />
            <div className="col-9">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
};

export function withDashboardLayout<T>(Component: React.ComponentType<T>) {
  return (hocProps: T) => {
    const { isLoading, isLoggedIn, account } = useAuth();
    const [teams, setTeams] = React.useState<ITeam[]>();
    const { setWorkspace } = React.useContext(WorkspaceContext);
    const { replace } = useRouter();

    // Check user teams. user must have atleast a team
    const checkTeams = async () => {
      try {
        const { sum, teams } = await getTeams();
        if (sum === 0) replace('/workspace');
        else {
          setTeams(teams);
          if (account) {
            setWorkspace(account.prefs.workspace);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      checkTeams();
    }, [account]);

    if (!isLoading && !isLoggedIn) {
      replace('/auth/login');
      return null;
    }

    return (
      <DashboardLayout
        account={account}
        teams={teams}
        loading={isLoading && !isLoggedIn}
      >
        <Component {...hocProps} />
      </DashboardLayout>
    );
  };
}
