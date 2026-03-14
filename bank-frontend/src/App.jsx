import { useState, useEffect } from 'react'; // Added useEffect
import React from 'react';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel'; 
import './App.css';

function App() {
  // 1. Initialize state from sessionStorage (Tab-specific)
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [role, setRole] = useState(sessionStorage.getItem('role')); 
  const [username, setUsername] = useState(sessionStorage.getItem('username'));
  const [view, setView] = useState('login'); 
const [currentView, setCurrentView] = useState('login'); // or 'signup'

const handleSignupSuccess = () => {
  // This changes the state, which tells React to stop showing Signup.jsx
  // and start showing Login.jsx
  setCurrentView('login'); 
};


  const handleLoginSuccess = (newToken, userRole) => {
    setToken(newToken);
    setRole(userRole);
    // Refresh the username state from session after Login.jsx sets it
    setUsername(sessionStorage.getItem('username'));
  };

  const handleLogout = () => {
    // 2. Clear only the current tab's session
    sessionStorage.clear(); 
    setToken(null);
    setRole(null);
    setUsername(null);
    setView('login');
  };

  // SCREEN 1: User is NOT logged in
  // 3. Your Return Logic
if (!token) {
  return (
    <>
      {currentView === 'login' ? (
        <Login 
          onLoginSuccess={handleLoginSuccess} 
          onGoToSignup={() => setCurrentView('signup')} 
        />
      ) : (
        /* IMPORTANT: Notice how we pass handleSignupSuccess here */
        <Signup 
          onSignupSuccess={handleSignupSuccess} 
          onGoToLogin={() => setCurrentView('login')} 
        />
      )}
    </>
  );
}

  // SCREEN 2: User IS logged in (Banking Interface)
  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <nav style={{
        backgroundColor: '#fff', 
        padding: '10px 20px', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
      }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <b style={{color: '#004085'}}>VEXA BANK {role === 'ADMIN' ? "(ADMIN)" : ""}</b>
              
              <span style={{
                backgroundColor: '#e7f3ff', 
                color: '#007bff', 
                padding: '2px 10px', 
                borderRadius: '12px', 
                fontSize: '11px', 
                fontWeight: 'bold'
              }}>
                👤 {username || 'User'}
              </span>
          </div>

          <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <span style={{fontSize: '12px', color: '#666'}}>Role: {role}</span>
            <button 
              onClick={handleLogout} 
              style={{
                padding: '5px 15px', 
                cursor: 'pointer', 
                borderRadius: '4px', 
                border: '1px solid #dc3545', 
                color: '#dc3545', 
                background: 'none'
              }}
            >
              Logout
            </button>
          </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '20px' }}>
        {role === 'ADMIN' ? (
          <AdminPanel token={token} />
        ) : (
          <Dashboard token={token} />
        )}
      </main>
    </div>
  );
}

export default App;