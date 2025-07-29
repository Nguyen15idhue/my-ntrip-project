// src/components/StationForm.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, message, Typography, Button, Space } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import { locationService } from '../services/location.service';
// Import service mới
import { utilsService } from '../services/utils.service';

const { Option } = Select;
const { Title } = Typography;

const StationForm = ({ open, onFinish, onCancel, loading, initialValues }) => {
  const [form] = Form.useForm();
  const [locations, setLocations] = useState([]);

  // ====================== STATE MỚI ======================
  const [mountpoints, setMountpoints] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // =======================================================

  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue(initialValues);
      // Nếu là chế độ sửa và đã có source_mount_point, thêm nó vào danh sách để hiển thị
      if (initialValues.source_mount_point) {
        setMountpoints([{ mountpoint: initialValues.source_mount_point }]);
      }
    } else {
        // Reset danh sách mountpoint khi mở form thêm mới
        setMountpoints([]);
    }
  }, [initialValues, form, open]);

  useEffect(() => {
    if (open) {
      locationService.getAllLocations()
        .then(setLocations)
        .catch(error => message.error(error.message));
    }
  }, [open]);

  // ====================== HÀM MỚI ĐỂ LẤY MOUNTPOINTS ======================
  const handleFetchMountpoints = async () => {
    try {
      // Lấy giá trị host và port hiện tại từ form
      const host = form.getFieldValue('source_host');
      const port = form.getFieldValue('source_port');

      if (!host || !port) {
        message.warning('Vui lòng nhập đầy đủ Source Host và Source Port.');
        return;
      }
      
      setIsFetching(true);
      const data = await utilsService.fetchMountpoints(host, port);
      
      if (data && data.length > 0) {
        setMountpoints(data);
        message.success(`Đã tìm thấy ${data.length} mountpoint.`);
      } else {
        setMountpoints([]);
        message.info('Không tìm thấy mountpoint nào.');
      }
      
      // Xóa giá trị mountpoint cũ để người dùng chọn lại từ danh sách mới
      form.setFieldsValue({ source_mount_point: undefined });
      
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  // Tự động điền thông tin khi chọn mountpoint
  const handleMountpointChange = (value) => {
    const selectedMountpoint = mountpoints.find(mp => mp.mountpoint === value);
    if (selectedMountpoint) {
        form.setFieldsValue({
            name: selectedMountpoint.mountpoint,
            lat: parseFloat(selectedMountpoint.latitude),
            lon: parseFloat(selectedMountpoint.longitude),
        });
    }
  };
  // =========================================================================

  const handleOk = () => {
    form.validateFields()
      .then(values => onFinish(values))
      .catch(info => console.log('Validate Failed:', info));
  };

  return (
    <Modal open={open} title={initialValues ? 'Chỉnh sửa Trạm' : 'Thêm mới Trạm'} onCancel={onCancel} onOk={handleOk} confirmLoading={loading} width={800} destroyOnClose>
      <Form form={form} layout="vertical" name="station_form">
        {/* ... Các Form.Item khác giữ nguyên ... */}
        <Title level={5}>Thông tin cơ bản</Title>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="name" label="Tên trạm (Mount Point)" rules={[{ required: true }]}>
              <Input placeholder="Sẽ tự điền khi chọn Source Mount Point" />
          </Form.Item></Col>
          <Col span={12}><Form.Item name="status" label="Trạng thái" initialValue="inactive" rules={[{ required: true }]}>
              <Select><Option value="active">Active</Option><Option value="inactive">Inactive</Option></Select>
          </Form.Item></Col>
        </Row>
        <Form.Item name="description" label="Mô tả"><Input.TextArea rows={2} /></Form.Item>

        <Title level={5}>Thông tin vị trí</Title>
        <Row gutter={16}>
          <Col span={8}><Form.Item name="location_id" label="Vị trí (Tỉnh/Thành)" rules={[{ required: true }]}>
              <Select placeholder="Chọn vị trí">{locations.map(loc => <Option key={loc.id} value={loc.id}>{loc.province_name}</Option>)}</Select>
          </Form.Item></Col>
          <Col span={8}><Form.Item name="lat" label="Vĩ độ (Latitude)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
          </Form.Item></Col>
          <Col span={8}><Form.Item name="lon" label="Kinh độ (Longitude)" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
          </Form.Item></Col>
        </Row>

        <Title level={5}>Thông tin nguồn (Source Caster)</Title>
        <Row gutter={16}>
          <Col span={12}><Form.Item name="source_host" label="Source Host" rules={[{ required: true }]}>
              <Input placeholder="vd.rtk2go.com" />
          </Form.Item></Col>
          <Col span={12}><Form.Item name="source_port" label="Source Port" initialValue={2101} rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
          </Form.Item></Col>
        </Row>
        
        {/* ====================== THAY ĐỔI GIAO DIỆN Ở ĐÂY ====================== */}
        <Row gutter={16} align="bottom">
          <Col span={12}>
            <Form.Item name="source_mount_point" label="Source Mount Point" rules={[{ required: true, message: 'Vui lòng chọn mount point!' }]}>
              <Select 
                placeholder="Nhấn nút Get Mountpoints để tải danh sách" 
                showSearch 
                optionFilterProp="children"
                onChange={handleMountpointChange}
              >
                {mountpoints.map(mp => <Option key={mp.mountpoint} value={mp.mountpoint}>{mp.mountpoint}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
                <Button 
                    type="default" 
                    icon={<SyncOutlined />} 
                    onClick={handleFetchMountpoints}
                    loading={isFetching}
                    style={{width: '100%'}}
                >
                    Get Mountpoints
                </Button>
            </Form.Item>
          </Col>
        </Row>
        {/* ======================================================================= */}
        
        <Row gutter={16}>
          <Col span={12}><Form.Item name="source_user" label="Source User (tùy chọn)"><Input /></Form.Item></Col>
          <Col span={12}><Form.Item name="source_pass" label="Source Password (tùy chọn)"><Input.Password /></Form.Item></Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default StationForm;