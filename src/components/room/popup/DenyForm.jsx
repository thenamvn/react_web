import React, { useEffect, useState } from 'react';
import styles from './Reward.module.css';

const DenyForm = ({ username, room_id }) => {
    const [isOpenDeny, setIsOpenDeny] = useState(false);

    const handleClose = () => {
        fetch(`http://localhost:3000/deletedeny/${room_id}/${username}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                console.log('Reward deleted successfully');
            })
            .catch((error) => {
                console.error('Error deleting reward:', error);
            });
        setIsOpenDeny(false);
    };

    useEffect(() => {
        const fetchDenyCheck = async () => {
            try {
                const username = localStorage.getItem("username");
                const denyCheckResponse = await fetch(`http://localhost:3000/denycheck/${room_id}/${username}`);
                const denyCheckData = await denyCheckResponse.json();
                console.log("Deny check response:", denyCheckData);
                if (denyCheckData.message === 'Denied') {
                    console.log("User denied in this room");
                    setIsOpenDeny(true);
                }
            } catch (error) {
                console.error('Error fetching deny check:', error);
            }
        };

        fetchDenyCheck();
    }, [room_id, username]);

    return (
        <>
            {isOpenDeny && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h2 className={styles.popupTitle}>Sorry!</h2>
                        <p className={styles.popupText}>Unfortunately, your submission did not meet the host's requirements.</p>
                        <button className={styles.popupButton} onClick={handleClose}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default DenyForm;