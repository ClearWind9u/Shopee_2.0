import axios from "axios";
import React, { useContext,useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import Notification from "../Notification/Notification";
import { QRCodeCanvas } from "qrcode.react";
import "../Wallet/Wallet.css";
import API_BASE_URL from "../../config";
const Wallet = () => {
    const { user, token } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [notification, setNotification] = useState(null);
    const [balance, setBalance] = useState(0);
    const [showQRModal, setShowQRModal] = useState(false);
    const [transactionInfo, setTransactionInfo] = useState(null);
    const [error, setError] = useState(null);
      const [success, setSuccess] = useState(null);
    // Fetch balance for the logged-in user
    useEffect(() => {
        if (user?.id) {
          fetchBalance(user.id);
        }
      }, [user?.id]);
    const fetchBalance = async () =>  {
        try {
            const response = await axios.get(`${API_BASE_URL}/user/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            console.log("Fetch profile response:", response.data);
      
            const userData = response.data;
            setBalance(parseInt(userData['balance']))
            
          } catch (err) {
            console.error("Fetch profile error:", err.response || err);
            setError("Không thể lấy thông tin hồ sơ");
          }
    }

    const showNotification = (message) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddFunds = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setAmount("");
    };

    const handleConfirmAddFunds = () => {
        const newAmount = parseInt(amount);
        if (!isNaN(newAmount) && newAmount > 0) {
            setTransactionInfo({
                amount: newAmount,
                transactionId: `TXN-${Date.now()}`,
                bankInfo: {
                    accountNumber: "0004106868688006",
                    accountHolder: "TRƯỜNG ĐẠI HỌC BÁCH KHOA",
                    bankName: "OCB Bank - Orient Commercial Bank",
                },
            });
            setShowQRModal(true);
            handleCloseModal();
        }
    };

    const handleConfirmTransaction = async () => {
        if (transactionInfo) {
            try { 
                console.log(transactionInfo.amount)
                let newBalance = balance + parseInt(transactionInfo.amount)
                const formData = new FormData();
                let inp = newBalance.toString();
                console.log(inp)
                formData.append("balance" , toString(parseFloat(newBalance)))
                const response = await axios.post(
                    `${API_BASE_URL}/user/update-balance`,{
                        "balance" :  inp
                    },
                    {
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                    } 
                );
                if (response.status === 200) {
                    console.log(response)
                    setBalance(parseInt(response.data.user.balance));
                    showNotification(`Successfully added ${transactionInfo.amount} VNĐ to your wallet.`);
                }
            } catch (error) {
                if (error.response) {
                    alert(error.response.data.message);
                } else {
                    console.error("Error completing transaction:", error);
                }
            }
            handleCloseQRModal();
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") handleConfirmAddFunds();
    };

    const handleCloseQRModal = () => {
        setShowQRModal(false);
        setTransactionInfo(null);
    };

    return (
        <div className="wallet">
            <h2 style={{ textAlign: 'center' }}>Ví của tôi</h2>

            <div className="wallet-content">
                <div className="balance-section d-flex justify-content-between align-items-center">
                    <div className="balance-info">
                        <h4>Số dư của bạn</h4>
                        <p className="balance-amount">{balance} VNĐ</p>
                    </div>
                    <button className="btn btn-secondary blue-btn" onClick={handleAddFunds}>Nạp tiền</button>
                </div>
                {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Nhập số tiền cần nạp (VNĐ)</h3>
                        <input
                            type="number"
                            className="form-control amount-input"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            min="1000"
                            step="1000"
                            onKeyDown={handleKeyDown}
                        />
                        <div className="modal-buttons">
                            <button className="btn red-btn" onClick={handleCloseModal}>Hủy bỏ</button>
                            <button className="btn blue-btn" onClick={handleConfirmAddFunds}>Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}

            {showQRModal && transactionInfo && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Transaction QR Code</h3>
                        <div className="row">
                            <div className="col-md-6 text-center">
                                <QRCodeCanvas
                                    value={JSON.stringify({
                                        transactionId: transactionInfo.transactionId,
                                        amount: transactionInfo.amount,
                                        bankInfo: transactionInfo.bankInfo,
                                    })}
                                    size={200}
                                    includeMargin={true}
                                />
                            </div>
                            <div className="col-md-6 text-start">
                                <p><strong>STK:</strong> {transactionInfo.bankInfo.accountNumber}</p>
                                <p><strong>Chủ tài khoản:</strong> {transactionInfo.bankInfo.accountHolder}</p>
                                <p><strong>Ngân hàng:</strong> {transactionInfo.bankInfo.bankName}</p>
                                <p><strong>Số tiền:</strong> {transactionInfo.amount.toLocaleString()} VNĐ</p>
                            </div>
                        </div>
                        <p className="mt-3">
                            Quét mã QR trên để thanh toán.
                        </p>
                        <div className="modal-buttons text-center">
                            <button className="btn red-btn me-2" onClick={handleCloseQRModal}>Cancel</button>
                            <button className="btn blue-btn" onClick={handleConfirmTransaction}>OK</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;