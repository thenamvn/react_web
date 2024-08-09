import React, { useEffect, useState } from 'react';
import styles from './Reward.module.css';

const PrizePopup = ({ username, room_id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rewardInfo, setRewardInfo] = useState({});

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    async function fetchAndCheckRewardInfo() {
      try {
        const response = await fetch(`http://localhost:3000/reward/${room_id}/${username}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const rewardInfo = await response.json();
        setRewardInfo(rewardInfo);
        console.log('Reward Information:', rewardInfo);

        const currentDate = new Date();
        const expirationDate = new Date(rewardInfo.gift_expiration);
        if (rewardInfo.used === 0 && expirationDate > currentDate) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Error fetching reward information:', error);
      }
    }

    fetchAndCheckRewardInfo();
  }, [room_id, username]);

  return (
    <>
      {isOpen && (
        <div className={styles.popupOverlay}>
          <div className={styles.popup}>
            <h2 className={styles.popupTitle}>Congratulations!</h2>
            <p className={styles.popupText}>You get a reward!</p>
            <p className={styles.popupText}>Gift: {rewardInfo.gift}</p>
            <p className={styles.popupText}>Gift Expiration: {new Date(rewardInfo.gift_expiration).toLocaleDateString()}</p>
            <button className={styles.popupButton} onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PrizePopup;
