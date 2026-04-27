import React, { useState, useEffect } from 'react';
import AuthTabs from './components/AuthTabs';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check if user is already logged in (saved in browser storage)
  useEffect(() => {
    const savedUser = localStorage.getItem('dtr_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsInitializing(false);
  }, []);

  // Handle successful login or registration
  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('dtr_user', JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dtr_user');
  };

  // Prevent flicker while checking localStorage
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#073763] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <AuthTabs onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}

export default App;