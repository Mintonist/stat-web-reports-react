import React from 'react';
import LoginForm from '../components/ui/loginForm';

const Login = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3 shadow p-4">
          {
            <>
              <h3 className="mb-4">Вход</h3>
              <LoginForm></LoginForm>
            </>
          }
        </div>
      </div>
    </div>
  );
};

export default Login;
