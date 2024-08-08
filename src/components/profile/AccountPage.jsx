import React, { useState } from 'react';
import './AccountPage.css';

const AccountPage = () => {
  const [email, setEmail] = useState('ntnhacker1@gmail.com');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAccountInfoSubmit = (e) => {
    e.preventDefault();
    // Logic xử lý cập nhật thông tin tài khoản
    alert('Thông tin tài khoản đã được cập nhật!');
  };

  const handlePasswordChangeSubmit = (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      // Logic xử lý đổi mật khẩu
      alert('Mật khẩu đã được đổi thành công!');
    } else {
      alert('Mật khẩu không khớp!');
    }
  };

  return (
    <div className="account-page">
      <div className="account-info-section">
        <h2>Account Infomation</h2>
        <form onSubmit={handleAccountInfoSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Update</button>
        </form>
      </div>

      <div className="change-password-section">
        <h2>Change password</h2>
        <form onSubmit={handlePasswordChangeSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">Update</button>
        </form>
      </div>
    </div>
  );
};

export default AccountPage;
