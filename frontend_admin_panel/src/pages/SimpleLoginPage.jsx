// src/pages/SimpleLoginPage.jsx
import React, { useState } from 'react';
import apiClient from '../services/api'; // Dùng lại apiClient đã cấu hình
import { useAuth } from '../context/AuthContext'; // Dùng context để đăng nhập
import { useNavigate } from 'react-router-dom';

const SimpleLoginPage = () => {
  const [email, setEmail] = useState('john@example.com'); // Thay bằng email admin của bạn
  const [password, setPassword] = useState('securepassword'); // Thay bằng mật khẩu của bạn
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = async () => {
    console.log("1. Nút Login đã được nhấn!");
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      console.log("2. Chuẩn bị gọi hàm login trong AuthContext với:", { email, password });
      
      // Gọi trực tiếp hàm login từ context mà không qua Form
      await login(email, password);

      console.log("4. Đăng nhập thành công từ AuthContext!");
      alert("Đăng nhập thành công!");
      navigate('/'); // Chuyển hướng về trang chủ
      
    } catch (err) {
      console.error("4. LỖI! Đăng nhập thất bại:", err);
      setError(err.response ? JSON.stringify(err.response.data) : err.message);
      alert("Đăng nhập thất bại. Kiểm tra Console (F12).");
    } finally {
      console.log("5. Hoàn tất xử lý.");
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Trang Login Đơn Giản (Để Debug)</h1>
      <div>
        <label>Email: </label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '8px', margin: '8px 0', width: '300px' }}
        />
      </div>
      <div>
        <label>Mật khẩu: </label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '8px', margin: '8px 0', width: '300px' }}
        />
      </div>
      <button 
        onClick={handleLoginClick} 
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px' }}
      >
        {loading ? 'Đang xử lý...' : 'Đăng nhập Ngay!'}
      </button>
      
      <div style={{ marginTop: '20px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
        <h2>Kết quả:</h2>
        {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}
        {response && <p style={{ color: 'green' }}>Thành công: {response}</p>}
      </div>
    </div>
  );
};

export default SimpleLoginPage;