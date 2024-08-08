import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navigation from '../dashboardadmin/negative';
import styles from './GameRoomManager.module.css';

const GameRoomManager = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const roomsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:3000/admin/roommanager')
      .then(response => {
        setRooms(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('There was an error fetching the rooms!', error);
      });
  }, []);

  const handleDelete = (roomId) => {
    axios.delete(`http://localhost:3000/delete/room/${roomId}`)
      .then(response => {
        const updatedRooms = rooms.filter(room => room.room_id !== roomId);
        setRooms(updatedRooms);
      })
      .catch(error => {
        console.error('There was an error deleting the room!', error);
      });
  };

  const indexOfLastRoom = currentPage * roomsPerPage;
  const indexOfFirstRoom = indexOfLastRoom - roomsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRoom, indexOfLastRoom);

  const totalPages = Math.ceil(rooms.length / roomsPerPage);

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
          <h1 className={styles.heading}>Game Room Manager</h1>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Room List</h3>
            </div>
            <div className={styles.cardBody}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Room ID</th>
                    <th>Room Owner</th>
                    <th>Room Members</th>
                    <th>Room Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRooms.map(room => (
                    <tr key={room.room_id}>
                      <td>{room.room_id}</td>
                      <td>
                        <div>{room.admin_fullname}</div>
                        <div>({room.room_owner})</div>
                      </td>
                      <td>{room.room_members}</td>
                      <td>
                        <button className={styles.button} onClick={() => handleDelete(room.room_id)}>Delete</button>
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

export default GameRoomManager;
