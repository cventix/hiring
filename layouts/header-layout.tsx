import Link from 'next/link';
import { useRouter } from 'next/router';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: '/dashboard.svg',
    iconW: '/dashboard-w.svg',
  },
  // { title: 'Teams', href: '/teams', icon: '/teams.svg', iconW: '/teams-w.svg' },
  { title: 'Jobs', href: '/jobs', icon: '/jobs.svg', iconW: '/jobs-w.svg' },
  {
    title: 'Meetings',
    href: '/meetings',
    icon: '/meetings.svg',
    iconW: '/meetings-w.svg',
  },
  {
    title: 'Invitations',
    href: '/invitations',
    icon: '/invitations.svg',
    iconW: '/invitations-w.svg',
  },
  {
    title: 'Workspaces',
    href: '/workspaces',
    icon: '/workspaces.svg',
    iconW: '/workspaces-w.svg',
  },
];

const HeaderLayout = () => {
  const { route } = useRouter();
  return (
    <header>
      <div className="px-3 py-2 bg-dark text-white">
        <div className="container">
          <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
            <a
              href="/"
              className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none"
            >
              <h1 className="me-2">IranToptal Hiring</h1>
              <span className="text-small text-muted">v1.0</span>
            </a>

            <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
              {menuItems.map((menuItem) => (
                <li key={menuItem.href}>
                  <Link href={menuItem.href}>
                    <a className="nav-link text-white">
                      <img
                        src={menuItem.iconW}
                        alt={menuItem.title}
                        className="bi d-block mx-auto mb-1"
                        width="24"
                        height="24"
                      />
                      {route.includes(menuItem.href) ? (
                        <strong>{menuItem.title}</strong>
                      ) : (
                        menuItem.title
                      )}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="px-3 py-2 border-bottom mb-3">
        <div className="container d-flex flex-wrap justify-content-end">
          <div className="text-end">
            <button
              type="button"
              className="btn btn-light text-dark me-2 d-flex align-items-center"
            >
              <img src="/profile.svg" alt="user profile" />
              <strong className="mx-2">Profile</strong>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
