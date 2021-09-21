import { Alert } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loginAnonymously, loginUsingCredentials } from '../../services/auth';

type LoginFormType = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>();

  const onSubmit = async (data: LoginFormType) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      const { email, password } = data;
      await loginUsingCredentials(email, password);
      toast.success('Successfully Logged in', { id: toastId });
      setTimeout(() => {
        window.location.replace('/');
      }, 800);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleLoginAnonymously = async () => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');
      await loginAnonymously();
      toast.success('Successfully Logged in', { id: toastId });
      setTimeout(() => {
        window.location.replace('/');
      }, 800);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.email && (
        <Alert variant="danger">
          <span className="text-red-600 text-sm">{errors.email.message}</span>
        </Alert>
      )}

      {errors.password && (
        <Alert variant="danger">
          <span className="text-red-600 text-sm">{errors.password.message}</span>
        </Alert>
      )}

      <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

      <div className="form-floating">
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="name@example.com"
          {...register('email', {
            required: { value: true, message: 'Email is required' },
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: 'Enter a valid e-mail address',
            },
          })}
        />
        <label htmlFor="email">Email address</label>
      </div>
      <div className="form-floating">
        <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          {...register('password', {
            required: { value: true, message: 'Password is required' },
            minLength: { value: 6, message: 'Password should be at least 6 characters' },
          })}
        />
        <label htmlFor="password">Password</label>
      </div>
      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Sign in
      </button>
      <button className="w-100 btn btn-lg btn-link" type="button" onClick={handleLoginAnonymously}>
        Login Anonymously
      </button>
    </form>
  );
};

export default LoginForm;
