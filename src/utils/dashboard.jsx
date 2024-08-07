// utils/gameUtils.js
import axios from 'axios';

export const createGame = (navigate) => {
  // Generate a unique room ID that includes both letters and numbers
  const newRoomId = Math.random().toString(36).substring(2, 7);

  // TODO: Save the room ID in your database or app state
  axios.post("http://localhost:3000/createroom", {
    id: newRoomId,
    admin_username: localStorage.getItem("username"),
  })
    .then((response) => {
      console.log(response.data.message);
      // Navigate to the room page
      navigate(`/room/${newRoomId}`);
    })
    .catch((error) => {
      console.error("Error creating room:", error);
    });
};

export const joinGame = (id,navigate) => {
  // Fetch room details from the backend
  fetch(`http://localhost:3000/room/${id}/info`)
  .then(async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Network response was not ok: ${response.status} - ${errorText}`
      );
    }
    return response.json();
  })
  .then((data) => {
    if (data.admin_username === localStorage.getItem("username")) {
      navigate(`/room/${id}`);
    }
    else {
      axios.post("http://localhost:3000/joinroom", {
        id: document.getElementById("room-code").value,
        username: localStorage.getItem("username"),
      })
        .then((response) => {
          console.log(response.data.message);
          // Navigate to the room page
          navigate(`/room/${id}`);
        })
        .catch((error) => {
          console.error("Error joining room:", error);
        });
    }
  }
  )
};

export const joinGameInList = (roomId,navigate) => {
  navigate(`/room/${roomId}`);
}