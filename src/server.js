// server.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

pool.query(
  `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
  )
`,
  (error, results, fields) => {
    if (error) throw error;
  }
);

app.post("/signup", (req, res) => {
  const fullname = req.body.fullname;
  const username = req.body.username;
  const password = req.body.password;

  pool.query(
    "INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)",
    [fullname, username, password],
    function (error, results, fields) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          res.json({ success: false, message: "Username already exists!" });
        } else {
          res.json({
            success: false,
            message: "An error occurred during registration.",
          });
        }
      } else {
        res.json({ success: true, message: "User registered successfully!" });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  pool.query(
    "SELECT * FROM users WHERE username = ?",
    [username],
    function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        if (password === results[0].password) {
          // Create a token
          const token = jwt.sign(
            { username: username },
            process.env.SECRET_KEY,
            { expiresIn: "1d" }
          );

          // Send success message along with the token
          res.json({
            success: true,
            message: "Logged in successfully",
            token: token,
            fullname: results[0].fullname,
            username: results[0].username,
          });
        } else {
          res.json({
            success: false,
            message: "Incorrect Username and/or Password!",
          });
        }
      } else {
        res.json({
          success: false,
          message: "Incorrect Username and/or Password!",
        });
      }
    }
  );
});

app.post("/verify-token", (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // If there's no token, return 401 (Unauthorized)
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return res.json({ success: false, message: "Token not valid" }); // If the token is not valid, return an error message
    }

    return res.json({ success: true, message: "Token is valid" }); // If the token is valid, return a success message
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
