import { withDashboardLayout } from '../layouts/dashboard-layout';

const DashboardPage: React.FC = () => {
  return (
    <div className="mb-4 rounded-3">
      <div className="container-fluid">
        <h1 className="display-5 fw-bold mt-0">Dashboard</h1>
        <p className="col-md-8 fs-4">Here, you can see the dashboard items.</p>
      </div>
    </div>
  );
};

export default withDashboardLayout(DashboardPage);
