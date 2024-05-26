// Room.js
import { useParams } from "react-router-dom";
import { useState } from "react";
import QRCode from "qrcode.react";
import { readAndCompressImage } from "browser-image-resizer";
import styles from "./Room.module.css"; // Import CSS module

const Room = () => {
  const { roomId } = useParams();
  const [files, setFiles] = useState();
  const [uploadedFileURLs, setUploadedFileURLs] = useState([]);

  function handleChange(event) {
    const files = Array.from(event.target.files);
    const config = {
      quality: 0.7,
      maxWidth: 800,
      maxHeight: 600,
      autoRotate: true,
    };
    Promise.all(files.map((file) => readAndCompressImage(file, config)))
      .then((resizedImages) => {
        // Store the original file names along with the resized images
        setFiles(
          resizedImages.map((blob, i) => ({ blob, name: files[i].name }))
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!files.length) {
      return;
    }
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file.blob, file.name));

    // Upload the files
    fetch('http://localhost:3000/upload', {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Store the image URLs
        setUploadedFileURLs(data.fileUrls);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.roomTitle}>Welcome to room {roomId}</h1>
      <p className={styles.roomLink}>
        Room Link: <a href={window.location.href}>{window.location.href}</a>
      </p>
      <QRCode value={window.location.href} />
      <br />
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
      {uploadedFileURLs &&
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
