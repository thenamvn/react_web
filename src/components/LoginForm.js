// src/components/LoginForm.js
import ProfilePicture from './ProfilePicture';
import handleLogin  from '../utils/login';
const LoginForm = ({ togglePasswordVisibility, passwordVisible, showSignupForm }) => (
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
      /><br />
      <a href="#" className="forgot-password">Quên mật khẩu?</a>
    </div>
    <div className="checkbox-wrapper-29">
      <label className="checkbox">
        <input type="checkbox" id="remember-me" className="checkbox__input" />
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
      <span onClick={handleLogin} id="login-button" className="bn31span">Đăng nhập</span>
    </a>
    <p className="no-account">Chưa có tài khoản ?<a onClick={showSignupForm} className="link"> Đăng kí</a></p>
  </form>
);

export default LoginForm;
