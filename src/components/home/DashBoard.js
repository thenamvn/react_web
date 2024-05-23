import "@fortawesome/fontawesome-free/css/all.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DashBoard.css";
import { createGame, joinGame } from "../../utils/dashboard";
const DashBoard = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  // Use the functions with the necessary arguments
  const handleCreateGame = () => createGame(setRoomId, navigate);
  const handleJoinGame = joinGame; // If joinGame needs arguments, add them here
  return (
    <div className="bg-dashboard">
      <div className="container">
        <h1>WebGame</h1>
        <button className="create-game-btn" onClick={handleCreateGame}>
          <i className="fas fa-gamepad"></i> CREATE GAME
        </button>
        <br />
        <div className="roomClass">
          <input type="text" id="room-code" placeholder="Enter room code" />
          <button className="join-game-btn" onClick={handleJoinGame}>
            <i className="fas fa-user"></i> Join Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
