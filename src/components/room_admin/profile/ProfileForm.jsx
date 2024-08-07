import React from 'react';
import styles from './ProfileForm.module.css';
import Navigation from '../dashboardadmin/negative';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const admin_username = localStorage.getItem('admin_username');
        const current_password = document.getElementsByName('old-password')[0].value;
        const new_password = document.getElementsByName('new-password')[0].value;
        const re_new_password = document.getElementsByName('re-new-password')[0].value;
        if (new_password !== re_new_password) {
            alert('Password does not match');
            return;
        }
        // get password of current user by api
        axios.get(`http://localhost:3000/admin/getinfo/${admin_username}`)
            .then((res) => {
                if (res.data.password === current_password) {
                    axios.put(`http://localhost:3000/admin/update/${admin_username}`, {
                        password: new_password
                    })
                        .then((res) => {
                            alert('Password updated successfully.Please login again');
                            localStorage.removeItem('admin_username');
                            localStorage.removeItem('token_admin');
                            navigate('/admin');
                        })
                        .catch((err) => {
                            console.error(err);
                        });
                } else {
                    alert('Current password is incorrect');
                }
            })
            .catch((err) => {
                console.error(err);
            });
    };
    
    return (
        <div>
            <Navigation />
            <div className={styles.bgAdminLogin}>
                <div className={styles.container}>
                    <div className={styles.loginContainer}>
                        <div className={styles.loginBox}>
                            <h2>PASSWORD UPDATE</h2>
                            <form onSubmit={handleSubmit}>
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