// utils/gameUtils.js
export const createGame = (setRoomId, navigate) => {
  // Generate a unique room ID that includes both letters and numbers
  const newRoomId = Math.random().toString(36).substring(2, 7);
  setRoomId(newRoomId);
  // TODO: Save the room ID in your database or app state

  // Navigate to the room page
  navigate(`/room/${newRoomId}`);
};

export const joinGame = () => {
  // TODO: Check if the room exists in your database or app state
};
