import { useEffect, useState } from 'react';
import axios from 'axios';
import BASE_URL from '../api'; 
import { CheckCircle, XCircle, Clock, Hash, IndianRupee, Search, Wallet } from 'lucide-react';

const AdminPanel = ({ token }) => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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

    // Calculate Total Pending Amount
    const totalPendingAmount = pendingRequests.reduce((sum, req) => sum + Number(req.amount), 0);

    // Filter Logic for Search Bar
    const filteredRequests = pendingRequests.filter(req => 
        req.receiverAccountNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleApprove = async (id) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/admin/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: res.data, type: 'success' });
            fetchPending();
        } catch (err) {
            setMessage({ text: "Approval failed.", type: 'error' });
        }
    };

    const handleReject = async (id) => {
        if(!window.confirm("Are you sure you want to REJECT this deposit?")) return;
        
        try {
            const res = await axios.post(`${BASE_URL}/api/admin/reject/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: res.data, type: 'success' });
            fetchPending();
        } catch (err) {
            setMessage({ text: "Rejection failed.", type: 'error' });
        }
    };

    return (
        <div className="v-admin-container">
            {/* Statistics Row */}
            <div className="v-admin-stats">
                <div className="v-stat-card">
                    <div className="v-stat-icon blue"><Clock size={20}/></div>
                    <div className="v-stat-info">
                        <span className="v-stat-label">Pending Requests</span>
                        <span className="v-stat-value">{pendingRequests.length}</span>
                    </div>
                </div>
                <div className="v-stat-card">
                    <div className="v-stat-icon green"><Wallet size={20}/></div>
                    <div className="v-stat-info">
                        <span className="v-stat-label">Total Volume</span>
                        <span className="v-stat-value">₹{totalPendingAmount.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            <header className="v-admin-header">
                <div className="v-title-stack">
                    <h2>Manager Approval Portal</h2>
                    <p>Authorize or decline incoming deposit transactions</p>
                </div>
                
                {/* Search Bar */}
                <div className="v-search-wrapper">
                    <Search size={16} className="v-search-icon" />
                    <input 
                        type="text" 
                        placeholder="Search Account No..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="v-search-input"
                    />
                </div>
            </header>

            {message && (
                <div className={`v-alert ${message.type === 'success' ? 'v-success' : 'v-error'}`}>
                    {message.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    {message.text}
                </div>
            )}
            
            <div className="v-table-wrapper">
                <table className="v-custom-table">
                    <thead>
                        <tr>
                            <th><div className="th-flex"><Hash size={14}/> Account</div></th>
                            <th><div className="th-flex"><IndianRupee size={14}/> Amount</div></th>
                            <th><div className="th-flex"><Clock size={14}/> Timestamp</div></th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRequests.length > 0 ? (
                            filteredRequests.map((req) => (
                                <tr key={req.id}>
                                    <td className="v-acc-cell">{req.receiverAccountNumber}</td>
                                    <td className="v-amount-cell">₹{req.amount.toLocaleString('en-IN')}</td>
                                    <td className="v-date-cell">
                                        {new Date(req.timestamp).toLocaleDateString()}
                                        <span>{new Date(req.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                    </td>
                                    <td>
                                        <div className="v-action-group">
                                            <button onClick={() => handleApprove(req.id)} className="v-btn-approve">
                                                <CheckCircle size={16} /> Approve
                                            </button>
                                            <button onClick={() => handleReject(req.id)} className="v-btn-reject">
                                                <XCircle size={16} /> Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="v-empty-state">
                                    <div className="v-empty-icon">{searchTerm ? "🔍" : "✓"}</div>
                                    <p>{searchTerm ? `No results for "${searchTerm}"` : "No pending deposit requests."}</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPanel;