import { useState, useEffect } from 'react';
import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel'; 
import { LogOut, User, ShieldCheck } from 'lucide-react';
import './App.css';

function App() {
  // 1. Initialize state from sessionStorage (Tab-specific) - Logic Unchanged
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [role, setRole] = useState(sessionStorage.getItem('role')); 
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [currentView, setCurrentView] = useState('login'); 

  const handleSignupSuccess = () => {
    setCurrentView('login'); 
  };

  const handleLoginSuccess = (newToken, userRole) => {
    setToken(newToken);
    setRole(userRole);
    setUsername(sessionStorage.getItem('username'));
  };

  const handleLogout = () => {
    sessionStorage.clear(); 
    setToken(null);
    setRole(null);
    setUsername(null);
    setCurrentView('login');
  };

  // SCREEN 1: User is NOT logged in
  if (!token) {
    return (
      <div className="v-auth-page-wrapper">
        {currentView === 'login' ? (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onGoToSignup={() => setCurrentView('signup')} 
          />
        ) : (
          <Signup 
            onSignupSuccess={handleSignupSuccess} 
            onGoToLogin={() => setCurrentView('login')} 
          />
        )}
      </div>
    );
  }

  // SCREEN 2: User IS logged in (Banking Interface)
  return (
    <div className="v-light-app">
      
      {/* FROSTED GLASS NAVIGATION */}
      <nav className="v-nav-glass">
        <div className="v-nav-left">
          <div className="v-logo-capsule">
            <div className="v-logo-icon">V</div>
            <span className="v-logo-text">VEXA<span className="text-blue-600">BANK</span></span>
            {role === 'ADMIN' && <span className="v-admin-badge-light">ADMIN NODE</span>}
          </div>
        </div>

        <div className="v-nav-right">
          <div className="v-profile-capsule">
            <div className="v-avatar-light">
              <User size={16} className="text-blue-600" />
            </div>
            <div className="v-user-meta">
              <span className="v-username-text">{username || 'User'}</span>
              <span className="v-role-text">{role} </span>
            </div>
          </div>

          <button onClick={handleLogout} className="v-secure-exit-btn">
            <LogOut size={16} />
            <span>Secure Exit</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="v-content-area">
        {role === 'ADMIN' ? (
          <AdminPanel token={token} />
        ) : (
          <Dashboard token={token} userName={username} />
        )}
      </main>
    </div>
  );
}

export default App;