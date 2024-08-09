import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import styles from './Main.module.css';

const Main = () => {
  useEffect(() => {
    // Fetch room data from the server
    fetch(`http://localhost:3000/admin/room/dashboard`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        return response.json();
      })
      .then((roomData) => {
        console.log(roomData);
        let totalRooms = roomData.total_rooms;
        let emptyRooms = roomData.empty_rooms;

        // Fetch user data from the server
        fetch(`http://localhost:3000/admin/user/dashboard`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Error: ${response.statusText}`);
            }
            return response.json();
          })
          .then((userData) => {
            console.log(userData);
            let totalUsers = userData.total_users;
            let activeUsers = userData.active_users;

            // Calculate active rooms
            let activeRooms = totalRooms - emptyRooms;
            // Calculate inactive users
            let inactiveUsers = totalUsers - activeUsers;

            // Create the games chart
            let gamesData = [{
              values: [activeRooms, emptyRooms],
              labels: ['Active Rooms', 'Empty Rooms'],
              type: 'pie'
            }];

            let gamesLayout = {
              title: 'Total Rooms: ' + totalRooms,
              legend: {
                orientation: "h",
                xanchor: "center",
                x: 0.5,
                y: -0.1
              }
            };

            Plotly.newPlot('game-status-chart', gamesData, gamesLayout);

            // Create the users chart
            let usersData = [{
              values: [activeUsers, inactiveUsers],
              labels: ['Active Users', 'Inactive Users'],
              type: 'pie'
            }];

            let usersLayout = {
              title: 'Total Users: ' + totalUsers,
              legend: {
                orientation: "h",
                xanchor: "center",
                x: 0.5,
                y: -0.1
              }
            };

            Plotly.newPlot('users-status-chart', usersData, usersLayout);
          })
          .catch((error) => {
            console.error('Error fetching user data:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching room data:', error);
      });
  }, []);

  return (
    <main className={styles.mainContent}>
      <div className={styles.container}>
        <div className={`${styles.chartContainer} ${styles.gameStatusChart}`}>
          <h1 className={styles.heading}>Rooms Statistics</h1>
          <div id="game-status-chart"></div>
        </div>
        <div className={`${styles.chartContainer} ${styles.usersStatusChart}`}>
          <h1 className={styles.heading}>Users Statistics</h1>
          <div id="users-status-chart"></div>
        </div>
      </div>
    </main>
  );
};

export default Main;
