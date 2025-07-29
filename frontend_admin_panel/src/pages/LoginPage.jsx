// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Form, Input, Button, Card, message, Typography, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      message.error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Col xs={22} sm={16} md={12} lg={14} xl={12}>
        <Card style={{ borderRadius: '15px' }} bodyStyle={{ padding: 0 }}>
          <Row>
            {/* ======================= PHẦN ĐÃ SỬA LỖI ======================= */}
            <Col 
              xs={0} sm={0} md={12}
              style={{
                background: 'linear-gradient(135deg, #003a70, #007bff)',
                color: 'white',
                borderTopLeftRadius: '15px',
                borderBottomLeftRadius: '15px',
              }}
            >
              <Row justify="center" align="middle" style={{ height: '100%' }}>
                <Col span={20} style={{ textAlign: 'center' }}>
                  <RocketOutlined style={{ fontSize: '64px', marginBottom: '24px' }}/>
                  <Title level={2} style={{ color: 'white' }}>NTRIP Caster</Title>
                  <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                    Hệ thống quản lý và giám sát trạm CORS
                  </Text>
                </Col>
              </Row>
            </Col>
            {/* ================================================================= */}

            <Col xs={24} sm={24} md={12} style={{ padding: '48px' }}>
              <Title level={3} style={{ textAlign: 'center', marginBottom: '32px' }}>
                Đăng nhập hệ thống
              </Title>
              <Form name="login" onFinish={onFinish} autoComplete="off" size="large">
                <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập đúng định dạng email!' }]}>
                  <Input prefix={<UserOutlined />} placeholder="Email" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}>
                  <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                </Form.Item>
                <Form.Item style={{ marginTop: '24px' }}>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;