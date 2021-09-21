import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';
import { IAccount } from '../services/auth';
import SidebarLayout from './sidebar-layout';
import HeaderLayout from './header-layout';

interface IProps {
  account: IAccount | null;
  loading: boolean;
}

const DashboardLayout: React.FC<IProps> = ({ children, account, loading }) => {
  const Loading = () => (
    <div className="d-flex justify-content-center align-items-center h-100">
      <strong>Loading...</strong>
    </div>
  );

  return (
    <>
      <HeaderLayout />
      <div className="container py-5">
        <main>
          <div className="row g-5">
            <SidebarLayout account={account} />
            <div className="col-9">{loading ? <Loading /> : children}</div>
          </div>
        </main>
      </div>
    </>
  );
};

export function withDashboardLayout<T>(Component: React.ComponentType<T>) {
  return (hocProps: T) => {
    const { isLoading, isLoggedIn, account } = useAuth();
    const { replace } = useRouter();

    if (!isLoading && !isLoggedIn) replace('/auth/login');

    return (
      <DashboardLayout account={account} loading={isLoading && !isLoggedIn}>
        <Component {...hocProps} />
      </DashboardLayout>
    );
  };
}
