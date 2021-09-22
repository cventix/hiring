import LoginForm from '../../components/auth/login-form';
import OAuthProviders from '../../components/auth/oauth-providers';
import AuthLayout from '../../layouts/auth-layout';

const LoginPage = () => {
  return (
    <AuthLayout>
      {/* <OAuthProviders /> */}
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
