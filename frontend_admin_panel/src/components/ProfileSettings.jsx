// src/components/ProfileSettings.jsx
import React from 'react';
import { Form, Input, Button, Card, Col, Row, Typography, message, Divider } from 'antd';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const ProfileSettings = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();

  // API không hỗ trợ, nên hàm này chỉ hiển thị thông báo
  const onFinish = (values) => {
    console.log('Attempted to save profile:', values);
    message.info('Chức năng cập nhật thông tin cá nhân chưa được hỗ trợ bởi API.');
  };

  return (
    <Card>
      <Title level={4}>Thông tin của bạn</Title>
      <Form form={form} layout="vertical" initialValues={user} onFinish={onFinish}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="name" label="Họ và Tên">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="email" label="Email">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>
        <Divider>Đổi mật khẩu</Divider>
        <Row gutter={16}>
            <Col xs={24} md={12}>
                <Form.Item name="current_password" label="Mật khẩu hiện tại">
                    <Input.Password />
                </Form.Item>
            </Col>
        </Row>
         <Row gutter={16}>
            <Col xs={24} md={12}>
                <Form.Item name="new_password" label="Mật khẩu mới">
                    <Input.Password />
                </Form.Item>
            </Col>
             <Col xs={24} md={12}>
                <Form.Item name="confirm_password" label="Xác nhận mật khẩu mới" dependencies={['new_password']}>
                    <Input.Password />
                </Form.Item>
            </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Lưu thay đổi
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ProfileSettings;