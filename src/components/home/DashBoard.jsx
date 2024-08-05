import "@fortawesome/fontawesome-free/css/all.min.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DashBoard.module.css";
import { createGame, joinGame, joinGameInList } from "../../utils/dashboard";
import axios from "axios";
const DashBoard = () => {
  const navigate = useNavigate();
  const [HostRoom, setHostedRooms] = useState([]);
  const [JoinRoom, setJoinedRooms] = useState([]);

  // Use the functions with the necessary arguments
  const handleCreateGame = () => createGame( navigate);

  useEffect(() => {
    const username = localStorage.getItem("username");
    axios.get(`http://localhost:3000/room/${username}`)
      .then((response) => {
        const { rooms } = response.data;
        const hostedRooms = rooms.filter(room => room.role === "hostedroom");
        const joinedRooms = rooms.filter(room => room.role === "joinedroom");
        setHostedRooms(hostedRooms);
        setJoinedRooms(joinedRooms);
      });
  }, []);

  return (
    <div className={styles.containerfullwidth}>
      <div className={styles.bg_dashboard}>
        <div className={styles.container}>
          <h1>WebGame</h1>
          <button className={styles.create_game_btn} onClick={handleCreateGame}>
            <i className="fas fa-gamepad"></i> CREATE GAME
          </button>
          <br />
          <div className={styles.roomClass}>
            <input
              type="text"
              id="room-code"
              placeholder="Enter room code"
              className={styles.inputRoomCode} // Sử dụng camelCase cho tên class
            />
            <button className={styles.join_game_btn} onClick={() => joinGame(document.getElementById("room-code").value,navigate)}>
              <i className="fas fa-user"></i> Join
            </button>
          </div>
        </div>
        <div className={styles.hostroom}>
          <h1>Created Rooms</h1>
          <div className={styles.scrollableList}>
            <ul>
              {HostRoom.map((room) => (
                <li key={room.room_id} onClick={() => joinGameInList(room.room_id,navigate)}>
                  {room.room_id}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.joinroom}>
          <h1>Joined Rooms</h1>
          <div className={styles.scrollableList}>
            <ul>
              {JoinRoom.map((room) => (
                <li key={room.room_id} onClick={() => joinGameInList(room.room_id,navigate)}>
                  {room.room_id}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
