// src/pages/StationPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Table, Typography, Tag, message, Button, Space, Modal, Popconfirm, Input, Tooltip, Spin } from 'antd';
import { PlusOutlined, ReloadOutlined, PlayCircleOutlined, PauseCircleOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { stationService } from '../services/station.service';
import StationForm from '../components/StationForm';

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
  
  // TỐI ƯU HÓA: Bỏ state `liveStatuses` vì không cần thiết nữa.

  // --- DATA FETCHING ---
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

  // --- MODAL HANDLERS ---
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
      fetchStations(); // Chỉ cần tải lại danh sách trạm
    } catch (error) {
      message.error(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // --- ROW & BULK ACTION HANDLERS ---
  const handleDelete = async (id) => {
    try {
      await stationService.deleteStation(id);
      message.success(`Đã xóa trạm #${id}`);
      fetchStations();
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleStartStop = async (record) => {
    // Tạm thời vô hiệu hóa nút trong khi chờ
    setLoading(true);
    const isStarting = record.status !== 'active';
    const actionService = isStarting ? stationService.startStation : stationService.stopStation;
    try {
      const response = await actionService(record.id);
      message.success(response.message);
      // Tải lại sau một khoảng trễ để backend có thời gian xử lý
      setTimeout(fetchStations, 1500);
    } catch(error) {
      message.error(error.message);
    } finally {
        // Bật lại bảng sau khi hoàn tất
        // Việc này sẽ được xử lý bởi fetchStations() nên không cần setLoading(false) ở đây
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn ít nhất một trạm.');
      return;
    }
    Modal.confirm({
      title: `Xác nhận hành động hàng loạt`,
      content: `Bạn có chắc muốn '${action}' ${selectedRowKeys.length} trạm đã chọn?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        setLoading(true); // Hiển thị loading trên toàn bảng
        try {
          const response = await stationService.bulkAction(action, selectedRowKeys);
          message.success(response.message);
          if (response.results?.failed?.length > 0) {
            message.warning(`${response.results.failed.length} hành động thất bại.`);
          }
          setSelectedRowKeys([]);
          setTimeout(fetchStations, 1500); // Tải lại sau khi thực hiện
        } catch(error) {
          message.error(error.message);
          setLoading(false); // Tắt loading nếu có lỗi
        }
      }
    });
  };

  // --- TABLE CONFIG ---
  const filteredStations = useMemo(() => stations.filter(station =>
    station.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (station.description && station.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ), [searchTerm, stations]);
  
  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80, sorter: (a, b) => a.id - b.id },
    { title: 'Tên trạm', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    {
      title: 'Trạng thái cấu hình', dataIndex: 'status', key: 'status',
      filters: [{ text: 'Active', value: 'active' }, { text: 'Inactive', value: 'inactive' }],
      onFilter: (value, record) => record.status === value,
      render: (status) => <Tag color={status === 'active' ? 'green' : 'volcano'}>{status.toUpperCase()}</Tag>,
    },
    // ================== CỘT MỚI THAY THẾ CHO TRẠNG THÁI HOẠT ĐỘNG ==================
    {
      title: 'Nguồn (Host:Port)',
      key: 'source',
      render: (_, record) => (
        <Text copyable={{ text: `${record.source_host}:${record.source_port}` }}>
          {`${record.source_host}:${record.source_port}`}
        </Text>
      ),
    },
    // ==============================================================================
    { title: 'Mount Point', dataIndex: 'source_mount_point', key: 'source_mount_point' },
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
          <Tooltip title="Chỉnh sửa">
            <Button shape="circle" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Popconfirm title="Xóa trạm?" description="Hành động này không thể hoàn tác." onConfirm={() => handleDelete(record.id)} okText="Xóa" cancelText="Hủy">
            <Tooltip title="Xóa">
              <Button shape="circle" danger icon={<DeleteOutlined />} />
            </Tooltip>
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
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0' }}>
        <Search placeholder="Tìm kiếm theo tên, mô tả..." onChange={(e) => setSearchTerm(e.target.value)} style={{ width: 300 }} allowClear />
        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchStations}>Tải lại</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddNew}>Thêm mới</Button>
        </Space>
      </div>

      {hasSelected && (
        <div style={{ marginBottom: 16, background: '#e6f7ff', padding: '8px 16px', border: '1px solid #91d5ff', borderRadius: '4px' }}>
          <Space>
            <Text strong>{selectedRowKeys.length} trạm được chọn</Text>
            <Button size="small" onClick={() => handleBulkAction('start')}>Start</Button>
            <Button size="small" onClick={() => handleBulkAction('stop')}>Stop</Button>
            <Button size="small" danger onClick={() => handleBulkAction('delete')}>Delete</Button>
          </Space>
        </div>
      )}

      <Table rowSelection={rowSelection} columns={columns} dataSource={filteredStations} loading={loading} rowKey="id" scroll={{ x: 1200 }} />
      <StationForm open={isModalOpen} onFinish={handleFinishModal} onCancel={handleCancelModal} loading={formLoading} initialValues={editingStation} />
    </>
  );
};

export default StationPage;