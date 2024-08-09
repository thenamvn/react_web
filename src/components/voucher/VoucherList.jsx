import React, { useEffect, useState, useCallback } from 'react';
import styles from './VoucherList.module.css';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import QrScanner from 'react-qr-scanner';
import QRCode from "qrcode.react";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';

const VoucherList = () => {
    const [vouchers, setVouchers] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [rewardInfo, setRewardInfo] = useState(null);
    const [error, setError] = useState(null);
    const [showQr, setShowQr] = useState(false);
    const [qrData, setQrData] = useState(null);

    useEffect(() => {
        const username = localStorage.getItem("username");
        fetch(`http://localhost:3000/rewards/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                const currentDate = new Date();
                const validVouchers = data.filter(voucher => new Date(voucher.gift_expiration) > currentDate);
                setVouchers(validVouchers);
            })
            .catch((error) => {
                console.error('Error fetching vouchers:', error);
                setError('Failed to load vouchers. Please try again later.');
            });
    }, []);

    const handleError = (err) => {
        console.error("QR Scan Error:", err);
        setError(`QR Scan Error: ${err.message}`);
    };

    const handleScan = (data) => {
        console.log("Scan result:", data);
        if (data) {
            const [roomId, email, gift, used, expiration] = data.text.split('|');
            setRewardInfo({ roomId, email, gift, used, gift_expiration: expiration });
            setScanning(false);
            setShowResult(true);
        }
    };

    const handleScanClick = useCallback(() => setScanning(true), []);

    function handleQrCreate(roomId, userId) {
        fetch(`http://localhost:3000/reward/${roomId}/${userId}`)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Reward not found');
                    }
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const rewardString = `${data.room_id}|${data.username}|${data.gift}|${data.used}|${new Date(data.gift_expiration).toISOString()}`;
                setQrData(rewardString);
                setShowQr(true);
            })
            .catch(err => {
                console.error('Error fetching reward information:', err);
                setError(err.message);
            });
    }
    const handleCloseQr = () => {
        setShowQr(false);
        setQrData(null);
    };

    const handleClose = () => {
        setShowResult(false);
        setRewardInfo(null);
    };

    function handleConfirm(roomId, userId) {
        fetch(`http://localhost:3000/host/delete/reward?room_id=${roomId}&username=${userId}`, {
          method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
          if (data.ok) {
            alert(data.message);
            setRewardInfo(null);
            setShowResult(false);
          } else {
            alert(data.error || data.message);
          }
        })
        .catch(error => {
          console.error('Error deleting reward:', error);
          alert('An error occurred while deleting the reward.');
        });
      }

    return (
        <div className={styles.parentContainer}>
            <div className={styles.voucherList}>
                <div className={styles.voucherScan}>
                    <h2>Scan Voucher</h2>
                    <button onClick={handleScanClick} aria-label="Scan QR Code">
                        <DocumentScannerIcon />
                    </button>
                    {scanning && (
                        <div className={styles.qrScannerContainer}>
                            <QrScanner
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}
                    {error && <p className={styles.error}>{error}</p>}
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {vouchers.map(voucher => (
                    <div key={voucher.room_id} className={styles.voucherItem}>
                        <div className={styles.voucherDetails}>
                            <h3>
                                <CardGiftcardIcon />
                                {' Voucher of ' + voucher.admin_fullname}
                            </h3>
                            <p>Voucher: {voucher.gift}</p>
                            <p>Expiration Date: {new Date(voucher.gift_expiration).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.voucherLink}>
                            <a onClick={() => handleQrCreate(voucher.room_id, voucher.username)}>Use Voucher</a>
                        </div>
                    </div>
                ))}
            </div>
            {showQr && (
                <div className={styles.qrModal}>
                    <div className={styles.qrModalContent}>
                        <span className={styles.closeButton} onClick={handleCloseQr}>&times;</span>
                        <h2>QR Code</h2>
                        {qrData && <div className={styles.qrCode}><QRCode value={qrData} /></div>}
                    </div>
                </div>
            )}
            {showResult && rewardInfo && (
                console.log(rewardInfo),
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <h2 className={styles.popupTitle}>Voucher Confirm</h2>
                        <p className={styles.popupText}>Gift: {rewardInfo.gift}</p>
                        <button className={styles.popupButton} onClick={handleClose}>Close</button>
                        <button className={styles.popupButton} onClick={handleConfirm(rewardInfo.roomId,rewardInfo.email)}>Confirm</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoucherList;