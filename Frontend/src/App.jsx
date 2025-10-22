import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/LandingPage'; // Your existing landing page
import DashboardPage from './pages/BorrowerDashboard'; // Your dashboard page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage />} 
        />
        
        <Route 
          path="/dashboard" 
          element={<DashboardPage />} 
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;