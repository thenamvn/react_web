// Room.js
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { readAndCompressImage } from "browser-image-resizer";
import styles from "./Room.module.css"; // Import CSS module
import { uploadFile } from "../../utils/upload"; // Import the upload function
import PostAddIcon from "@mui/icons-material/PostAdd";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import AddTaskIcon from "@mui/icons-material/AddTask";
import Carousel from "../slideshow/slide";
import PrizePopup from "./popup/Reward";
import RewardForm from "./rewardForm/RewardForm";
import DenyForm from "./popup/DenyForm";

const Room = () => {
  const { id } = useParams();
  const [files, setFiles] = useState([]);
  const [uploadedFileURLs, setUploadedFileURLs] = useState([]);
  const [ShowImages, setShowImages] = useState(true);
  const [showRoomInfo, setShowRoomInfo] = useState(false);
  const [showUploadFormUser, setShowUploadFormUser] = useState(false);
  // Add state variables for the room details, admin status, error, job descriptions, and other necessary data
  const [roomDetails, setRoomDetails] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [jobDescriptions, setJobDescriptions] = useState([]);
  const [showUploadFormAdmin, setShowUploadFormAdmin] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSubmitedForm, setShowSubmitedForm] = useState(false);
  const [submittedUsers, setSubmittedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserFullName, setSelectedUserFullName] = useState("");
  const [selectedUserImages, setSelectedUserImages] = useState([]);

  const [showRewardForm, setShowRewardForm] = useState(false);

  useEffect(() => {
    const fetchRoomDetailsAndResources = async () => {
      try {
        // Fetch room details
        const response = await fetch(`http://localhost:3000/room/${id}/info`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response was not ok: ${response.status} - ${errorText}`
          );
        }
        const data = await response.json();
        setRoomDetails(data);
        const isAdmin = data.admin_username === localStorage.getItem("username");
        setIsAdmin(isAdmin);

        // If admin, fetch submitted users
        if (isAdmin) {
          const submittedUsersResponse = await fetch(`http://localhost:3000/room/${id}/submited`);
          const submittedUsers = await submittedUsersResponse.json();
          setSubmittedUsers(Array.isArray(submittedUsers) ? submittedUsers : []); // Ensure it's an array
        }

        if (!isAdmin) {
          try {
            // Fetch room images
            const imagesResponse = await fetch(`http://localhost:3000/room/${id}/images`);
            const imagesData = await imagesResponse.json();
            setUploadedFileURLs(imagesData);

            // Fetch room jobs
            const jobsResponse = await fetch(`http://localhost:3000/room/${id}/jobs`);
            const jobsData = await jobsResponse.json();
            setJobDescriptions(jobsData);

            // Join room
            const joinRoomResponse = await fetch(`http://localhost:3000/joinroom`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: id,
                username: localStorage.getItem("username"),
              }),
            });
            const joinRoomData = await joinRoomResponse.json();
            console.log("Join room response:", joinRoomData);

          } catch (error) {
            console.error("There was an error during the process:", error);
          }
        }

      } catch (error) {
        console.error("Error fetching room details or resources:", error);
        setError(error.message);
      }
    };

    fetchRoomDetailsAndResources();
  }, [id]);

  function closeMissionUpload() {
    setShowUploadFormAdmin(false);
    setSelectedFiles([]);
  };

  function UserShowUploadForm() {
    setShowUploadFormUser(false);
    setSelectedFiles([]);
    setShowImages(true);
  };
  function UserShowUploadFormAndHiddenImages() {
    setShowUploadFormUser(true);
    setShowImages(false);
  };

  function handleAccept() {
    setShowSubmitedForm(false);
    setShowRewardForm(true);
  }

  function handleCloseSubmitedImages() {
    setShowRewardForm(false);
  }

  function handleDeny(username) {
    console.log("Denying user:", username, "in room:", id);

    fetch(`http://localhost:3000/denyjob`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        room_id: id,
        username: username
      })
    })
      .then(response => {
        if (!response.ok) {
          console.error('Network response was not ok:', response.statusText);
        }
        return response.json();
      })

    fetch(`http://localhost:3000/deny/user/${username}/room/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        setSubmittedUsers(prevUsers => prevUsers.filter(user => user.username !== username));
        setShowSubmitedForm(false);
      })
      .catch(error => {
        console.error('There was an error denying the user!', error);
      });
  }

  async function handleUserClick(userId, fullname) {
    const room_id = id;

    try {
      const response = await fetch(`http://localhost:3000/room/${room_id}/userimages?username=${userId}`);
      const imagesData = await response.json();
      setSelectedUserImages(imagesData);
      setSelectedUser(userId);
      setSelectedUserFullName(fullname);
      setShowSubmitedForm(true);
    } catch (error) {
      console.error('Error fetching user images:', error);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 1000);
  }

  function handleChange(event) {
    const filesArray = Array.from(event.target.files);
    setSelectedFiles(filesArray);
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
    setSelectedFiles([]);
    const formData = new FormData();
    files.forEach((file) => formData.append("file", file.blob, file.name));
    formData.append("room_id", id); // Assuming room_id is available in this scope
    formData.append("uploader_username", localStorage.getItem("username")); // Assuming uploader_username is available in this scope

    // Upload the files
    uploadFile(formData)
      .then((fileUrls) => {
        // Store the image URLs if is admin
        if (isAdmin) {
          setUploadedFileURLs(fileUrls);
        }
      })
      .catch((err) => {
        console.error("Error in file upload:", err);
      });


    if (isAdmin) {

      // upload job description from text area
      const job = { room_id: id, job: document.getElementById("jobDescription").value, job_owner: localStorage.getItem("username") };
      console.log("Job to upload:", job);

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
          alert("Job uploaded successfully");
          setShowUploadFormAdmin(false);
        })
        .catch((error) => {
          console.error("Error uploading job:", error);
        });
    } else {

      fetch("http://localhost:3000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          username: localStorage.getItem("username"),
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Submitted successfully:", data);
          alert("Submitted successfully");
          setShowUploadFormUser(false);
          setShowImages(true);
        })
        .catch((error) => {
          console.error("Error submitting:", error);
        });
    }
  }



  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!roomDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.bg_room}>
      <div className={styles.room}>
        {isAdmin ? (
          <>
            {/* Admin view */}
            <div className={styles.adminView}>
              <button
                className={styles.shareButton}
                onClick={() => setShowRoomInfo(true)}
              >
                Share
              </button>
              <button
                className={styles.uploadButton}
                onClick={() => setShowUploadFormAdmin(true)}
              >
                <PostAddIcon />
              </button>
            </div>
            {/* Leaderboard */}
            <div className={styles.leaderboard}>
              <h2>Submited Users</h2>
              <div className={styles.leaderboardHeader}>
                <ul>
                  {submittedUsers.map((user, index) => (
                    <li key={index} onClick={() => handleUserClick(user.username, user.fullname)}>
                      <span>{user.fullname}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
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
                <button
                  className={styles.copyButton}
                  onClick={() => copyToClipboard(window.location.href)}
                >
                  Copy Link
                </button>
                {showTooltip && (
                  <span className={styles.tooltip}>Copied to Clipboard!</span>
                )}
              </div>
            )}
            {showUploadFormAdmin && ( // Use the state variable to conditionally render this form
              <form className={styles.uploadForm} onSubmit={handleSubmit}>
                <h1>Misson Upload</h1>
                <button // Close button to hide the form
                  className={styles.closeButton}
                  onClick={closeMissionUpload}
                >
                  <CloseIcon />
                </button>
                <div className={styles.fileUploadContainer}>
                  <input
                    type="file"
                    onChange={handleChange}
                    className={styles.fileInput}
                    multiple
                    id="fileInput"
                    style={{ display: "none" }} // Hide the actual input
                  />
                  <label htmlFor="fileInput" className={styles.fileInputLabel}>
                    <i className="fas fa-upload"></i> Upload Files
                  </label>
                  {selectedFiles.length > 0 && (
                    <div className={styles.fileDetails}>
                      {selectedFiles.length} file(s) selected
                    </div>
                  )}
                </div>
                <br />
                <textarea
                  id="jobDescription"
                  placeholder="Description"
                  className={styles.descriptionInput}
                />
                <br />
                <button type="submit" className={styles.shareButton}>
                  <SendIcon />
                </button>
              </form>
            )}

            {showRewardForm &&
              <RewardForm username={selectedUser} room_id={id} onClose={handleCloseSubmitedImages} />
            }

            {showSubmitedForm && (
              <div className={styles.uploadedImagesForm}>
                <button
                  className={styles.closeButton}
                  onClick={() => setShowSubmitedForm(false)}
                >
                  X
                </button>
                <div className={styles.SubmitedFormHeader}>
                  <h2>{selectedUserFullName}</h2>
                  <h3>{selectedUser}</h3>
                </div>
                <Carousel data={selectedUserImages} />
                <div className={styles.buttonContainer}>
                  <button
                    className={styles.acceptButton}
                    onClick={() => handleAccept()}
                  >
                    Accept
                  </button>
                  <button
                    className={styles.denyButton}
                    onClick={() => handleDeny(selectedUser)}
                  >
                    Deny
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className={styles.nonAdminView}>
            <PrizePopup room_id={id} username={localStorage.getItem('username')} />
            <DenyForm username={localStorage.getItem("username")} room_id={id} />
            {/* Non-admin view */}
            <button
              className={styles.uploadButton}
              onClick={UserShowUploadFormAndHiddenImages}
            >
              <AddTaskIcon />
            </button>
            {showUploadFormUser && (
              <form className={styles.uploadForm} onSubmit={handleSubmit}>
                <h1>Submit Job</h1>
                <div className={styles.fileUploadContainer}>
                  <input
                    type="file"
                    onChange={handleChange}
                    className={styles.fileInput}
                    multiple
                    id="fileInput"
                    style={{ display: "none" }} // Hide the actual input
                  />
                  <label htmlFor="fileInput" className={styles.fileInputLabel}>
                    <i className="fas fa-upload"></i> Upload Files
                  </label><br />
                  {selectedFiles.length > 0 && (
                    <div className={styles.fileDetails}>
                      {selectedFiles.length} file(s) selected
                    </div>
                  )}
                </div>
                <button
                  className={styles.closeButton}
                  onClick={UserShowUploadForm}
                >
                  <CloseIcon />
                </button>
                <br />
                <button type="submit" className={styles.shareButton}>
                  <SendIcon />
                </button>
              </form>
            )}
            <div className={styles.missionDiv}>
              <h2>Your mission:</h2>
              {jobDescriptions.map((job, index) => (
                <div key={index}>
                  <p>{job.job_description}</p>
                </div>
              ))}
            </div>
            {ShowImages && (
              <div className={styles.ImagesForm}>
                {uploadedFileURLs.length > 0 && (
                  <div className={styles.uploadedImagesForm}>
                    <Carousel data={uploadedFileURLs} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* Message for non-admins when no content is available */}
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
    </div>
  );
};

export default Room;
