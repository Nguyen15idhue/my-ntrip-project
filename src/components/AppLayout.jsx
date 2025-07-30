// src/components/AppLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Typography, Button, Avatar, Popover } from 'antd';
import {
  DashboardOutlined,
  RadarChartOutlined,
  RocketOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },
  { key: '/stations', icon: <RadarChartOutlined />, label: <Link to="/stations">Station Management</Link> },
  { key: '/rovers', icon: <RocketOutlined />, label: <Link to="/rovers">Rover Management</Link> },
  { key: '/settings', icon: <SettingOutlined />, label: <Link to="/settings">Setting</Link> },
];

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const UserProfile = (
    <div>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Role:</strong> {user?.role}</p>
      <Button type="primary" danger onClick={logout} block>
        Đăng xuất
      </Button>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: '32px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '6px', textAlign: 'center', color: 'white', lineHeight: '32px', overflow: 'hidden' }}>
            NTRIP
        </div>
        <Menu theme="dark" selectedKeys={[location.pathname]} mode="inline" items={menuItems} />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Popover content={UserProfile} title={`Chào, ${user?.name}`} trigger="click">
                <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }}/>
            </Popover>
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          {/* Đây là nơi các trang con (Dashboard, Stations...) sẽ được hiển thị */}
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;