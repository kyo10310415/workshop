import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Workshops from './pages/Workshops';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={<Login onLogin={() => setIsAuthenticated(true)} />} 
        />
        <Route 
          path="/workshops" 
          element={isAuthenticated ? <Workshops /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to="/workshops" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
