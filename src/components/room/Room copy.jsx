// Room.js
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import QRCode from 'qrcode.react';
import { readAndCompressImage } from 'browser-image-resizer';
import styles from './Room.module.css'; // Import CSS module

const Room = () => {
  const { roomId } = useParams();
  const [file, setFile] = useState();
  const [uploadedFileURL, setUploadedFileURL] = useState(null);

  function handleChange(event) {
    const file = event.target.files[0];
    const config = {
      quality: 1,
      maxWidth: 1920,
      maxHeight: 1080,
      autoRotate: true,
    };
    readAndCompressImage(file, config)
      .then(resizedImage => {
        setFile({ blob: resizedImage, name: file.name });
      })
      .catch(err => {
        console.error(err);
      });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append('file', file.blob, file.name);

    fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setUploadedFileURL(data.fileUrl);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.roomTitle}>Welcome to room {roomId}</h1>
      <p className={styles.roomLink}>Room Link: <a href={window.location.href}>{window.location.href}</a></p>
      <QRCode value={window.location.href} /><br />
      <form className={styles.uploadForm} onSubmit={handleSubmit}>
        <h1>Upload File</h1>
        <input type="file" onChange={handleChange} className={styles.fileInput} />
        <button type="submit" className={styles.uploadButton}>Upload</button>
      </form>
      {uploadedFileURL && (
        <div className={styles.uploadedContent}>
          <h2 className={styles.uploadedContentTitle}>Uploaded Content</h2>
          <img src={uploadedFileURL} alt="Uploaded content" className={styles.uploadedImage} />
        </div>
      )}
    </div>
  );
};

export default Room;
