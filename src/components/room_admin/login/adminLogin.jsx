import React from 'react';
import styles from './login.module.css';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const username = document.querySelector('input[name="username"]').value;
        const password = document.querySelector('input[name="password"]').value;
        console.log(username, password);
        fetch('http://localhost:3000/adminlogin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    console.log('Login success');
                    localStorage.setItem('token_admin', data.token);
                    localStorage.setItem('admin_username', username);
                    const redirectPath = localStorage.getItem("redirectPathAdmin");
                    if (redirectPath) {
                      localStorage.removeItem("redirectPathAdmin");
                      navigate(redirectPath);
                    } else {
                        navigate('/admin/dashboard');
                    }
                } else {
                    console.log('Login failed');
                }
            });
    };

    return (
        <div className={styles.bgAdminLogin}>
            <div className={styles.loginContainer}>
                <div className={styles.loginBox}>
                    <h2>ADMIN PANEL</h2>
                    <form>
                        <div className={styles.inputContainer}>
                            <input type="text" name="username" required />
                            <label>Username</label>
                            <div className={styles.icon}><i className="fas fa-user"></i></div>
                        </div>
                        <div className={styles.inputContainer}>
                            <input type="password" name="password" required />
                            <label>Password</label>
                            <div className={styles.icon}><i className="fas fa-lock"></i></div>
                        </div>
                        <button type="submit" className={styles.loginBtn} onClick={handleSubmit}>Login</button>
                    </form>
                    <a href="#" className={styles.forgotPassword}>Forgotten your password?</a>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;