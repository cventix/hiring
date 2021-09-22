import { Alert } from 'react-bootstrap';
import { FieldError, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { loginAnonymously, loginUsingCredentials } from '../../services/auth';

type RegisterFormType = {
  registrationCode: string;
  name: string;
  email: string;
  password: string;
};

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormType>();

  const onSubmit = async (data: RegisterFormType) => {
    let toastId;
    try {
      toastId = toast.loading('Loading...');

      // Register user
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      const registeredUser = await res.json();
      if (!res.ok) throw new Error(registeredUser.error);

      // Login after registration
      await loginUsingCredentials(data.email, data.password);
      toast.success('Successfully Registered', { id: toastId });
      setTimeout(() => {
        window.location.replace('/');
      }, 800);
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.registrationCode && (
        <Alert variant="danger">
          <span className="text-red-600 text-sm">
            {errors.registrationCode.message}
          </span>
        </Alert>
      )}

      {errors.name && (
        <Alert variant="danger">
          <span className="text-red-600 text-sm">{errors.name.message}</span>
        </Alert>
      )}

      {errors.email && (
        <Alert variant="danger">
          <span className="text-red-600 text-sm">{errors.email.message}</span>
        </Alert>
      )}

      {errors.password && (
        <Alert variant="danger">
          <span className="text-red-600 text-sm">
            {errors.password.message}
          </span>
        </Alert>
      )}

      <h1 className="h3 mb-3 fw-normal">Please sign up</h1>

      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="registrationCode"
          placeholder="Your registration code"
          {...register('registrationCode', {
            required: { value: true, message: 'Registration Code is required' },
          })}
        />
        <label htmlFor="registrationCode">Registration Code</label>
      </div>

      <hr />

      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="name"
          placeholder="name@example.com"
          {...register('name', {
            required: { value: true, message: 'Name is required' },
          })}
        />
        <label htmlFor="name">Name</label>
      </div>

      <div className="form-floating">
        <input
          type="email"
          className="form-control"
          id="email"
          placeholder="Your Name"
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
            minLength: {
              value: 6,
              message: 'Password should be at least 6 characters',
            },
          })}
        />
        <label htmlFor="password">Password</label>
      </div>

      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Sign up
      </button>
    </form>
  );
};

export default RegisterForm;
