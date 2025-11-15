import React from "react";
import "./_Login.scss";

const Login: React.FC = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Welcome to VocalFlow</h1>
        <p>Your AI vocal transformation tool</p>
        <a
          href="https://examensarbete.onrender.com/auth/google"
          className="google-login-btn"
        >
          <img
            src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png"
            alt="Google Logo"
          />
          Sign in with Google
        </a>
      </div>
    </div>
  );
};

export default Login;
