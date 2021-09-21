const AuthLayout: React.FC = ({ children }) => {
  return (
    <div className="auth-container">
      <main className="form-signin">
        {children}
        <p className="mt-5 mb-3 text-muted">&copy; 2019-2021 Iran Toptalent</p>
      </main>
    </div>
  );
};

export default AuthLayout;
