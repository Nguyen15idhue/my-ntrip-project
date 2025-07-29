// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import AppLayout from './components/AppLayout';
import LoginPage from './pages/LoginPage';
import StationPage from './pages/StationPage';

// Các trang placeholder
const DashboardPage = () => <h1>Dashboard</h1>;
const RoverPage = () => <h1>Rover Management</h1>;
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
        <Route index element={<DashboardPage />} />
        <Route path="stations" element={<StationPage />} />
        <Route path="rovers" element={<RoverPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}

export default App;