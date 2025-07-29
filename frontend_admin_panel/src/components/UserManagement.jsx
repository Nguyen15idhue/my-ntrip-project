// src/components/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, Select, Tooltip, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { userService } from '../services/user.service';
import { authService } from '../services/auth.service';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddNew = () => { form.resetFields(); setIsModalOpen(true); };
  const handleCancel = () => setIsModalOpen(false);

  const handleFinish = async (values) => {
    setFormLoading(true);
    try {
      const response = await authService.register(values);
      message.success(response.message);
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      message.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };
  
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role', render: role => <Tag color={role === 'admin' ? 'purple' : 'default'}>{role.toUpperCase()}</Tag> },
    {
      title: 'Hành động', key: 'action',
      render: () => (
        <Space size="middle">
          <Tooltip title="Chức năng chưa được hỗ trợ bởi API">
            <Button icon={<EditOutlined />} disabled />
          </Tooltip>
          <Tooltip title="Chức năng chưa được hỗ trợ bởi API">
            <Button icon={<DeleteOutlined />} danger disabled />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew} style={{ marginBottom: 16 }}>
        Thêm mới người dùng
      </Button>
      <Table columns={columns} dataSource={users} rowKey="id" loading={loading} />
      
      <Modal title="Thêm người dùng mới" open={isModalOpen} onCancel={handleCancel} footer={null} destroyOnClose>
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Form.Item name="name" label="Họ và Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={formLoading} block>
              Tạo người dùng
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UserManagement;