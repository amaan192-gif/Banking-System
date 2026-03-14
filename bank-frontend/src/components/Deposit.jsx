import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../api'; // Adjust path if needed

const Deposit = ({ token, accountNumber, onDepositSuccess }) => {
    const [amount, setAmount] = useState('');
    const [msg, setMsg] = useState('');

    const handleDeposit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/account/${accountNumber}/deposit`, 
                { amount: parseFloat(amount) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMsg("Deposit Successful! ✅");
            setAmount('');
            onDepositSuccess(); // This refreshes the dashboard balance
        } catch (err) {
            setMsg("Deposit failed. Check backend.");
        }
    };

    return (
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#28a745', marginTop: 0 }}>Add Funds (ATM)</h3>
            <form onSubmit={handleDeposit} style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="number" 
                    placeholder="Enter amount to deposit" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                    style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
                    required 
                />
                <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                    Deposit
                </button>
            </form>
            {msg && <p style={{ fontSize: '13px', color: '#28a745', marginTop: '10px' }}>{msg}</p>}
        </div>
    );
};

export default Deposit;