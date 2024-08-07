import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserManager.module.css';
import Navigation from '../dashboardadmin/negative';

const UserManager = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);


  const fetchUsers = () => {
    axios.get('http://localhost:3000/admin/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  };

  const handleDeleteUser = (username) => {
    const updatedUsers = users.filter(user => user.username !== username);
    setUsers(updatedUsers);
    axios.delete(`http://localhost:3000/delete/user/${username}`)
      .then(response => {
        setUsers(users.filter(user => user.username !== username));
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  };

  return (
    <div>
      <Navigation />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.heading}>User Manager</h1>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>User List</h3>
            </div>
            <div className={styles.cardBody}>
              <table id={styles.users_table}>
                <thead>
                  <tr>
                    <th>Full Name</th>
                    <th>Username</th>
                    <th>Number of joined rooms</th>
                    <th>Number of created rooms</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.username}>
                      <td>{user.fullname}</td>
                      <td>{user.username}</td>
                      <td>{user.joined_rooms}</td>
                      <td>{user.created_rooms}</td>
                      <td>
                        <button className={styles.button} onClick={() => handleDeleteUser(user.username)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManager;