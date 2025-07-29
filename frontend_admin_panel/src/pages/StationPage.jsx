// src/pages/StationPage.jsx
import React, { useState, useEffect } from 'react';
import { Table, Typography, Tag, message, Button, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { stationService } from '../services/station.service';

const { Title } = Typography;

const StationPage = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStations = async () => {
    setLoading(true);
    try {
      const data = await stationService.getAllStations();
      setStations(data);
    } catch (error) {
      message.error('Không thể tải danh sách trạm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Tên trạm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Vị trí',
      dataIndex: 'Location',
      key: 'location',
      render: (location) => location?.province_name || 'Chưa có',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Sửa</a>
          <a>Xóa</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Trạm (Stations)</Title>
        <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchStations}>
                Tải lại
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
                Thêm mới
            </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={stations}
        loading={loading}
        rowKey="id"
      />
    </>
  );
};

export default StationPage;