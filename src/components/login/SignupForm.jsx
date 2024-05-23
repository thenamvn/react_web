// src/components/SignupForm.js
import React, { useState } from "react";
import ProfilePicture from "./ProfilePicture";
import handleKeyDown from "../../utils/handleKeyDown";
import handleSignUp from "../../utils/signup";
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const navigate = useNavigate();
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    setIsSubmitting(true);

    const newErrors = {};
    if (!fullname) newErrors.fullname = "*Full name is required";
    if (!username) newErrors.username = "*Username is required";
    if (!password) newErrors.password = "*Password is required";
    if (!confirmPassword)
      newErrors.confirmPassword = "*Confirm password is required";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "*Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      handleSignUp(fullname, username, password, confirmPassword, navigate);
    }
  };

  const navigateToLoginForm = () => {
    navigate('/login');
  }

  return (
    <form id="signup-form" onSubmit={handleSubmit}>
      <ProfilePicture />
      <br />
      <div className="username-container">
        <input
          type="text"
          placeholder="Full Name"
          value={fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
        {errors.fullname && <div className="error-message">{errors.fullname}</div>}
      </div>
      <br />
      <div className="username-container">
        <input
          type="text"
          placeholder="New Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        {errors.username && <div className="error-message">{errors.username}</div>}
      </div>
      <br />
      <div className="password-container">
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
        <br />
      </div>
      <br />
      <div className="password-container">
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onKeyDown={(e) => handleKeyDown(e, handleSubmit)}
        />
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
        <br />
      </div>
      <button type="submit" disabled={isSubmitting} className="bn31">
        <span className="bn31span">Đăng kí</span>
      </button>
      <p className="no-account">
        Đã có tài khoản ?
        <a onClick={navigateToLoginForm} className="link">
          {" "}
          Đăng nhập
        </a>
      </p>
    </form>
  );
};

export default SignupForm;
