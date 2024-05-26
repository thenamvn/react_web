// utils/gameUtils.js
export const createGame = (setRoomId, navigate) => {
  // Generate a unique room ID that includes both letters and numbers
  const newRoomId = Math.random().toString(36).substring(2, 7);
  setRoomId(newRoomId);
  // TODO: Save the room ID in your database or app state
  fetch('http://localhost:3000/createroom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: newRoomId, admin_username: localStorage.getItem('username') }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
    })
    .catch((error) => {
      console.error('Error creating room:', error);
    });
  // Navigate to the room page
  navigate(`/room/${newRoomId}`);
};

export const joinGame = () => {
  // TODO: Check if the room exists in your database or app state
};
