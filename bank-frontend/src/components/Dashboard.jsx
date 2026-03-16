import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Copy,
  CheckCircle2,
  Eye,
  EyeOff,
  Search
} from 'lucide-react';
import SetPin from './SetPin';
import Deposit from './Deposit';
import TransferMoney from './TransferMoney';
import BASE_URL from '../api';
import './Dashboard.css';

const Dashboard = ({ token, userName }) => {
    const [profile, setProfile] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [copied, setCopied] = useState(false);
    const [showBalance, setShowBalance] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('ALL');

    const fetchData = async () => {
        try {
            const profileRes = await axios.get(`${BASE_URL}/api/account/my-profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const extractedProfile = profileRes.data.user || profileRes.data.data || profileRes.data;
            setProfile(extractedProfile);

            const historyRes = await axios.get(`${BASE_URL}/api/account/${extractedProfile.accountNumber}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(historyRes.data);
        } catch (err) {
            console.error("Error fetching dashboard data", err);
        }
    };

    // --- LOGIC: CLEAN NAME FORMATTING ---
    const getCleanedName = () => {
        const rawName = userName || profile?.name || profile?.username || "User";
        // Remove all numbers and underscores
        const onlyAlpha = rawName.replace(/[0-9_]/g, '').trim();
        
        if (!onlyAlpha) return "User";
        
        // Format to "Name" (First letter Caps, rest small)
        return onlyAlpha.charAt(0).toUpperCase() + onlyAlpha.slice(1).toLowerCase();
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning😉";
        if (hour < 17) return "Good Afternoon😃";
        return "Good Evening🫡";
    };

    const handleInstantUpdate = (newBalance) => {
        setProfile(prev => ({ ...prev, balance: newBalance }));
        fetchData(); 
    };

    const handleCopyNode = () => {
        if (!profile?.accountNumber) return;
        navigator.clipboard.writeText(profile.accountNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch = 
            tx.senderAccountNumber?.includes(searchTerm) || 
            tx.receiverAccountNumber?.includes(searchTerm);
        
        if (filterType === 'INBOUND') {
            return matchesSearch && tx.receiverAccountNumber === profile.accountNumber;
        }
        if (filterType === 'OUTBOUND') {
            return matchesSearch && tx.senderAccountNumber === profile.accountNumber;
        }
        return matchesSearch;
    });

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
                
                <header className="v-hero-section">
                    <div className="v-balance-info">
                        
                        <div className="mb-4 animate-fade-in-down">
                            <h2 className="text-emerald-500 font-black text-2xl tracking-tight">
                                {getGreeting()}, {getCleanedName()} !
                            </h2>
                            
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <p className="v-label-top">Total Secured Balance</p>
                            <button 
                                onClick={() => setShowBalance(!showBalance)}
                                className="text-gray-500 hover:text-white transition-colors"
                            >
                                {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                        
                        <h1 className="v-main-balance">
                            {showBalance 
                                ? `₹ ${profile.balance?.toLocaleString('en-IN') || '0'}` 
                                : "••••••••"
                            }
                        </h1>

                        <div 
                            className="v-node-badge cursor-pointer hover:bg-white/10 transition-all flex items-center gap-2"
                            onClick={handleCopyNode}
                        >
                            <ShieldCheck size={14} />
                            <span>NODE: {profile.accountNumber}</span>
                            {copied ? (
                                <CheckCircle2 size={12} className="text-emerald-500" />
                            ) : (
                                <Copy size={12} className="text-gray-500" />
                            )}
                        </div>
                    </div>
                </header>

                <hr className="v-divider" />

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
                                currentBalance={profile.balance}
                                onDepositSuccess={handleInstantUpdate} 
                            />
                        </div>
                    </section>
                )}

                <footer className="v-history-section">
                    <div className="v-section-header flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            <History size={18} />
                            <h3>Recent Ledger Activity</h3>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                                <input 
                                    type="text" 
                                    placeholder="Search Node..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white outline-none focus:border-emerald-500/50 transition-all"
                                />
                            </div>
                            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                                {['ALL', 'INBOUND', 'OUTBOUND'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-black transition-all ${filterType === type ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-white'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
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
                                {filteredTransactions.length > 0 ? (
                                    filteredTransactions.map((tx) => (
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
                                                {tx.senderAccountNumber === profile.accountNumber ? '-' : '+'} ₹{tx.amount.toLocaleString('en-IN')}
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
                                        <td colSpan="4" className="v-empty-msg">No transactions found matching your criteria.</td>
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