import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Eye, EyeOff, Sparkles } from "lucide-react";



// --- EMERGENCY UTILS (Bypasses the lib/utils.js errors) ---
const cn = (...inputs) => inputs.filter(Boolean).join(' ');

// --- SHADCN-LIKE COMPONENTS (Internalized for reliability) ---
// If your ./ui/ files still give errors, these internal versions will take over
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const BASE_URL = "http://localhost:4040";

// --- ANIMATION HELPER COMPONENTS ---
const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, isBlinking = false, forceLookX, forceLookY }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const eyeRef = useRef(null);

  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const getPos = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined) return { x: forceLookX, y: forceLookY };
    const rect = eyeRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = mousePos.x - centerX;
    const deltaY = mousePos.y - centerY;
    
    const dist = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
  };

  const pos = getPos();
  return (
    <div ref={eyeRef} className="rounded-full flex items-center justify-center bg-white overflow-hidden transition-all duration-150"
      style={{ width: `${size}px`, height: isBlinking ? '2px' : `${size}px` }}>
      {!isBlinking && (
        <div className="rounded-full bg-[#2D2D2D]" 
          style={{ 
            width: `${pupilSize}px`, 
            height: `${pupilSize}px`, 
            transform: `translate(${pos.x}px, ${pos.y}px)` 
          }} 
        />
      )}
    </div>
  );
};

// --- MAIN LOGIN COMPONENT ---
const Login = ({ onLoginSuccess, onGoToSignup }) => {
  // Logic States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  
  const purpleRef = useRef(null);

  // Original Backend Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { username, password });
      const { token, role } = response.data;
      if (token) {
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('role', role);
        sessionStorage.setItem('username', username);
        onLoginSuccess(token, role);
      } else {
        setError("Login successful but no token received.");
      }
    } catch (err) {
      setError(err.response?.data || "User Details Not Found!!. Please Signup..");
    } finally {
      setIsLoading(false);
    }
  };

  // Blinking Animation Loop
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
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#050508] font-sans selection:bg-blue-500/30">
      {/* Left Animated Section - Enhanced Gradient & Depth */}
      <div className="relative hidden lg:flex flex-col justify-between bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-600 via-indigo-950 to-[#050508] p-12 text-white overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500 blur-[120px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-20 flex items-center gap-3 text-2xl font-bold tracking-tighter">
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
            <Sparkles className="text-yellow-400 size-6" /> 
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">VEXA DIGITAL</span>
        </div>

        <div className="relative z-20 flex items-end justify-center h-[500px]">
          <div className="relative w-[400px] h-[350px]">
            {/* Purple Character - Reacts to Typing */}
            <div className="absolute bottom-0 left-[40px] w-[170px] transition-all duration-500 ease-out rounded-t-[80px] bg-gradient-to-b from-[#7C4DFF] to-[#512DA8] shadow-[0_-20px_50px_rgba(108,63,245,0.3)]" 
                 style={{ height: isTyping ? '380px' : '320px' }}>
              <div className="absolute flex gap-7 top-16 left-12">
                <EyeBall size={24} pupilSize={11} isBlinking={isBlinking} />
                <EyeBall size={24} pupilSize={11} isBlinking={isBlinking} />
              </div>
              {/* Subtle Smile when typing */}
              <div className={cn("absolute bottom-24 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-black/20 rounded-full transition-all", isTyping ? "scale-x-125 opacity-40" : "scale-x-100 opacity-20")} />
            </div>

            {/* Black Character */}
            <div className="absolute bottom-0 left-[185px] w-[130px] h-[260px] bg-gradient-to-b from-[#2D2D2D] to-[#121212] rounded-t-[60px] z-10 border-t border-white/5 shadow-2xl">
               <div className="absolute flex gap-5 top-14 left-11">
                  <EyeBall size={18} pupilSize={8} isBlinking={isBlinking} />
                  <EyeBall size={18} pupilSize={8} isBlinking={isBlinking} />
               </div>
            </div>
          </div>
        </div>
        
        <div className="relative z-20 space-y-3">
            <div className="h-[1px] w-24 bg-gradient-to-r from-blue-400 to-transparent" />
            <p className="text-blue-100/80 text-lg font-light tracking-wide italic">"The future of secure wealth."</p>
            <p className="text-blue-200/30 text-[10px] tracking-[0.2em] uppercase font-bold">Encrypted Node: VX-0440</p>
        </div>
      </div>

      {/* Right Form Section - Glassmorphism UI */}
      <div className="flex items-center justify-center p-8 bg-[#fdfdfd] relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
        
        <div className="w-full max-w-[420px] space-y-10 relative z-10">
          <div className="space-y-3">
            <h1 className="text-5xl font-black text-gray-900 tracking-tight italic underline decoration-blue-600/20 underline-offset-8">Login</h1>
            <p className="text-gray-400 font-medium text-lg">Identity Verification Required</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-7">
            <div className="space-y-2 group">
              <Label className="text-gray-500 font-bold text-xs uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Client Username</Label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                placeholder="v_account_holder"
                className="h-14 border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all text-black rounded-2xl"
                required
              />
            </div>

            <div className="space-y-2 group">
              <Label className="text-gray-500 font-bold text-xs uppercase tracking-widest ml-1 group-focus-within:text-blue-600 transition-colors">Access Key</Label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-14 pr-12 border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 text-black rounded-2xl"
                  required
                />
                <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-4 text-gray-400 hover:text-blue-600 transition-all hover:scale-110"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {error && (
                <div className="animate-in zoom-in-95 duration-300 text-sm text-red-600 font-bold bg-red-50 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                    {error}
                </div>
            )}

            <Button 
                type="submit" 
                disabled={isLoading} 
                className="w-full h-16 bg-blue-600 hover:bg-blue-700 text-white text-lg font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all active:scale-[0.97] disabled:opacity-70 uppercase tracking-tighter"
            >
              {isLoading ? "Validating..." : "Decrypt & Access"}
            </Button>
          </form>

          <div className="pt-6 text-center">
            <button 
                onClick={onGoToSignup} 
                className="group text-gray-400 font-bold hover:text-blue-600 transition-all text-sm tracking-tight"
            >
              Need a VEXA account? <span className="text-blue-600 underline decoration-blue-600/30 underline-offset-4 group-hover:decoration-blue-600">Register Node</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;