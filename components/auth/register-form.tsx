const RegisterForm = () => {
  return (
    <form>
      <h1 className="h3 mb-3 fw-normal">Please sign up</h1>

      <div className="form-floating">
        <input type="email" className="form-control" id="email" placeholder="name@example.com" />
        <label htmlFor="email">Email address</label>
      </div>
      <div className="form-floating">
        <input type="password" className="form-control" id="password" placeholder="Password" />
        <label htmlFor="password">Password</label>
      </div>
      <button className="w-100 btn btn-lg btn-primary" type="submit">
        Sign up
      </button>
    </form>
  );
};

export default RegisterForm;
