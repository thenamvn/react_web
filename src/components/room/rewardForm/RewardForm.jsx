import React, { useState } from 'react';
import styles from './RewardForm.module.css';

const RewardForm = ({ username, room_id, onClose }) => {
  const [gift, setReward] = useState("");
  const [gift_expiration, setGiftExpiration] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reward = {
      room_id: room_id,
      username: username,
      gift: gift,
      used: false,
      gift_expiration: gift_expiration
    };
    try {
      const response = await fetch('http://localhost:3000/reward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reward)
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const result = await response.text();
      console.log('Reward added successfully:', result);
      alert('Reward added successfully');
      handleClose();
    } catch (error) {
      console.error('Error adding reward:', error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <form className={styles.rewardForm} onSubmit={handleSubmit}>
      <button type="button" className={styles.closeButton} onClick={handleClose}>&times;</button>
      <div className={styles.formGroup}>
        <label>Room ID:</label>
        <input
          type="text"
          name="room_id"
          readOnly
          required
          value={room_id}
        />
      </div>
      <div className={styles.formGroup}>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={username}
          required
          readOnly
        />
      </div>
      <div className={styles.formGroup}>
        <label>Gift:</label>
        <input
          type="text"
          name="gift"
          value={gift}
          onChange={(e) => setReward(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Gift Expiration Date:</label>
        <input
          type="date"
          name="gift_expiration"
          value={gift_expiration}
          onChange={(e) => setGiftExpiration(e.target.value)}
          required
        />
      </div>
      <button className={styles.submitButton} type="submit">Send Reward</button>
    </form>
  );
};

export default RewardForm;