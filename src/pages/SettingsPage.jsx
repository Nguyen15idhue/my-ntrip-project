// src/pages/SettingsPage.jsx
import React from 'react';
import { Tabs, Typography } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import ProfileSettings from '../components/ProfileSettings';
import UserManagement from '../components/UserManagement';

const { Title } = Typography;

const SettingsPage = () => {
  const { user } = useAuth();

  const tabItems = [
    {
      key: '1',
      label: (<span><UserOutlined /> Thông tin cá nhân</span>),
      children: <ProfileSettings />,
    },
  ];

  // Chỉ thêm tab Quản lý người dùng nếu là admin
  if (user.role === 'admin') {
    tabItems.push({
      key: '2',
      label: (<span><TeamOutlined /> Quản lý người dùng</span>),
      children: <UserManagement />,
    });
  }

  return (
    <>
      <Title level={2}>Cài đặt</Title>
      <Tabs defaultActiveKey="1" items={tabItems} />
    </>
  );
};

export default SettingsPage;