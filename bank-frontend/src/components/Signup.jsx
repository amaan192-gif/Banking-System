import React, { useState, useEffect, useRef } from "react";
import BASE_URL from '../api';
import axios from "axios";
import { Eye, EyeOff, Sparkles, ShieldCheck, UserPlus, Lock } from "lucide-react";

// --- INTERNAL HELPERS (Ensures no import errors) ---
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, isBlinking = false }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const eyeRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const getPos = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    const rect = eyeRef.current.getBoundingClientRect();
    const deltaX = mousePos.x - (rect.left + rect.width / 2);
    const deltaY = mousePos.y - (rect.top + rect.height / 2);
    const dist = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = getPos();
  return (
    <div ref={eyeRef} className="rounded-full flex items-center justify-center bg-white overflow-hidden transition-all duration-150"
      style={{ width: `${size}px`, height: isBlinking ? '2px' : `${size}px` }}>
      {!isBlinking && <div className="rounded-full bg-[#1A1A1A]" style={{ width: `${pupilSize}px`, height: `${pupilSize}px`, transform: `translate(${pos.x}px, ${pos.y}px)` }} />}
    </div>
  );
};

// --- IMPORT YOUR UI COMPONENTS ---
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";



const Signup = ({ onSignupSuccess, onGoToLogin }) => {
  // --- ORIGINAL LOGIC & STATES ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/signup`, { 
        username, 
        password, 
        email, 
        fullName 
      });

      // Check for successful registration
      if (response.status === 201 || response.status === 200) {
        // 1. Trigger the cool success overlay
        setIsSuccess(true); 
        
        // 2. Play the animation for 3.5 seconds, then redirect
        setTimeout(() => {
          onSignupSuccess(); // This usually tells the parent component to show Login
        }, 3500);
      }
    } catch (err) {
      // If the backend sends a specific error message, we show it
      // Otherwise, we show a friendly default error
      const errorMessage = typeof err.response?.data === 'string' 
        ? err.response.data 
        : "Registration failed. Please check your details.";
        
      setError(errorMessage);
      setIsLoading(false); // Stop loading only if there's an error
    }
    // Note: we don't put setIsLoading(false) in finally anymore 
    // because we want the button to stay in "Loading" state during the success animation.
  };

  // Blinking Loop
  useEffect(() => {
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      setTimeout(blink, Math.random() * 4000 + 3000);
    };
    const timer = setTimeout(blink, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#050508] font-sans selection:bg-indigo-500/30">
      {/* Left Animated Section: THE TRIO GUARDIANS */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black p-12 text-white overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/20 blur-[120px] rounded-full" />

        <div className="relative z-20 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-400/20 backdrop-blur-xl shadow-2xl">
            <ShieldCheck className="text-indigo-400 size-6" />
          </div>
          <span className="text-2xl font-black tracking-[0.2em] uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
            Vexa Vault
          </span>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <div className="relative w-full max-w-[420px] h-[380px]">
            {/* Guardian 1: Small & Alert */}
            <div className="absolute bottom-0 left-0 w-[110px] h-[220px] bg-gradient-to-b from-emerald-500 to-teal-800 rounded-t-[50px] shadow-[0_-10px_40px_rgba(16,185,129,0.15)] border-t border-white/10">
                <div className="absolute flex gap-3 top-12 left-8">
                    <EyeBall size={15} pupilSize={7} isBlinking={isBlinking} />
                    <EyeBall size={15} pupilSize={7} isBlinking={isBlinking} />
                </div>
            </div>

            {/* Guardian 2: The Main Leader (Purple) */}
            <div className="absolute bottom-0 left-[95px] w-[190px] transition-all duration-700 ease-in-out rounded-t-[100px] bg-gradient-to-b from-indigo-500 via-indigo-700 to-indigo-950 z-10 shadow-[0_-20px_60px_rgba(79,70,229,0.3)] border-t border-white/20"
                 style={{ height: isTyping ? '400px' : '340px' }}>
                <div className="absolute flex gap-8 top-20 left-12">
                    <EyeBall size={28} pupilSize={13} isBlinking={isBlinking} />
                    <EyeBall size={28} pupilSize={13} isBlinking={isBlinking} />
                </div>
                <div className={cn("absolute bottom-28 left-1/2 -translate-x-1/2 h-1 bg-white/10 rounded-full transition-all duration-500", isTyping ? "w-12 opacity-40" : "w-6 opacity-0")} />
            </div>

            {/* Guardian 3: The Enforcer (Dark) */}
            <div className="absolute bottom-0 left-[270px] w-[150px] h-[290px] bg-gradient-to-b from-[#2D2D2D] to-[#0A0A0F] rounded-t-[70px] border-t border-white/5 shadow-2xl">
                <div className="absolute flex gap-5 top-16 left-12">
                    <EyeBall size={20} pupilSize={9} isBlinking={isBlinking} />
                    <EyeBall size={20} pupilSize={9} isBlinking={isBlinking} />
                </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 space-y-4">
          <div className="h-1 w-20 bg-indigo-500 rounded-full" />
          <h2 className="text-4xl font-black leading-none tracking-tighter uppercase">Initialize<br/>Your Node.</h2>
          <p className="text-indigo-200/40 max-w-xs text-xs font-bold tracking-widest uppercase leading-relaxed">Secured by Vexa Quantum-Resistance Protocol v4.0</p>
        </div>
      </div>

      {/* Right Form Section: HIGH-CONTRAST PREMIUM UI */}
      <div className="flex items-center justify-center p-8 bg-white relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[120px] -mr-64 -mt-64" />
        
        <div className="w-full max-w-[460px] space-y-10 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-indigo-100">
              <UserPlus size={14} className="animate-pulse" /> Security Onboarding
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight italic underline decoration-indigo-600/10 underline-offset-[12px]">Sign Up</h1>
          </div>

          <form onSubmit={handleSignup} className="grid grid-cols-2 gap-x-5 gap-y-6">
            <div className="col-span-2 space-y-2 group">
  <Label className="text-gray-400 font-black text-[15px] uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">
    Legal Full Name
  </Label>
  <Input 
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    onFocus={() => setIsTyping(true)}
    onBlur={() => setIsTyping(false)}
    className="h-14 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 rounded-2xl transition-all text-lg text-black placeholder:text-gray-400" 
    placeholder="Ex: Alexander Vexa"
    required
  />
</div>

            <div className="col-span-2 space-y-2 group">
              <Label className="text-gray-400 font-black text-[15px] uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">Digital Correspondence (Email)</Label>
              <Input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                className="h-14 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 rounded-2xl transition-all text-lg text-black placeholder:text-gray-300" 
                placeholder="name@secure-vexa.com"
                required
              />
            </div>

            <div className="space-y-2 group">
              <Label className="text-gray-400 font-black text-[15px] uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">Node User</Label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-14 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 rounded-2xl transition-all text-lg text-black placeholder:text-gray-300" 
                placeholder="v_node_77"
                required
              />
            </div>

            <div className="space-y-2 group relative">
              <Label className="text-gray-400 font-black text-[15px] uppercase tracking-widest ml-1 group-focus-within:text-indigo-600 transition-colors">Access Key</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-14 pr-12 border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-indigo-500 rounded-2xl transition-all text-lg text-black" 
                  placeholder="••••••••"
                  required
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-4 text-gray-300 hover:text-indigo-600 transition-all"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {error && (
                <div className="col-span-2 animate-in slide-in-from-bottom-2 duration-300 text-[13px] text-red-600 font-bold bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-ping" />
                    {error}
                </div>
            )}

            <div className="col-span-2 pt-4">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-16 bg-black hover:bg-indigo-700 text-white rounded-2xl font-black text-xl shadow-[0_20px_40px_rgba(0,0,0,0.2)] transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-tighter"
              >
                {isLoading ? "INITIALIZING NODE..." : "ACTIVATE MY VAULT"}
                {!isLoading && <Lock size={20} className="text-indigo-400" />}
              </Button>
            </div>
          </form>

          <div className="pt-6 text-center">
            <button 
                onClick={onGoToLogin} 
                className="group text-gray-400 font-bold hover:text-indigo-600 transition-all text-sm tracking-tight"
            >
              Already a verified member? <span className="text-indigo-600 underline decoration-indigo-600/30 underline-offset-4 group-hover:decoration-indigo-600">Login Access</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUCCESS ANIMATION OVERLAY (Added Here) */}
    {isSuccess && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050508]/90 backdrop-blur-xl animate-in fade-in duration-500">
        <div className="text-center space-y-6 relative">
          <div className="absolute -inset-20 bg-indigo-500/20 blur-[100px] animate-pulse" />
          
          <div className="relative">
            <div className="size-24 bg-indigo-600 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.6)] animate-bounce">
              <ShieldCheck size={48} className="text-white" />
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 size-24 border-2 border-indigo-500 rounded-full animate-ping" />
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Identity Verified</h2>
            <p className="text-indigo-300 font-mono text-sm tracking-[0.3em] uppercase">Vault Node {username} Activated</p>
          </div>

          <div className="flex justify-center gap-4 pt-8">
            <div className="w-8 h-12 bg-emerald-500 rounded-t-full animate-bounce [animation-delay:-0.1s]" />
            <div className="w-10 h-16 bg-indigo-500 rounded-t-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-8 h-10 bg-zinc-700 rounded-t-full animate-bounce [animation-delay:-0.2s]" />
          </div>
          
          <p className="text-white/20 text-[10px] font-bold tracking-[0.5em] uppercase pt-10">Redirecting to Secure Access Portal...</p>
        </div>
      </div>
    )}
    </div>
  );
};

export default Signup;