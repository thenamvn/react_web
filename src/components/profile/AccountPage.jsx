import React, { useEffect, useState } from 'react';
import './AccountPage.css';
import { useNavigate } from 'react-router-dom';

const AccountPage = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');
    setEmail(username);
  }, []);

  const handleAccountInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/user/update/fullname/${email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
        },
        body: JSON.stringify({ fullname: fullName })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.text();
      alert(result);
      localStorage.setItem('current_username', fullName);
    } catch (error) {
      console.error('There was an error updating the fullname!', error);
      alert('There was an error updating the fullname!');
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (newPassword === confirmPassword) {
      try {
        const response = await fetch(`http://localhost:3000/user/update/password/${email}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Assuming token is stored in localStorage
          },
          body: JSON.stringify({ password: newPassword })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result = await response.text();
        alert(result);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('current_username');
        navigate('/login');
      } catch (error) {
        console.error('There was an error updating the password!', error);
        alert('There was an error updating the password!');
      }
    } else {
      alert('Passwords do not match!');
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
