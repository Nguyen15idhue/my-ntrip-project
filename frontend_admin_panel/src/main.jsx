// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// 1. Import <App> từ 'antd' và dùng alias `AntApp` để không bị trùng tên
import { App as AntApp } from 'antd'; 

// 2. Import component <App> chính của bạn
import App from './App.jsx';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. BrowserRouter phải bao ngoài cùng */}
    <BrowserRouter>
      {/* 4. AuthProvider cung cấp thông tin đăng nhập */}
      <AuthProvider>
        {/* 5. AntApp cung cấp context cho Modal, message, notification */}
        <AntApp>
          {/* 6. Component App chính của bạn nằm trong cùng */}
          <App />
        </AntApp>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);