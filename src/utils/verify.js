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
    return data.success;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
};

export default verifyToken;
