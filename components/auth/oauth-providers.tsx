import { loginUsingGithub, loginUsingGoogle } from '../../services/auth';

const OAuthProviders = () => {
  const loginUsingGithubHandler = () => {
    loginUsingGithub();
  };
  const loginUsingGoogleHandler = () => {
    loginUsingGoogle();
  };

  return (
    <div className="row mb-3">
      <div className="col">
        <button
          className="btn btn-light d-flex justify-content-center align-items-center"
          onClick={loginUsingGithubHandler}
        >
          <img src="/github.svg" />
          <div className="m-2">Github</div>
        </button>
      </div>
      <div className="col">
        <button
          className="btn btn-light d-flex justify-content-center align-items-center"
          onClick={loginUsingGoogleHandler}
        >
          <img src="/google.svg" />
          <div className="m-2">Google</div>
        </button>
      </div>
    </div>
  );
};

export default OAuthProviders;
