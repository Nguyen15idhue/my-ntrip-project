// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import StationPage from './pages/StationPage';
import RoverPage from './pages/RoverPage';
import DashboardPage from './pages/DashboardPage'; // <-- IMPORT TRANG THẬT

// Các trang placeholder còn lại
const SettingsPage = () => <h1>Settings</h1>;

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
        {/* Các route con này sẽ được hiển thị bên trong AppLayout */}
        <Route index element={<DashboardPage />} /> {/* <-- SỬ DỤNG Ở ĐÂY */}
        <Route path="stations" element={<StationPage />} />
        <Route path="rovers" element={<RoverPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;