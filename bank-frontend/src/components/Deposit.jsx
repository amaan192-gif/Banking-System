import { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../api';
import { ArrowDownLeft, IndianRupee, Loader2, Plus } from 'lucide-react';

const Deposit = ({ token, accountNumber, onDepositSuccess, currentBalance }) => {
    const [amount, setAmount] = useState('');
    const [msg, setMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Feature 5: Quick-Add Logic
    const quickAmounts = [100, 500, 1000, 5000];

    const addAmount = (val) => {
        const current = parseFloat(amount) || 0;
        setAmount((current + val).toString());
    };

    const handleDeposit = async (e) => {
        e.preventDefault();
        const depositAmount = parseFloat(amount);
        
        if (isNaN(depositAmount) || depositAmount <= 0) {
            setMsg("Invalid Amount");
            return;
        }

        setIsLoading(true);
        setMsg("");
        
        try {
            await axios.post(`${BASE_URL}/api/account/${accountNumber}/deposit`, 
                { amount: depositAmount },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setMsg("Vault Updated Successfully");
            
            // --- REAL-TIME BALANCE LOGIC ---
            // Calculate the new balance locally and pass it back to the dashboard
            const updatedBalance = currentBalance + depositAmount;
            
            setAmount('');
            
            // Pass the calculated balance so the UI updates instantly
            onDepositSuccess(updatedBalance); 
            
        } catch (err) {
            setMsg("Transaction Declined");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-[32px] p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] max-w-md mx-auto">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
            
            <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight text-white">Deposit</h3>
                    <div className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                        <ArrowDownLeft className="w-6 h-6 text-white" />
                    </div>
                </div>

                {/* --- Quick Add Chips Section --- */}
                <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((val) => (
                        <button
                            key={val}
                            onClick={() => addAmount(val)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all active:scale-95"
                        >
                            <Plus className="w-2.5 h-2.5" />
                            ₹{val}
                        </button>
                    ))}
                    <button 
                        onClick={() => setAmount('')}
                        className="px-3 py-1.5 bg-red-500/5 border border-red-500/10 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-500/10 transition-all"
                    >
                        Clear
                    </button>
                </div>

                <form onSubmit={handleDeposit} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">
                            Amount in INR
                        </label>
                        <div className="relative group">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2">
                                <IndianRupee className="w-6 h-6 text-emerald-500" />
                            </div>
                            <input 
                                type="number" 
                                placeholder="0.00" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-24 pl-16 pr-6 bg-white/[0.03] border border-white/5 rounded-[24px] text-4xl font-black text-white placeholder:text-white/10 focus:bg-white/[0.05] focus:border-emerald-500/50 transition-all outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                                required 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="group relative w-full h-16 bg-white overflow-hidden rounded-[24px] font-black text-black transition-all hover:bg-emerald-400 active:scale-[0.97] disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <span className="text-lg">Deposit Now</span>}
                    </button>
                </form>

                {msg && (
                    <div className={`flex items-center justify-center p-4 rounded-2xl text-[10px] font-black tracking-[0.15em] uppercase border ${
                        msg.includes('Declined') || msg.includes('Invalid') ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                    }`}>
                        {msg}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Deposit;