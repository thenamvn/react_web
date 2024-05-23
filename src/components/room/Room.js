import { useParams } from 'react-router-dom';
import QRCode from 'qrcode.react';
// import './Room.css';

const Room = () => {
  const { roomId } = useParams();

  return (
    <div>
      <h1>Welcome to room {roomId}</h1>
      <p>Room Link: <a href={window.location.href}>{window.location.href}</a></p>
      <QRCode value={window.location.href} />
    </div>
  );
};

export default Room;