const handleSignUp = async (fullname, username, password, confirmPassword) => {
  if (password !== confirmPassword) {
    console.error("Passwords do not match");
    return;
  }

  const response = await fetch("http://localhost:9999/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fullname, username, password }),
  });

  const data = await response.json();
  if (data.success) {
    console.log(data.message);
  } else {
    alert(data.message);
  }
};
export default handleSignUp;
