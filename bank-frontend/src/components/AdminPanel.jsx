import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../api'; // Adjust path if needed

const AdminPanel = ({ token }) => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [message, setMessage] = useState('');

    const fetchPending = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/admin/pending-deposits`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(res.data);
        } catch (err) {
            console.error("Error fetching admin data", err);
        }
    };

    useEffect(() => {
        fetchPending();
    }, [token]);

    const handleApprove = async (id) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/admin/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(res.data);
            fetchPending(); // Refresh the list
        } catch (err) {
            setMessage("Approval failed.");
        }
    };

    // 1. Add this function inside your AdminPanel component
const handleReject = async (id) => {
    if(!window.confirm("Are you sure you want to REJECT this deposit?")) return;
    
    try {
        const res = await axios.post(`${BASE_URL}/api/admin/reject/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessage(res.data);
        fetchPending(); // Refresh list
    } catch (err) {
        setMessage("Rejection failed.");
    }
};

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
            <h2 style={{ color: '#004085' }}>Manager Approval Portal</h2>
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
            
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                        <th style={{ padding: '12px' }}>Account Number</th>
                        <th style={{ padding: '12px' }}>Amount</th>
                        <th style={{ padding: '12px' }}>Date</th>
                        <th style={{ padding: '12px' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pendingRequests.length > 0 ? (
                        pendingRequests.map((req) => (
                            <tr key={req.id} style={{ borderTop: '1px solid #eee' }}>
                                <td style={{ padding: '12px' }}>{req.receiverAccountNumber}</td>
                                <td style={{ padding: '12px' }}>₹{req.amount}</td>
                                <td style={{ padding: '12px' }}>{new Date(req.timestamp).toLocaleString()}</td>
                                <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                                    <button 
                                        onClick={() => handleApprove(req.id)}
                                        style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Approve
                                    </button>
                                    <button 
                                        onClick={() => handleReject(req.id)}
                                        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No pending deposit requests.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;