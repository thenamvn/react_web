// src/auth.js
const verifyToken = async () => {
  try {
    const response = await fetch("http://localhost:3000/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });
    const data = await response.json();
    const adminUsername = localStorage.getItem("username");
    if (data.success && data.user.username === adminUsername) {
      return true;
    } else {
      return false;
    }
  }
  catch (error) {
    return false;
  }
};

export default verifyToken;

