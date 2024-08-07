// src/auth.js
const verifyToken = async () => {
  try {
    const response = await fetch("http://localhost:3000/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token_admin"),
      },
    });
    const data = await response.json();
    console.log(data);
    const adminUsername = localStorage.getItem("admin_username");
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

