import React from 'react';
import styles from './ProfileForm.module.css';
import { useNavigate } from 'react-router-dom';
import Navigation from '../dashboardadmin/negative';

const ProfileForm = () => {
    return (
        <div>
            <Navigation />
            <div className={styles.bgAdminLogin}>
                <div className={styles.container}>
                    <div className={styles.loginContainer}>
                        <div className={styles.loginBox}>
                            <h2>PASSWORD UPDATE</h2>
                            <form>
                                <div className={styles.inputContainer}>
                                    <input type="password" name="old-password" required />
                                    <label>Current Password</label>
                                    <div className={styles.icon}><i className="fas fa-lock"></i></div>
                                </div>
                                <div className={styles.inputContainer}>
                                    <input type="password" name="new-password" required />
                                    <label>Password</label>
                                    <div className={styles.icon}><i className="fas fa-lock"></i></div>
                                </div>
                                <div className={styles.inputContainer}>
                                    <input type="password" name="re-new-password" required />
                                    <label>Confirm Password</label>
                                    <div className={styles.icon}><i className="fas fa-lock"></i></div>
                                </div>
                                <button type="submit" className={styles.loginBtn}>Change Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;