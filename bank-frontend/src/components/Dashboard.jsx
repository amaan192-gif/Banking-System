import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  LayoutDashboard,
  Wallet 
} from 'lucide-react';
import SetPin from './SetPin';
import Deposit from './Deposit';
import TransferMoney from './TransferMoney';
import BASE_URL from '../api';
import './Dashboard.css';

const Dashboard = ({ token }) => {
    const [profile, setProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);

    const fetchData = async () => {
        try {
            const profileRes = await axios.get(`${BASE_URL}/api/account/my-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(profileRes.data);

            const historyRes = await axios.get(`${BASE_URL}/api/account/${profileRes.data.accountNumber}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(historyRes.data);
        } catch (err) {
            console.error("Error fetching dashboard data", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    if (!profile) return (
        <div className="v-loader-wrapper">
            <div className="v-spinner"></div>
            <p>Accessing Secure Node...</p>
        </div>
    );

    return (
        <div className="v-dashboard-container">
            <div className="v-dashboard-content">
                
                {/* HERO: NEAT BALANCE SECTION */}
                <header className="v-hero-section">
                    <div className="v-balance-info">
                        <p className="v-label-top">Total Secured Balance</p>
                        <h1 className="v-main-balance">
                            ₹ {profile.balance.toLocaleString('en-IN')}
                        </h1>
                        <div className="v-node-badge">
                            <ShieldCheck size={14} />
                            <span>NODE: {profile.accountNumber}</span>
                        </div>
                    </div>
                </header>

                <hr className="v-divider" />

                {/* THE SECURITY GATEKEEPER */}
                {!profile.hasPin ? (
                    <section className="v-pin-setup-container animate-fade-in">
                        <SetPin token={token} onPinCreated={fetchData} />
                    </section>
                ) : (
                    <section className="v-actions-grid animate-fade-in">
                        <div className="v-action-module">
                            <TransferMoney 
                                token={token} 
                                senderAccount={profile.accountNumber} 
                                onTransferSuccess={fetchData} 
                            />
                        </div>
                        <div className="v-action-module">
                            <Deposit 
                                token={token} 
                                accountNumber={profile.accountNumber} 
                                onDepositSuccess={fetchData} 
                            />
                        </div>
                    </section>
                )}

                {/* TRANSACTION LEDGER */}
                <footer className="v-history-section">
                    <div className="v-section-header">
                        <History size={18} />
                        <h3>Recent Ledger Activity</h3>
                    </div>

                    <div className="v-table-glass">
                        <table className="v-transaction-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Activity Details</th>
                                    <th>Volume</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <tr key={tx.id} className="v-row-hover">
                                            <td className="v-td-date">
                                                {new Date(tx.timestamp).toLocaleDateString(undefined, {
                                                  day: '2-digit', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td className="v-td-desc">
                                                {tx.senderAccountNumber === profile.accountNumber 
                                                    ? <span className="v-out-tag"><ArrowUpRight size={12}/> Outbound: {tx.receiverAccountNumber}</span> 
                                                    : <span className="v-in-tag"><ArrowDownLeft size={12}/> Inbound: {tx.senderAccountNumber}</span>}
                                            </td>
                                            <td className={`v-td-amt ${tx.senderAccountNumber === profile.accountNumber ? 'neg' : 'pos'}`}>
                                                {tx.senderAccountNumber === profile.accountNumber ? '-' : '+'} ₹{tx.amount.toLocaleString()}
                                            </td>
                                            <td className="v-td-status">
                                                <span className={`v-status-dot ${(tx.status || 'pending').toLowerCase()}`}>
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="v-empty-msg">No transactions found in this node.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Dashboard;