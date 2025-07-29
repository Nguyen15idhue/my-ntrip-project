// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, message, Spin, Alert, Tooltip } from 'antd';
import { HddOutlined, WifiOutlined, RocketOutlined, ApiOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { stationService } from '../services/station.service';
import { roverService } from '../services/rover.service';
import { statusService } from '../services/status.service';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('vi');
dayjs.extend(relativeTime);

const { Title, Text } = Typography;

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalStations: 0, activeStations: 0, totalRovers: 0 });
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      // Dùng Promise.all để gọi các API song song, tăng hiệu suất
      const [stationsData, roversData, connectionsData] = await Promise.all([
        stationService.getAllStations(),
        roverService.getAllRovers(),
        // Chỉ gọi API này nếu là admin
        user.role === 'admin' ? statusService.getOnlineConnections() : Promise.resolve([]) 
      ]);

      setStats({
        totalStations: stationsData.length,
        activeStations: stationsData.filter(s => s.status === 'active').length,
        totalRovers: roversData.length,
      });
      
      setConnections(connectionsData);
      setError(null); // Xóa lỗi cũ nếu fetch thành công

    } catch (err) {
      message.error(err.message);
      setError(err.message); // Lưu lỗi để hiển thị trên UI
    } finally {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    fetchData();
    // Thiết lập tự động làm mới dữ liệu mỗi 10 giây
    const intervalId = setInterval(fetchData, 10000);
    // Dọn dẹp interval khi component bị unmount
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const onlineRoversColumns = [
    { title: 'Rover', dataIndex: 'roverUsername', key: 'roverUsername' },
    { title: 'Trạm (Mountpoint)', dataIndex: 'mountpoint', key: 'mountpoint' },
    { title: 'Địa chỉ IP', dataIndex: 'ipAddress', key: 'ipAddress' },
    {
      title: 'GNSS', dataIndex: 'gnssStatus', key: 'gnssStatus',
      render: status => <Tag color={status === 'RTK Fixed' ? 'success' : 'processing'}>{status || 'N/A'}</Tag>
    },
    {
      title: 'Vị trí cuối', key: 'lastPosition',
      render: (_, record) => record.lastPosition 
        ? <Text copyable>{`${record.lastPosition.lat.toFixed(6)}, ${record.lastPosition.lon.toFixed(6)}`}</Text>
        : 'N/A'
    },
    {
      title: 'Cập nhật cuối', dataIndex: 'lastPositionUpdate', key: 'lastPositionUpdate',
      render: text => <Tooltip title={dayjs(text).format('HH:mm:ss DD/MM/YYYY')}>{dayjs(text).fromNow()}</Tooltip>
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
  }

  return (
    <div>
      <Title level={2}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Tổng số trạm" value={stats.totalStations} prefix={<HddOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Trạm đang hoạt động" value={stats.activeStations} suffix={`/ ${stats.totalStations}`} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Tổng số tài khoản Rover" value={stats.totalRovers} prefix={<RocketOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic title="Rover đang online" value={connections.length} prefix={<WifiOutlined />} />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: '24px' }}>
        <Title level={4}>Giám sát Rover đang hoạt động</Title>
        {user.role === 'admin' ? (
          <Table
            columns={onlineRoversColumns}
            dataSource={connections}
            rowKey="sessionId"
            pagination={{ pageSize: 5 }}
            scroll={{ x: 800 }}
          />
        ) : (
          <Alert
            message="Chức năng yêu cầu quyền Admin"
            description="Chức năng giám sát rover đang hoạt động chỉ dành cho tài khoản có quyền Administrator."
            type="warning"
            showIcon
            icon={<ApiOutlined />}
          />
        )}
        {error && user.role === 'admin' && (
             <Alert
                message="Không thể tải dữ liệu giám sát"
                description={error}
                type="error"
                showIcon
                style={{marginTop: '16px'}}
            />
        )}
      </div>
    </div>
  );
};

export default DashboardPage;