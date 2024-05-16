// src/App.js
import React, { useState } from 'react';
import './App.css';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import Dashboard from './components/DashBoard';

const App = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const showSignupForm = () => {
    setIsLoginForm(false);
  };

  const showLoginForm = () => {
    setIsLoginForm(true);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="login-screen">
      {isLoginForm ? (
        <LoginForm
          togglePasswordVisibility={togglePasswordVisibility}
          passwordVisible={passwordVisible}
          showSignupForm={showSignupForm}
        />
      ) : (
        <SignupForm showLoginForm={showLoginForm} />
      )}
    </div>
  );
};

export default App;
