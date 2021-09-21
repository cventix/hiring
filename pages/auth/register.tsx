import RegisterForm from '../../components/auth/register-form';
import OAuthProviders from '../../components/auth/oauth-providers';
import AuthLayout from '../../layouts/auth-layout';

const RegisterPage = () => {
  return (
    <AuthLayout>
      <OAuthProviders />
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
