import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { MainLayout } from './layouts/MainLayout';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          !isAuthenticated ? <Login /> : <Navigate to="/" replace />
        } />
        <Route path="/*" element={
          isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </Router>
  );
}

export default App;