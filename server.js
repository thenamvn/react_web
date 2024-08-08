// server.js
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

// Tạo thư mục public/uploads nếu chưa tồn tại
const uploadDir = path.resolve(__dirname, './public/uploads');
console.log(uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer để lưu trữ file trong public/uploads và thay thế khoảng trắng
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Đường dẫn tuyệt đối
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
    cb(null, uniqueSuffix);
  },
});

// Chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});


// app.post('/upload', upload.array('file'), (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).json({ message: 'No files uploaded or file type is not allowed.' });
//   }
//   const fileUrls = req.files.map(file => `http://localhost:${PORT}/uploads/${file.filename}`);
//   res.status(200).json({ fileUrls });
// });

// Endpoint to handle file uploads

app.post('/createroom', (req, res) => {
  const { id, admin_username } = req.body;

  if (!id || !admin_username) {
    return res.status(400).json({ error: 'Room ID and admin username are required.' });
  }

  const query = 'INSERT INTO room (room_id, admin_username) VALUES (?, ?)';

  pool.query(query, [id, admin_username], (err, result) => {
    if (err) {
      console.error('Error inserting into room table:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.status(201).json({ message: 'Room created successfully.' });
  });
});

app.post('/joinroom', (req, res) => {
  const { id, username } = req.body;
  if (!id || !username) {
    return res.status(400).json({ error: 'Room ID and username are required.' });
  }
  const query = 'INSERT INTO room_users (room_id, username) VALUES (?, ?)';
  pool.query(query, [id, username], (err, result) => {
    if (err) {
      console.error('Error inserting into room_users table:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Joined room successfully.' });
  });
});

app.get('/room/:username', (req, res) => {
  const username = req.params.username;

  if (!username) {
    res.status(400).send('Username not provided');
    return;
  }

  // Lấy danh sách các room mà user đã tạo và các room mà user đã tham gia
  const query = `
    SELECT r.room_id, 'hostedroom' as role
    FROM room r
    WHERE r.admin_username = ?

    UNION

    SELECT ru.room_id, 'joinedroom' as role
    FROM room_users ru
    WHERE ru.username = ?
  `;

  pool.query(query, [username, username], (err, results) => {
    if (err) {
      console.error('Error fetching rooms:', err);
      res.status(500).send('Server error');
      return;
    }

    res.json({ rooms: results });
  });
});



// Get room details by ID
app.get('/room/:id/info', (req, res) => {
  const roomId = req.params.id;

  const query = `
    SELECT r.room_id, r.admin_username
    FROM room r
    JOIN users u ON r.admin_username = u.username
    WHERE r.room_id = ?
  `;

  pool.query(query, [roomId], (err, results) => {
    if (err) {
      console.error('Error fetching room details:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Room not found' });
      return;
    }

    res.json(results[0]);
  });
});

app.get('/room/:id/submited', (req, res) => {
  const roomId = req.params.id;

  const query = `
    SELECT su.username, u.fullname
    FROM submitedusers su
    JOIN users u ON su.username = u.username
    WHERE su.room_id = ?
  `;

  pool.query(query, [roomId], (err, results) => {
    if (err) {
      console.error('Error fetching submitted users:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'No submitted users found for this room' });
      return;
    }

    res.json(results);
  });
});

app.post('/submit', (req, res) => {
  const { id, username } = req.body;
  if (!id || !username) {
    return res.status(400).json({ error: 'Room ID and username are required.' });
  }
  const query = 'INSERT INTO submitedusers (room_id, username) VALUES (?, ?)';
  pool.query(query, [id, username], (err, result) => {
    if (err) {
      console.error('Error inserting into room table:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Submited.' });
  });
}
);

// Get images for a room uploaded by the admin
app.get('/room/:id/images', (req, res) => {
  const roomId = req.params.id;

  const query = `
    SELECT i.image_id, i.room_id, i.uploader_username, i.image_path, i.uploaded_at
    FROM images i
    JOIN room r ON i.room_id = r.room_id
    WHERE i.room_id = ? AND i.uploader_username = r.admin_username
  `;

  pool.query(query, [roomId], (err, results) => {
    if (err) {
      console.error('Error fetching images:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Get images for a room uploaded by user
app.get('/room/:id/userimages', (req, res) => {
  const roomId = req.params.id;
  const username = req.query.username;
  pool.query('SELECT * FROM images WHERE room_id = ? AND uploader_username = ?', [roomId, username], (err, results) => {
    if (err) {
      console.error('Error fetching images:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  }
  );
});

app.get('/room/:id/jobs', (req, res) => {
  const roomId = req.params.id;
  pool.query('SELECT * FROM job WHERE room_id = ?', [roomId], (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});


app.post('/upload', upload.array('file'), (req, res) => {
  const files = req.files;
  const room_id = req.body.room_id;
  const uploader_username = req.body.uploader_username;

  if (!files) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  // Check if the room exists
  pool.query('SELECT * FROM room WHERE room_id = ?', [room_id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Room not exist' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Room does not exist.' });
    }

    // If the room exists, insert the images
    const fileUrls = files.map(file => `http://localhost:${PORT}/uploads/${file.filename}`);
    const values = files.map(file => [room_id, uploader_username, `/uploads/${file.filename}`]);

    const query = 'INSERT INTO images (room_id, uploader_username, image_path) VALUES ?';

    pool.query(query, [values], (err, result) => {
      if (err) {
        console.error('Error inserting into images table:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.status(200).json({ fileUrls });
    });
  });
});

// Serve static files from the public directory
app.use(express.static(path.resolve(__dirname,'public')));

app.post("/upload_job",(req,res)=>{
  const room_id = req.body.room_id;
  const job_description = req.body.job;
  const job_owner = req.body.job_owner;
  const query = 'INSERT INTO job (room_id, job_description, job_owner) VALUES (?, ?, ?)';
  pool.query(query, [room_id, job_description, job_owner], (err, result) => {
    if (err) {
      console.error('Error inserting into job table:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(200).json({ message: 'Job created successfully.' });
  });
});

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
        res.json({ success: true, message: "User registered successfully! Please login again!" });
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
            { expiresIn: "7d" }
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
          message: "Username not found! Please register!",
        });
      }
    }
  );
});

app.post("/adminlogin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  pool.query(
    "SELECT * FROM admin_account WHERE username = ?",
    [username],
    function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        if (password === results[0].password) {
          // Create a token
          const token = jwt.sign(
            { username: username },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
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
          message: "Username not found! Please register!",
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

    return res.json({ success: true, message: "Token is valid",user }); // If the token is valid, return a success message
  });
});

//admin
// Tạo endpoint để lấy danh sách các phòng
app.get('/admin/roommanager', (req, res) => {
  const query = `
    SELECT 
      room.room_id, 
      room.admin_username AS room_owner, 
      users.fullname AS admin_fullname,
      COUNT(room_users.username) AS room_members 
    FROM room 
    LEFT JOIN room_users ON room.room_id = room_users.room_id 
    LEFT JOIN users ON room.admin_username = users.username
    GROUP BY room.room_id, room.admin_username, users.fullname;
  `;

  pool.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// lấy thông tin các users
app.get('/admin/users', (req, res) => {
  const query = `
    SELECT 
      u.fullname, 
      u.username, 
      (SELECT COUNT(*) FROM room_users ru WHERE ru.username = u.username) AS joined_rooms,
      (SELECT COUNT(*) FROM room r WHERE r.admin_username = u.username) AS created_rooms
    FROM users u;
  `;
  pool.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Delete a room and all related data
app.delete('/delete/room/:id', (req, res) => {
  const roomId = req.params.id;

  // Start a transaction
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      res.status(500).send('Server error');
      return;
    }

    connection.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        res.status(500).send('Server error');
        return;
      }

      // Get image paths from images table
      connection.query('SELECT image_path FROM images WHERE room_id = ?', [roomId], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error fetching images:', err);
            res.status(500).send('Server error');
          });
        }

        // Delete image files from file system
        results.forEach(row => {
          const imagePath = path.join(__dirname, 'public', row.image_path);
          fs.unlink(imagePath, err => {
            if (err) {
              console.error('Error deleting image file:', err);
            }
          });
        });

        // Delete from images table
        connection.query('DELETE FROM images WHERE room_id = ?', [roomId], (err, results) => {
          if (err) {
            return connection.rollback(() => {
              console.error('Error deleting images:', err);
              res.status(500).send('Server error');
            });
          }

          // Delete from job table
          connection.query('DELETE FROM job WHERE room_id = ?', [roomId], (err, results) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error deleting jobs:', err);
                res.status(500).send('Server error');
              });
            }

            // Delete from room_users table
            connection.query('DELETE FROM room_users WHERE room_id = ?', [roomId], (err, results) => {
              if (err) {
                return connection.rollback(() => {
                  console.error('Error deleting room_users:', err);
                  res.status(500).send('Server error');
                });
              }

              // Delete from submitted_users table
              connection.query('DELETE FROM submitedusers WHERE room_id = ?', [roomId], (err, results) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error('Error deleting submitted_users:', err);
                    res.status(500).send('Server error');
                  });
                }

                // Delete from room table
                connection.query('DELETE FROM room WHERE room_id = ?', [roomId], (err, results) => {
                  if (err) {
                    return connection.rollback(() => {
                      console.error('Error deleting room:', err);
                      res.status(500).send('Server error');
                    });
                  }

                  // Commit the transaction
                  connection.commit(err => {
                    if (err) {
                      return connection.rollback(() => {
                        console.error('Error committing transaction:', err);
                        res.status(500).send('Server error');
                      });
                    }

                    res.send('Room and related data deleted successfully');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

// Delete a user and all related data
app.delete('/delete/user/:username', (req, res) => {
  const username = req.params.username;

  // Start a transaction
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting connection:', err);
      res.status(500).send('Server error');
      return;
    }

    connection.beginTransaction(err => {
      if (err) {
        console.error('Error starting transaction:', err);
        res.status(500).send('Server error');
        return;
      }

      // Get image paths from images table
      connection.query('SELECT image_path FROM images WHERE uploader_username = ?', [username], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            console.error('Error fetching images:', err);
            res.status(500).send('Server error');
          });
        }

        // Delete image files from file system
        results.forEach(row => {
          const imagePath = path.join(__dirname, 'public', row.image_path);
          fs.unlink(imagePath, err => {
            if (err) {
              console.error('Error deleting image file:', err);
            }
          });
        });

        // Delete from images table
        connection.query('DELETE FROM images WHERE uploader_username = ?', [username], (err, results) => {
          if (err) {
            return connection.rollback(() => {
              console.error('Error deleting images:', err);
              res.status(500).send('Server error');
            });
          }

          // Delete from job table
          connection.query('DELETE FROM job WHERE job_owner = ?', [username], (err, results) => {
            if (err) {
              return connection.rollback(() => {
                console.error('Error deleting jobs:', err);
                res.status(500).send('Server error');
              });
            }

            // Delete from room_users table
            connection.query('DELETE FROM room_users WHERE username = ?', [username], (err, results) => {
              if (err) {
                return connection.rollback(() => {
                  console.error('Error deleting room_users:', err);
                  res.status(500).send('Server error');
                });
              }

              // Delete from submitedusers table
              connection.query('DELETE FROM submitedusers WHERE username = ?', [username], (err, results) => {
                if (err) {
                  return connection.rollback(() => {
                    console.error('Error deleting submitedusers:', err);
                    res.status(500).send('Server error');
                  });
                }

                // Finally, delete the user from users table
                connection.query('DELETE FROM users WHERE username = ?', [username], (err, results) => {
                  if (err) {
                    return connection.rollback(() => {
                      console.error('Error deleting user:', err);
                      res.status(500).send('Server error');
                    });
                  }

                  // Commit the transaction
                  connection.commit(err => {
                    if (err) {
                      return connection.rollback(() => {
                        console.error('Error committing transaction:', err);
                        res.status(500).send('Server error');
                      });
                    }

                    res.send('User and all related data deleted successfully');
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});

app.get('/admin/getinfo/:username', (req, res) => {
  const username = req.params.username;
  pool.query('SELECT * FROM admin_account WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Server error');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    res.json(results[0]);
  });
});

app.put('/admin/update/:username', (req, res) => {
  const username = req.params.username;
  const password = req.body.password;
  pool.query('UPDATE admin_account SET password = ? WHERE username = ?', [password, username], (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).send('Server error');
      return;
    }
    res.send('Password updated successfully');
  });
});


app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
