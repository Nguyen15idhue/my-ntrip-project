// src/pages/RoverPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Table, Typography, Tag, message, Button, Space, Modal, Popconfirm, Input, Tooltip } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { roverService } from '../services/rover.service';
import RoverForm from '../components/RoverForm';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;

const RoverPage = () => {
  const [rovers, setRovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingRover, setEditingRover] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const fetchRovers = async () => {
    setLoading(true);
    try {
      const data = await roverService.getAllRovers();
      setRovers(data);
    } catch (error) {
      message.error(error.message || 'Lỗi không xác định khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRovers(); }, []);

  const handleAddNew = () => { setEditingRover(null); setIsModalOpen(true); };
  const handleEdit = (record) => { setEditingRover(record); setIsModalOpen(true); };
  const handleCancelModal = () => setIsModalOpen(false);

  const handleFinishModal = async (values) => {
    setFormLoading(true);
    const action = editingRover ? roverService.updateRover(editingRover.id, values) : roverService.createRover(values);
    try {
      const response = await action;
      message.success(response.message);
      setIsModalOpen(false);
      fetchRovers();
    } catch (error) {
      message.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };
  
  const handleDelete = async (id) => {
    try {
      await roverService.deleteRover(id);
      message.success(`Đã xóa rover #${id}`);
      fetchRovers();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedRowKeys.length === 0) return message.warning('Vui lòng chọn ít nhất một rover.');
    Modal.confirm({
      title: `Xác nhận hành động hàng loạt`,
      content: `Bạn có chắc muốn '${action}' ${selectedRowKeys.length} rover đã chọn?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await roverService.bulkAction(action, selectedRowKeys);
          message.success(response.message);
          setSelectedRowKeys([]);
          fetchRovers();
        } catch(error) {
          message.error(error.message);
        }
      }
    });
  };

  const filteredRovers = useMemo(() => rovers.filter(rover =>
    rover.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rover.User?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rover.Station?.name.toLowerCase().includes(searchTerm.toLowerCase())
  ), [searchTerm, rovers]);
  
  const columns = [
    { title: 'Username', dataIndex: 'username', key: 'username', sorter: (a, b) => a.username.localeCompare(b.username) },
    { title: 'Trạm', dataIndex: ['Station', 'name'], key: 'station', sorter: (a, b) => a.Station?.name.localeCompare(b.Station?.name) },
    { title: 'Người sở hữu', dataIndex: ['User', 'name'], key: 'user' },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status',
      render: (status) => <Tag color={status === 'active' ? 'blue' : 'gray'}>{status.toUpperCase()}</Tag>,
    },
    {
      title: 'Hiệu lực', dataIndex: 'is_currently_active', key: 'is_currently_active',
      render: (isActive) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? 'CÒN HIỆU LỰC' : 'HẾT HIỆU LỰC'}</Tag>,
    },
    {
        title: 'Ngày hiệu lực', key: 'validity_date',
        render: (_, record) => (record.start_date || record.end_date) 
            ? `${dayjs(record.start_date).format('DD/MM/YYYY')} - ${dayjs(record.end_date).format('DD/MM/YYYY')}`
            : 'Vô thời hạn',
    },
    {
      title: 'Hành động', key: 'action', fixed: 'right', width: 120, align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa"><Button shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip>
          <Popconfirm title="Xóa rover?" onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Tooltip title="Xóa"><Button shape="circle" danger icon={<DeleteOutlined />} /></Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = { selectedRowKeys, onChange: setSelectedRowKeys };
  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      <Title level={2}>Quản lý Rover</Title>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0' }}>
        <Search placeholder="Tìm theo username, người dùng, trạm..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: 300 }} allowClear />
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchRovers}>Tải lại</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Thêm mới</Button>
        </Space>
      </div>

      {hasSelected && (
        <div style={{ marginBottom: 16, background: '#e6f7ff', padding: '8px 16px', border: '1px solid #91d5ff', borderRadius: '4px' }}>
          <Space>
            <Text strong>{selectedRowKeys.length} rover được chọn</Text>
            <Button size="small" onClick={() => handleBulkAction('activate')}>Activate</Button>
            <Button size="small" onClick={() => handleBulkAction('deactivate')}>Deactivate</Button>
            <Button size="small" danger onClick={() => handleBulkAction('delete')}>Delete</Button>
          </Space>
        </div>
      )}

      <Table rowSelection={rowSelection} columns={columns} dataSource={filteredRovers} loading={loading} rowKey="id" scroll={{ x: 1200 }} />
      <RoverForm open={isModalOpen} onFinish={handleFinishModal} onCancel={handleCancelModal} loading={formLoading} initialValues={editingRover} />
    </>
  );
};

export default RoverPage;