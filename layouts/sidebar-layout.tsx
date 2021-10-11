import Link from 'next/link';
import { IAccount, logout, updateUserPrefs } from '../services/auth';
import { ITeam } from '../services/teams';
import { useRouter } from 'next/router';
import { WorkspaceContext } from '../contexts/workspace-context';
import { useContext } from 'react';

interface IProps {
  account: IAccount | null;
  teams: ITeam[] | undefined;
}

interface ISidebarItem {
  title: string;
  href: string;
  icon: string;
  iconW?: string;
}

const menuItems = {
  dashboard: [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: '/dashboard.svg',
      iconW: '/dashboard-w.svg',
    },
  ],
  jobs: [
    {
      title: 'Jobs List',
      href: '/jobs',
      icon: '/jobs.svg',
      iconW: '/jobs-w.svg',
    },
    {
      title: 'Import from jobinja',
      href: '/jobs/import',
      icon: '/jobs.svg',
      iconW: '/jobs-w.svg',
    },
  ],
  teams: [
    {
      title: 'Teams',
      href: '/teams',
      icon: '/teams.svg',
      iconW: '/teams-w.svg',
    },
  ],
  meetings: [
    {
      title: 'Upcomming Meetings',
      href: '/meetings/upcomming',
      icon: '/meetings.svg',
      iconW: '/meetings-w.svg',
    },
    {
      title: 'Job Meetings List',
      href: '/meetings',
      icon: '/meetings.svg',
      iconW: '/meetings-w.svg',
    },
    {
      title: 'Add Meetings',
      href: '/meetings/add',
      icon: '/meetings.svg',
      iconW: '/meetings-w.svg',
    },
  ],
  invitations: [
    {
      title: 'Invitations List',
      href: '/invitations',
      icon: '/invitations.svg',
      iconW: '/invitations-w.svg',
    },
  ],
  workspaces: [
    {
      title: 'Workspaces List',
      href: '/workspaces',
      icon: '/workspaces.svg',
      iconW: '/workspaces-w.svg',
    },
    {
      title: 'Add new Workspace',
      href: '/workspaces/add',
      icon: '/workspaces.svg',
      iconW: '/workspaces-w.svg',
    },
  ],
};

const SidebarLayout: React.FC<IProps> = ({ account, teams }) => {
  const { setWorkspace, workspace } = useContext(WorkspaceContext);
  const { route } = useRouter();

  const handleWorkspaceChange = async (e: any) => {
    const { value } = e.target;
    setWorkspace(value);
    await updateUserPrefs({ workspace: value });
  };

  const handleAuthWithGoogle = async () => {
    try {
      const res = await fetch('/api/auth/google');
      const { redirectUrl } = await res.json();
      window.location.replace(redirectUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const menu = () => {
    switch (route.split('/')[1]) {
      case 'dashboard':
        return menuItems['dashboard'];
      case 'jobs':
        return menuItems['jobs'];
      case 'meetings':
        return menuItems['meetings'];
      case 'teams':
        return menuItems['teams'];
      case 'invitations':
        return menuItems['invitations'];
      case 'workspaces':
        return menuItems['workspaces'];

      default:
        return [];
    }
  };

  const SidebarItem: React.FC<ISidebarItem> = ({ title, href, icon }) => {
    return (
      <li className="list-group-item d-flex justify-content-between lh-sm">
        <div
          className="d-flex align-items-center"
          style={{ cursor: 'pointer' }}
        >
          {icon && <img src={icon} alt={title} />}
          <Link href={href}>
            <h6 className="my-2 mx-2">
              {href === route ? <strong>{title}</strong> : title}
            </h6>
          </Link>
        </div>
      </li>
    );
  };

  return (
    <div className="col-3">
      {/* <h4 className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-primary">Hello, {account?.name || account?.email}</span>
      </h4> */}
      {teams && (
        <>
          <strong>Workspace:</strong>
          <div className="card p-2 mb-4 mt-1">
            <select
              className="form-control"
              value={workspace}
              onChange={handleWorkspaceChange}
            >
              {teams.map((team) => (
                <option key={team.$id} value={team.$id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <ul className="list-group mb-2">
        {menu().map((menuItem) => (
          <SidebarItem
            key={menuItem.title}
            title={menuItem.title}
            href={menuItem.href}
            icon={menuItem.icon}
          />
        ))}
        <li className="list-group-item d-flex justify-content-between">
          <div
            className="d-flex align-items-center text-danger"
            style={{ cursor: 'pointer' }}
            onClick={logout}
          >
            <img src="/logout.svg" alt="logout" />
            <h6 className="my-2 mx-2">
              <strong>Logout</strong>
            </h6>
          </div>
        </li>
      </ul>

      {account && !account.prefs.token && (
        <div className="card p-2">
          <button
            className="btn btn-outline-secondary fw-bold"
            onClick={handleAuthWithGoogle}
          >
            <img src="/google.svg" alt="google" width="25" height="25" />
            <span className="mx-2">Auth With Google</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SidebarLayout;
