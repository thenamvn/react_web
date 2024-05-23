import "@fortawesome/fontawesome-free/css/all.min.css";
import './DashBoard.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';

const DashBoard = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createGame = () => {
    // Generate a unique room ID that includes both letters and numbers
    const newRoomId = Math.random().toString(36).substring(2, 15);
    setRoomId(newRoomId);
    // TODO: Save the room ID in your database or app state

    // Navigate to the room page
    navigate(`/room/${newRoomId}`);
  };

  const joinGame = () => {
    // TODO: Check if the room exists in your database or app state
  };

  return (
    <div className="bg-dashboard">
      <div className="container">
        <h1>WebGame</h1>
        <button className="create-game-btn" onClick={createGame}>
          <i className="fas fa-gamepad"></i> CREATE GAME
        </button>
        <br />
        <div className="roomClass">
          <input type="text" id="room-code" placeholder="Enter room code" />
          <button className="join-game-btn" onClick={joinGame}>
            <i className="fas fa-user"></i> Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;