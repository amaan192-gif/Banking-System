import { useState } from 'react';
import axios from 'axios';
import { SendHorizontal, UserCircle2, IndianRupee } from 'lucide-react';
import BASE_URL from '../api';
import PinModal from './PinModal';
import './TransferMoney.css';

const TransferMoney = ({ token, senderAccount, onTransferSuccess }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);

    // This function only OPENS the modal
    const handleTriggerPin = (e) => {
        e.preventDefault();
        setMessage(''); 
        setShowPinModal(true); 
    };

    // This function actually SENDS the money to the Backend
    const processFinalTransfer = async (enteredPin) => {
        try {
            await axios.post(`${BASE_URL}/api/account/transfer`, {
                senderAccountNumber: senderAccount,
                receiverAccountNumber: recipient,
                amount: parseFloat(amount),
                pin: enteredPin 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("Transfer Successful! ✅");
            setRecipient('');
            setAmount('');
            setShowPinModal(false); 
            onTransferSuccess(); 
        } catch (err) {
            setShowPinModal(false); 
            setMessage(err.response?.data || "Transfer Failed. Check PIN or details.");
        }
    };

    return (
        <div className="v-transfer-container">
            <div className="v-card-header">
                <div className="v-icon-glow">
                    <SendHorizontal size={20} />
                </div>
                <h3>Secure Transfer</h3>
            </div>

            <form onSubmit={handleTriggerPin} className="v-transfer-form">
                <div className="v-input-field">
                    <label>Recipient Node ID</label>
                    <div className="v-input-wrapper">
                        <UserCircle2 size={18} className="v-field-icon" />
                        <input 
                            type="text" 
                            value={recipient} 
                            onChange={(e) => setRecipient(e.target.value.trim())} 
                            placeholder="VEXA-XXXXX" 
                            required 
                        />
                    </div>
                </div>

                <div className="v-input-field">
                    <label>Transaction Volume</label>
                    <div className="v-input-wrapper">
                        <IndianRupee size={18} className="v-field-icon" />
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            placeholder="0.00" 
                            required 
                        />
                    </div>
                </div>

                <button type="submit" className="v-transfer-submit">
                    Initiate Transfer
                </button>
            </form>

            {/* Logic to show the PIN Modal */}
            {showPinModal && (
                <PinModal 
                    amount={amount} 
                    receiver={recipient} 
                    onConfirm={processFinalTransfer} 
                    onCancel={() => setShowPinModal(false)} 
                />
            )}

            {message && (
                <div className={`v-transfer-alert ${message.includes('Successful') ? 'v-success' : 'v-error'}`}>
                    {message}
                </div>
            )}
        </div>
    );
};

export default TransferMoney;