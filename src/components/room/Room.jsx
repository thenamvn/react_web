// Room.js
import { useParams } from "react-router-dom";
import { useState } from "react";
import QRCode from "qrcode.react";
import { readAndCompressImage } from "browser-image-resizer";
import styles from "./Room.module.css"; // Import CSS module
import { uploadFile } from "../../utils/upload"; // Import the upload function

const Room = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [uploadedFileURLs, setUploadedFileURLs] = useState([]);

  function handleChange(event) {
    const filesArray = Array.from(event.target.files);
    const config = {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 600,
      autoRotate: true,
    };
    Promise.all(filesArray.map((file) => readAndCompressImage(file, config)))
      .then((resizedImages) => {
        // Store the original file names along with the resized images
        setFiles(
          resizedImages.map((blob, i) => ({ blob, name: filesArray[i].name }))
        );
      })
      .catch((err) => {
        console.error("Error in image processing:", err);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!files.length) {
      return;
    }
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file.blob, file.name));
    formData.append('room_id', id); // Assuming room_id is available in this scope
    formData.append('uploader_username', localStorage.getItem('username')); // Assuming uploader_username is available in this scope
  
    // Upload the files
    uploadFile(formData)
      .then((fileUrls) => {
        // Store the image URLs
        setUploadedFileURLs(fileUrls);
      })
      .catch((err) => {
        console.error("Error in file upload:", err);
      });
  }

  return (
    <div className={styles.bg_room}>
      <h1 className={styles.roomTitle}>Welcome to room {id}</h1>
      <div className={styles.roomInfo}>
        <p className={styles.roomLink}>
          Room Link: <a href={window.location.href}>{window.location.href}</a><br />
          Scan QR code to join the room
        </p>
        <QRCode value={window.location.href} />
        <br />
      </div>
      <form className={styles.uploadForm} onSubmit={handleSubmit}>
        <h1>Upload File</h1>
        <input
          type="file"
          onChange={handleChange}
          className={styles.fileInput}
          multiple
        />
        <button type="submit" className={styles.uploadButton}>
          Upload
        </button>
      </form>
      {uploadedFileURLs.length > 0 &&
        uploadedFileURLs.map((url, index) => (
          <div key={index} className={styles.uploadedContent}>
            <h2 className={styles.uploadedContentTitle}>Uploaded Content</h2>
            <img
              src={url}
              alt={`Uploaded content ${index + 1}`}
              className={styles.uploadedImage}
            />
          </div>
        ))}
    </div>
  );
};

export default Room;
