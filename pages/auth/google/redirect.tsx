import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const GoogleRedirectPage: React.FC = () => {
  const { account, isLoading, isLoggedIn } = useAuth();
  const { query, replace } = useRouter();
  const { code } = query;

  const validate = async () => {
    if (code && account) {
      if (typeof code === 'string') {
        let toastId;
        try {
          toastId = toast.loading('Loading...');
          await fetch('/api/auth/google/update', {
            method: 'POST',
            body: JSON.stringify({ code, userId: account.$id }),
            headers: { 'Content-Type': 'application/json' },
          });
          toast.success('Authenticated successfully', { id: toastId });
        } catch (error: any) {
          console.error(error);
          toast.error(error.message, { id: toastId });
        }
      }
    }
  };

  useEffect(() => {
    validate();
  }, [code, account]);

  if (!isLoading && !isLoggedIn) replace('/auth/login');

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="mb-8 rounded-3">
        <div className="container-fluid">
          <h1 className="display-5 fw-bold mt-10">
            Authentication {code ? 'Successfully' : 'Failed'}
          </h1>
          <hr />
          <p className="col-md-12 fs-4">
            {code
              ? 'Thanks, you have been authenticated successfully!'
              : 'Sorry, An unexpected error occurred!'}
          </p>
          <Link href="/dashboard">
            <a className="btn btn-primary btn-lg">Go to Dashboard</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoogleRedirectPage;
