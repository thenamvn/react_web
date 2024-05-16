const handleLogin = () => {
  // Get username and password values from your form
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Send a POST request to the /login route
  fetch("http://localhost:9999/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Save the token to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("current_username", data.fullname);
        // render to dashboard
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
export default handleLogin;
