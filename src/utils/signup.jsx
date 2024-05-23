// src/utils/signup.js
const BASE_URL = "http://localhost:3000";

const handleSignUp = async (fullname, username, password, confirmPassword, navigate) => {
  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    return;
  }

  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullname, username, password }),
  });

  const data = await response.json();
  if (data.success) {
    alert(data.message);
    navigate('/login');
  } else {
    alert(data.message);
  }
};

export default handleSignUp;
