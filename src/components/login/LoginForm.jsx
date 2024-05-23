import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from './ProfilePicture';
import handleLogin from '../../utils/login';
import handleKeyDown from '../../utils/handleKeyDown';

const LoginForm = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const navigateToSignupForm = () => {
    navigate('/signup');
  }

  const handleRememberMeChange = () => {
    const rememberMeCheckbox = document.getElementById("remember-me");
    if (!rememberMeCheckbox.checked) {
      localStorage.removeItem("password");
    }
  };

  useEffect(() => {
    const rememberedUsername = localStorage.getItem("username");
    const rememberedPassword = localStorage.getItem("password");

    if (rememberedUsername && rememberedPassword) {
      document.getElementById("username").value = rememberedUsername;
      document.getElementById("password").value = rememberedPassword;
      document.getElementById("remember-me").checked = true;
    }
  }, []);

  return (
    <form id="login-form">
      <ProfilePicture /><br />
      <div className="username-container">
        <input type="text" placeholder="Username" id="username" name="username" autoComplete="username" />
      </div><br />
      <div className='password-container'>
        <input
          type={passwordVisible ? 'text' : 'password'}
          placeholder="Password"
          id="password"
          name="password"
          onKeyDown={(e) => handleKeyDown(e, (event) => handleLogin(event, navigate))}
        /><br />
        <a href="#" className="forgot-password">Quên mật khẩu?</a>
      </div>
      <div className="checkbox-wrapper-29">
        <label className="checkbox">
          <input type="checkbox" id="remember-me" className="checkbox__input" onChange={handleRememberMeChange} />
          <span className="checkbox__label"></span>
          Nhớ mật khẩu
        </label>
      </div>
      <div className="checkbox-wrapper-29">
        <label className="checkbox">
          <input
            type="checkbox"
            id="show-password"
            className="checkbox__input"
            onChange={togglePasswordVisibility}
          />
          <span className="checkbox__label"></span>
          Hiện mật khẩu
        </label>
      </div>
      <a className="bn31">
        <span onClick={(event) => handleLogin(event, navigate)} id="login-button" className="bn31span">Đăng nhập</span>
      </a>
      <p className="no-account">Chưa có tài khoản ?<a onClick={navigateToSignupForm} className="link"> Đăng kí</a></p>
    </form>
  );
};

export default LoginForm;