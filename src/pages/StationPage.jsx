// src/pages/StationPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Typography, Tag, message, Button, Space, Popconfirm, Input, Tooltip } from 'antd';
import { PlusOutlined, ReloadOutlined, PlayCircleOutlined, PauseCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { stationService } from '../services/station.service';
import StationForm from '../components/StationForm'; // Giả sử component này không đổi

const { Title, Text } = Typography;
const { Search } = Input;

const StationPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const fetchStations = useCallback(async () => {
    setLoading(true);
    try {
      const stationData = await stationService.getAllStations();
      setStations(stationData);
    } catch (error) {
      message.error(error.message || 'Lỗi không xác định khi tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Các hàm xử lý modal và hành động đơn lẻ (giữ nguyên)
  const handleAddNew = () => { setEditingStation(null); setIsModalOpen(true); };
  const handleEdit = (record) => { setEditingStation(record); setIsModalOpen(true); };
  const handleCancelModal = () => setIsModalOpen(false);

  const handleFinishModal = async (values) => {
    setFormLoading(true);
    const action = editingStation ? stationService.updateStation(editingStation.id, values) : stationService.createStation(values);
    try {
      const response = await action;
      message.success(response.message);
      setIsModalOpen(false);
      setTimeout(fetchStations, 500);
    } catch (error) { message.error(error.message); } finally { setFormLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await stationService.deleteStation(id);
      message.success(`Đã xóa trạm #${id}`);
      fetchStations();
    } catch (error) { message.error(error.message); }
  };

  const handleStartStop = async (record) => {
    setLoading(true);
    const actionService = record.status === 'active' ? stationService.stopStation : stationService.startStation;
    try {
      const response = await actionService(record.id);
      message.success(response.message);
      setTimeout(fetchStations, 1500);
    } catch(error) { message.error(error.message); setLoading(false); }
  };
  
  // ====================== PHIÊN BẢN SỬA LỖI CUỐI CÙNG ======================
  // Hàm này giờ sẽ được gọi bởi onConfirm của Popconfirm
  const handleBulkAction = async (action) => {
    if (!selectedRowKeys || selectedRowKeys.length === 0) {
      // Dù nút bị disabled, vẫn nên có kiểm tra này để an toàn
      message.warning('Vui lòng chọn ít nhất một trạm.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await stationService.bulkAction(action, selectedRowKeys);
      message.success(response.message);
      if (response.results?.failed?.length > 0) {
        message.warning(`${response.results.failed.length} hành động thất bại.`);
      }
    } catch(error) {
      message.error(error.message);
    } finally {
      setSelectedRowKeys([]);
      // Đợi một chút rồi tải lại dữ liệu để đảm bảo trạng thái đã được cập nhật
      setTimeout(() => {
        fetchStations(); 
      }, 1500);
    }
  };
  // =======================================================================

  const filteredStations = useMemo(() => stations.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm, stations]);
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80, sorter: (a, b) => a.id - b.id },
    { title: 'Tên trạm', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    {
      title: 'Trạng thái cấu hình', dataIndex: 'status', key: 'status', width: 180,
      filters: [{ text: 'Active', value: 'active' }, { text: 'Inactive', value: 'inactive' }],
      onFilter: (value, record) => record.status === value,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'volcano'}>{status.toUpperCase()}</Tag>,
    },
    {
      title: 'Trạng thái hoạt động', dataIndex: 'source_status', key: 'source_status', width: 180, align: 'center',
      filters: [{ text: 'Online', value: 'online' }, { text: 'Offline', value: 'offline' }],
      onFilter: (value, record) => record.source_status === value,
      render: (status) => status === 'online' ? <Tag color="blue">ONLINE</Tag> : <Tag color="gray">OFFLINE</Tag>,
    },
    { title: 'Vị trí', dataIndex: ['Location', 'province_name'], key: 'location', render: (text) => text || 'N/A' },
    {
      title: 'Hành động', key: 'action', fixed: 'right', width: 150, align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Popconfirm title={`Bạn có chắc muốn ${record.status === 'active' ? 'dừng' : 'khởi động'} trạm này?`} onConfirm={() => handleStartStop(record)} okText="Đồng ý" cancelText="Hủy">
            <Tooltip title={record.status === 'active' ? 'Dừng (Set Inactive)' : 'Khởi động (Set Active)'}>
              <Button shape="circle" icon={record.status === 'active' ? <PauseCircleOutlined style={{color: 'orange'}}/> : <PlayCircleOutlined style={{color: 'green'}}/>} />
            </Tooltip>
          </Popconfirm>
          <Tooltip title="Chỉnh sửa"><Button shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} /></Tooltip>
          <Popconfirm title="Xóa trạm?" description="Hành động này không thể hoàn tác." onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
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
      <Title level={2}>Quản lý Trạm (Stations)</Title>
      
      {/* ====================== GIAO DIỆN MỚI CHO THANH CÔNG CỤ ====================== */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0', flexWrap: 'wrap', gap: '16px' }}>
        <Search placeholder="Tìm kiếm theo tên..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: 300 }} allowClear />
        <Space>
          {hasSelected && <Text type="success" strong>{selectedRowKeys.length} trạm được chọn</Text>}
          
          {/* SỬ DỤNG POPCONFIRM CHO CÁC NÚT BULK ACTION */}
          <Popconfirm
            title={`Bạn có chắc muốn START ${selectedRowKeys.length} trạm đã chọn?`}
            onConfirm={() => handleBulkAction('start')}
            okText="Đồng ý"
            cancelText="Hủy"
            disabled={!hasSelected}
          >
            <Button type="primary" disabled={!hasSelected}>Start</Button>
          </Popconfirm>

          <Popconfirm
            title={`Bạn có chắc muốn STOP ${selectedRowKeys.length} trạm đã chọn?`}
            onConfirm={() => handleBulkAction('stop')}
            okText="Đồng ý"
            cancelText="Hủy"
            disabled={!hasSelected}
          >
            <Button disabled={!hasSelected}>Stop</Button>
          </Popconfirm>
          
          <Popconfirm
            title={`Bạn có chắc muốn XÓA ${selectedRowKeys.length} trạm đã chọn?`}
            description="Hành động này không thể hoàn tác!"
            onConfirm={() => handleBulkAction('delete')}
            okText="Xóa"
            cancelText="Hủy"
            disabled={!hasSelected}
          >
            <Button type="primary" danger disabled={!hasSelected}>Delete</Button>
          </Popconfirm>
          
          <Button icon={<ReloadOutlined />} onClick={fetchStations}>Tải lại</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Thêm mới</Button>
        </Space>
      </div>
      {/* ============================================================================== */}
      
      <Table rowKey="id" rowSelection={rowSelection} columns={columns} dataSource={filteredStations} loading={loading} scroll={{ x: 1200 }} />
      <StationForm open={isModalOpen} onFinish={handleFinishModal} onCancel={handleCancelModal} loading={formLoading} initialValues={editingStation} />
    </>
  );
};

export default StationPage;