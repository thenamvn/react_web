// Room.js
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { readAndCompressImage } from "browser-image-resizer";
import styles from "./Room.module.css"; // Import CSS module
import { uploadFile } from "../../utils/upload"; // Import the upload function
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Room = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [uploadedFileURLs, setUploadedFileURLs] = useState([]);
  const [isSliderVisible, setIsSliderVisible] = useState(true);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [showUploadFormUser, setShowUploadFormUser] = useState(false);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [jobDescriptions, setJobDescriptions] = useState([]);

  useEffect(() => {
    // Fetch room details from the backend
    fetch(`http://localhost:3000/room/${id}`)
      .then(async (response) => {
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response was not ok: ${response.status} - ${errorText}`
          );
        }
        return response.json();
      })
      .then((data) => {
        setRoomDetails(data);
        setIsAdmin(data.admin_username === localStorage.getItem("username"));
      })
      .catch((error) => {
        console.error("Error fetching room details:", error);
        setError(error.message);
      });
  }, [id]);

  useEffect(() => {
    // Only fetch images if the current user is not an admin
    if (!isAdmin) {
      // Fetch images for the room
      fetch(`http://localhost:3000/room/${id}/images`)
        .then((response) => response.json())
        .then((data) => {
          setUploadedFileURLs(data.map((image) => image.image_path));
        })
        .catch((error) => {
          console.error("Error fetching images:", error);
        });

      // Fetch job description for the room
      fetch(`http://localhost:3000/room/${id}/jobs`)
        .then((response) => response.json())
        .then((data) => {
          setJobDescriptions(data);
        })
        .catch((error) => {
          console.error("Error fetching job description:", error);
        });
    }
  }, [id, isAdmin]);

  function handleChange(event) {
    const filesArray = Array.from(event.target.files);
    const config = {
      quality: 0.75,
      maxWidth: 1920,
      maxHeight: 1080,
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
    formData.append("room_id", id); // Assuming room_id is available in this scope
    formData.append("uploader_username", localStorage.getItem("username")); // Assuming uploader_username is available in this scope

    // Upload the files
    uploadFile(formData)
      .then((fileUrls) => {
        // Store the image URLs
        setUploadedFileURLs(fileUrls);
      })
      .catch((err) => {
        console.error("Error in file upload:", err);
      });

    // upload job description from text area
    const description = event.target[1].value;
    const job = { room_id: id, job: description };
    fetch("http://localhost:3000/upload_job", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Job uploaded successfully:", data);
      })
      .catch((error) => {
        console.error("Error uploading job:", error);
      });
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!roomDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.bg_room}>
      <h1 className={styles.roomTitle}>Welcome to room {id}</h1>
      {isAdmin ? (
        <>
          <button
            className={styles.shareButton}
            onClick={() => setShowRoomInfo(true)}
          >
            Share
          </button>
          {showRoomInfo && (
            <div className={styles.roomInfo}>
              <button
                className={styles.closeButton}
                onClick={() => setShowRoomInfo(false)}
              >
                X
              </button>
              <br />
              <p className={styles.roomLink}>
                Room Link:{" "}
                <a href={window.location.href}>{window.location.href}</a>
                <br />
                Scan QR code to join the room
              </p>
              <br />
              <div className={styles.qrCode}>
                <QRCode value={window.location.href} />
              </div>
              <br />
            </div>
          )}
          <form className={styles.uploadForm} onSubmit={handleSubmit}>
            <h1>Game Upload</h1>
            <input
              type="file"
              onChange={handleChange}
              className={styles.fileInput}
              multiple
            />
            <br />
            <textarea
              placeholder="Description"
              className={styles.descriptionInput}
            />
            <br />
            <button type="submit" className={styles.uploadButton}>
              Upload
            </button>
          </form>
        </>
      ) : (
        <div className={styles.nonAdminView}>
          <button
            className={styles.shareButton}
            onClick={() => setShowUploadFormUser(true)}
          >
            Submit Job
          </button>
          {showUploadFormUser && (
            <form className={styles.uploadForm} onSubmit={handleSubmit}>
              <h1>Submit Job</h1>
              <input
                type="file"
                onChange={handleChange}
                className={styles.fileInput}
                multiple
              />
              <button
                className={styles.closeButton}
                onClick={() => setShowUploadFormUser(false)}
              >
                X
              </button>
              <br />
              <button type="submit" className={styles.uploadButton}>
                Submit
              </button>
            </form>
          )}

          <h2>Your mission:</h2>
          {jobDescriptions.map((job, index) => (
            <div key={index}>
              <p>{job.job_description}</p>
            </div>
          ))}
        </div>
      )}
      {uploadedFileURLs.length > 0 && (
        <div className={styles.sliderContainer}>
          {isAdmin && (
            <button
              className={styles.uploadButton}
              onClick={() => setIsSliderVisible(!isSliderVisible)}
            >
              {isSliderVisible ? "Hide" : "Show"} Slider
            </button>
          )}
          {(isAdmin ? isSliderVisible : true) && (
            <Slider
              {...{
                dots: true,
                infinite: uploadedFileURLs.length > 1,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
                responsive: [
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      infinite: true,
                      dots: true,
                    },
                  },
                  {
                    breakpoint: 600,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      initialSlide: 1,
                    },
                  },
                  {
                    breakpoint: 480,
                    settings: {
                      slidesToShow: 1,
                      slidesToScroll: 1,
                    },
                  },
                ],
              }}
            >
              {uploadedFileURLs.map((url, index) => (
                <div key={index}>
                  <img
                    src={url}
                    alt={`Uploaded content ${index + 1}`}
                    className={styles.uploadedImage}
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>
      )}

      {!isAdmin && uploadedFileURLs.length === 0 && (
        <div className={styles.noContentMessage}>
          <p>No content has been shared in this room yet.</p>
          <p>
            Please check back later or ask the room admin to upload some
            content.
          </p>
        </div>
      )}
    </div>
  );
};

export default Room;
