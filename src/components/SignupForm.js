// src/components/SignupForm.js
import ProfilePicture from './ProfilePicture';
const SignupForm = ({ showLoginForm }) => (
  <form id="signup-form">
    <ProfilePicture /><br />
    <div className="username-container">
      <input type="text" placeholder="Full Name" id="fullname" />
    </div><br />
    <div className="username-container">
      <input type="text" placeholder="New Username" id="new-username" name="new-username" autoComplete="username" />
    </div><br />
    <div className='password-container'>
      <input
        type="password"
        placeholder="New Password"
        id="new-password"
        name="new-password"
      /><br />
    </div><br />
    <div className='password-container'>
      <input
        type="password"
        placeholder="Confirm Password"
        id="confirm-password"
        name="confirm-password"
      /><br />
    </div>
    <a className="bn31">
      <span id="signup-button" className="bn31span">Đăng kí</span>
    </a>
    <p className="no-account">Đã có tài khoản ?<a onClick={showLoginForm} className="link"> Đăng nhập</a></p>
  </form>
);

export default SignupForm;
