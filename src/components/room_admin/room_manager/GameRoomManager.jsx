import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './GameRoomManager.module.css';
import Navigation from '../dashboardadmin/negative';

const GameRoomManager = () => {
  const [rooms, setRooms] = useState([]);

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
    const updatedRooms = rooms.filter(room => room.room_id !== roomId);
    setRooms(updatedRooms);
    axios.delete(`http://localhost:3000/delete/room/${roomId}`)
      .then(response => {
        setRooms(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('There was an error fetching the rooms!', error);
      });
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
                  {rooms.map(room => (
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
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GameRoomManager;
