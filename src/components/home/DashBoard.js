import '@fortawesome/fontawesome-free/css/all.min.css';

const DashBoard = () => {
  return (
    // src/components/home/DashBoard.js
    <div className="container">
      <h1>WebGame</h1>
      <button className="create-game-btn">
        <i className="fas fa-gamepad"></i> CREATE GAME
      </button>
      <br />
      <div className="roomClass">
        <input type="text" id="room-code" placeholder="Enter room code" />
        <button className="join-game-btn">
          <i className="fas fa-user"></i> Join Now
        </button>
      </div>
    </div>
  );
};

export default DashBoard;
