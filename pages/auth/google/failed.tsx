import Link from 'next/link';

const GoogleFailedPage: React.FC = () => {
  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="mb-8 rounded-3">
        <div className="container-fluid">
          <h1 className="display-5 fw-bold mt-10">Authenticated Failed</h1>
          <hr />
          <p className="col-md-12 fs-4">Sorry, An unexpected error occurred!</p>
          <Link href="/dashboard">
            <a className="btn btn-primary btn-lg">Go to Dashboard</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GoogleFailedPage;
