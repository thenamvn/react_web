CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullname VARCHAR(255) NOT NULL
);

CREATE TABLE room (
  id VARCHAR(6) PRIMARY KEY,
  admin_username VARCHAR(255) NOT NULL,
  job_description VARCHAR(255),images
  FOREIGN KEY (admin_username) REFERENCES users(username)
);

CREATE TABLE room_users (
  room_id VARCHAR(6) NOT NULL,
  username VARCHAR(255) NOT NULL,
  PRIMARY KEY (room_id, username),
  FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE,
  FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

CREATE TABLE images (
  image_id INT AUTO_INCREMENT PRIMARY KEY,
  room_id VARCHAR(6) NOT NULL,
  uploader_username VARCHAR(255) NOT NULL,
  image_path VARCHAR(2000) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE,
  FOREIGN KEY (uploader_username) REFERENCES users(username) ON DELETE CASCADE
);

Create Table job (
	room_id varchar(6) not null,
    job_description text
);

select * from users;