import * as React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth';

interface IProps {
  loading: boolean;
}

const SimpleLayout: React.FC<IProps> = ({ children, loading }) => {
  const Loading = () => (
    <div className="d-flex justify-content-center align-items-center h-100">
      <strong>Loading...</strong>
    </div>
  );

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="mb-4 rounded-3">
        <div className="container">{loading ? <Loading /> : children}</div>
      </div>
    </div>
  );
};

export function withSimpleLayout<T>(
  Component: React.ComponentType<T>,
  needsAuth: boolean = false
) {
  if (needsAuth) {
    return (hocProps: T) => {
      const { isLoading, isLoggedIn } = useAuth();
      const { replace } = useRouter();

      if (!isLoading && !isLoggedIn) {
        replace('/auth/login');
        return null;
      }

      return (
        <SimpleLayout loading={isLoading && !isLoggedIn}>
          <Component {...hocProps} />
        </SimpleLayout>
      );
    };
  }
  return (hocProps: T) => {
    return (
      <SimpleLayout loading={false}>
        <Component {...hocProps} />
      </SimpleLayout>
    );
  };
}
