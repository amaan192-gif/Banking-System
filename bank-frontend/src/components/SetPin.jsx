import { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, LockKeyhole, Fingerprint } from 'lucide-react';
import BASE_URL from '../api';
import './SetPin.css';

const SetPin = ({ token, onPinCreated }) => {
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSetPin = async (e) => {
        e.preventDefault();
        if (pin !== confirmPin) return alert("Security Error: PINs do not match!");
        if (pin.length !== 4) return alert("Validation Error: PIN must be exactly 4 digits");

        setLoading(true);
        try {
            await axios.post(`${BASE_URL}/api/account/set-pin`, 
                { pin }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Using a simple alert for now to keep your logic, 
            // but the UI will refresh automatically via onPinCreated
            onPinCreated(); 
        } catch (err) {
            alert("System Error: " + (err.response?.data || "Server unreachable"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="v-pin-card">
            <div className="v-pin-header">
                <div className="v-shield-icon">
                    <ShieldCheck size={32} />
                </div>
                <h2>Secure Your Node</h2>
                <p>Initialize your 4-digit transaction PIN to enable outbound transfers and secure your assets.</p>
            </div>

            <form onSubmit={handleSetPin} className="v-pin-form">
                <div className="v-input-container">
                    <LockKeyhole className="v-field-icon" size={18} />
                    <input 
                        type="password" 
                        placeholder="Create 4-Digit PIN" 
                        maxLength="4" 
                        pattern="\d*"
                        inputMode="numeric"
                        onChange={(e) => setPin(e.target.value)} 
                        className="v-pin-input"
                        required 
                    />
                </div>

                <div className="v-input-container">
                    <Fingerprint className="v-field-icon" size={18} />
                    <input 
                        type="password" 
                        placeholder="Confirm Security PIN" 
                        maxLength="4" 
                        pattern="\d*"
                        inputMode="numeric"
                        onChange={(e) => setConfirmPin(e.target.value)} 
                        className="v-pin-input"
                        required 
                    />
                </div>

                <button type="submit" className="v-pin-btn" disabled={loading}>
                    {loading ? "Initializing Security..." : "Create Security PIN"}
                </button>
            </form>

            <div className="v-pin-footer">
                <p>🔒 End-to-end encrypted security protocol active.</p>
            </div>
        </div>
    );
};

export default SetPin;