import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import InteractiveMap from './components/InteractiveMap';
import Chat from './components/Chat';
import UserProfile from './components/UserProfile';
import Navbar from './components/Navbar';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setCurrentUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading LocalLoop...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/login" 
              element={
                currentUser ? (
                  <Navigate to="/app" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              } 
            />
            
            {/* Protected Routes */}
            {currentUser ? (
              <>
                <Route 
                  path="/app" 
                  element={
                    <div>
                      <Navbar currentUser={currentUser} onLogout={handleLogout} />
                      <main>
                        <Dashboard currentUser={currentUser} />
                      </main>
                    </div>
                  } 
                />
                <Route 
                  path="/items" 
                  element={
                    <div>
                      <Navbar currentUser={currentUser} onLogout={handleLogout} />
                      <main>
                        <Dashboard currentUser={currentUser} />
                      </main>
                    </div>
                  } 
                />
                <Route 
                  path="/map" 
                  element={
                    <div>
                      <Navbar currentUser={currentUser} onLogout={handleLogout} />
                      <main>
                        <InteractiveMap />
                      </main>
                    </div>
                  } 
                />
                <Route 
                  path="/chat" 
                  element={
                    <div>
                      <Navbar currentUser={currentUser} onLogout={handleLogout} />
                      <main>
                        <Chat currentUser={currentUser} />
                      </main>
                    </div>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <div>
                      <Navbar currentUser={currentUser} onLogout={handleLogout} />
                      <main>
                        <UserProfile currentUser={currentUser} />
                      </main>
                    </div>
                  } 
                />
              </>
            ) : (
              <Route path="/app/*" element={<Navigate to="/login" replace />} />
            )}
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
                borderRadius: '12px',
                padding: '16px',
                fontSize: '14px',
                fontWeight: '500',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#ffffff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#ffffff',
                },
              },
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;