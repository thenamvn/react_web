import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist';
import styles from './Main.module.css';

const Main = () => {
  useEffect(() => {
    // Assuming you have the total games and active games as variables
    let totalGames = 100;
    let activeGames = 30;

    let totalUsers = 1000;
    let activeUsers = 300;

    // Calculate inactive games
    let inactiveGames = totalGames - activeGames;
    // Calculate inactive users
    let inactiveUsers = totalUsers - activeUsers;

    // Create the games chart
    let gamesData = [{
      values: [activeGames, inactiveGames],
      labels: ['Active Games', 'Inactive Games'],
      type: 'pie'
    }];

    let gamesLayout = {
      title: 'Total Games: ' + totalGames,
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
  }, []);

  return (
    <main className={styles.mainContent}>
      <div className={styles.container}>
        <div className={`${styles.chartContainer} ${styles.gameStatusChart}`}>
          <h1 className={styles.heading}>Game Room Statistics</h1>
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
