// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import StationPage from './pages/StationPage';
import RoverPage from './pages/RoverPage';
import DashboardPage from './pages/DashboardPage';
import SettingsPage from './pages/SettingsPage'; // <-- IMPORT TRANG THẬT

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AppLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="stations" element={<StationPage />} />
        <Route path="rovers" element={<RoverPage />} />
        <Route path="settings" element={<SettingsPage />} /> {/* <-- SỬ DỤNG Ở ĐÂY */}
      </Route>
    </Routes>
  );
}

export default App;