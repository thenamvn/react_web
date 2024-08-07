import React from 'react';
import styles from './Navigation.module.css';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  const handleDashboard = () => {
    navigate('/admin/dashboard');
  };

  const logoutFunc = () => {
    localStorage.removeItem('token_admin');
    localStorage.removeItem('admin_username');
    navigate('/admin');
  };

  const handleRoomManager = () => {
    navigate('/admin/room-manager');
  };

  const handleUserManager = () => {
    navigate('/admin/user-manager');
  };

  const handleProfile = () => {
    navigate('/admin/profile');
  };

  return (
    <nav className={styles.mainMenu}>
      <ul>
        <li>
          <a onClick={handleDashboard}>
            <i className={`fa fa-home fa-2x ${styles.navIcon}`}></i>
            <span className={styles.navText}> Dashboard </span>
          </a>
        </li>
        <li>
          <a onClick={handleRoomManager}>
            <i className={`fa fa-book fa-2x ${styles.navIcon}`}></i>
            <span className={styles.navText}> Game Room Manager </span>
          </a>
        </li>
        <li>
          <a onClick={handleUserManager}>
            <i className={`fa fa-cogs fa-2x ${styles.navIcon}`}></i>
            <span className={styles.navText}> User Management </span>
          </a>
        </li>
      </ul>

      <ul className={styles.logout}>
        <li className="user-profile">
          <a onClick={handleProfile}>
            <i className={`fa fa-user fa-2x ${styles.navIcon}`}></i>
            <span className={styles.navText}> User Profile </span>
          </a>
        </li>

        <li>
          <a onClick={logoutFunc}>
            <i className={`fa fa-power-off fa-2x ${styles.navIcon}`}></i>
            <span className={styles.navText}> Logout </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
