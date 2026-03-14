import { useState } from 'react';
import { ShieldCheck, Lock, X } from 'lucide-react';
import './PinModal.css';

const PinModal = ({ onConfirm, onCancel, amount, receiver }) => {
    const [pin, setPin] = useState('');

    return (
        <div className="v-modal-overlay">
            <div className="v-modal-card">
                {/* Close Button */}
                <button className="v-modal-close" onClick={onCancel}>
                    <X size={20} />
                </button>

                {/* Header Icon */}
                <div className="v-modal-icon-shield">
                    <ShieldCheck size={32} />
                </div>

                <div className="v-modal-header">
                    <h3>Security Verification</h3>
                    <p>Authorize transaction of</p>
                    <div className="v-modal-amount-display">
                        ₹{parseFloat(amount).toLocaleString('en-IN')}
                    </div>
                    <p className="v-modal-recipient">
                        Recipient: <span>{receiver}</span>
                    </p>
                </div>

                <div className="v-modal-body">
                    <div className="v-pin-input-group">
                        <Lock size={16} className="v-pin-lock-icon" />
                        <input 
                            type="password" 
                            maxLength="4" 
                            placeholder="••••"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="v-modal-pin-field"
                            autoFocus
                            inputMode="numeric"
                            pattern="\d*"
                        />
                    </div>
                </div>

                <div className="v-modal-footer">
                    <button 
                        onClick={() => onConfirm(pin)} 
                        className="v-confirm-pay-btn"
                        disabled={pin.length < 4}
                    >
                        Confirm Payment
                    </button>
                    <button onClick={onCancel} className="v-cancel-pay-btn">
                        Abort
                    </button>
                </div>
                
                <p className="v-secure-note">
                    Secure 256-bit Encrypted Transaction
                </p>
            </div>
        </div>
    );
};

export default PinModal;