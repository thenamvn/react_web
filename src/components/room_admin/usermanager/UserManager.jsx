import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './UserManager.module.css';
import Navigation from '../dashboardadmin/negative';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

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
    axios.delete(`http://localhost:3000/delete/user/${username}`)
      .then(response => {
        setUsers(users.filter(user => user.username !== username));
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
      });
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPageButtons = 5; // Số lượng nút trang muốn hiển thị
    const halfMaxPageButtons = Math.floor(maxPageButtons / 2);

    let startPage = currentPage - halfMaxPageButtons;
    let endPage = currentPage + halfMaxPageButtons;

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(totalPages, maxPageButtons);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className={styles.pagination}>
        {currentPage > 1 && (
          <button onClick={() => paginate(currentPage - 1)} className={styles.pageButton}>Previous</button>
        )}
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`${styles.pageButton} ${currentPage === number ? styles.active : ''}`}
          >
            {number}
          </button>
        ))}
        {currentPage < totalPages && (
          <button onClick={() => paginate(currentPage + 1)} className={styles.pageButton}>Next</button>
        )}
      </div>
    );
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
                  {currentUsers.map(user => (
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
              {renderPagination()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManager;
