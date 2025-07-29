// src/components/StationForm.jsx
import React, { useState, useEffect } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select, InputNumber, message } from 'antd';
import { locationService } from '../services/location.service';

const { Option } = Select;

const StationForm = ({ open, onClose, onSave, loading, initialData }) => {
  const [form] = Form.useForm();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Tải danh sách locations khi component được mở
    if (open) {
      locationService.getAllLocations()
        .then(setLocations)
        .catch(() => message.error('Không thể tải danh sách vị trí'));
    }
  }, [open]);

  useEffect(() => {
    // Điền dữ liệu vào form khi sửa
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const handleSave = () => {
    form.validateFields()
      .then(values => {
        onSave(values);
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  const title = initialData ? 'Sửa thông tin trạm' : 'Thêm trạm mới';

  return (
    <Drawer
      title={title}
      width={720}
      onClose={onClose}
      open={open}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button onClick={handleSave} type="primary" loading={loading}>
            Lưu
          </Button>
        </>
      }
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Tên trạm (Mount Point)" rules={[{ required: true, message: 'Vui lòng nhập tên trạm!' }]}>
              <Input placeholder="VD: ST01_HCM" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="location_id" label="Vị trí" rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}>
              <Select placeholder="Chọn một vị trí">
                {locations.map(loc => <Option key={loc.id} value={loc.id}>{loc.province_name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="lat" label="Vĩ độ (Latitude)" rules={[{ required: true, message: 'Vui lòng nhập vĩ độ!' }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lon" label="Kinh độ (Longitude)" rules={[{ required: true, message: 'Vui lòng nhập kinh độ!' }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={2} placeholder="Nhập mô tả cho trạm" />
            </Form.Item>
          </Col>
        </Row>
        <Title level={4}>Cấu hình nguồn (Source)</Title>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="source_host" label="Source Host" rules={[{ required: true, message: 'Vui lòng nhập host!' }]}>
                    <Input placeholder="VD: 123.45.67.89" />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="source_port" label="Source Port" rules={[{ required: true, message: 'Vui lòng nhập port!' }]}>
                    <InputNumber style={{ width: '100%' }} placeholder="VD: 2101" />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="source_user" label="Source User (nếu có)">
                    <Input />
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="source_pass" label="Source Password (nếu có)">
                    <Input.Password />
                </Form.Item>
            </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="source_mount_point" label="Source Mount Point" rules={[{ required: true, message: 'Vui lòng nhập mount point!' }]}>
                    <Input placeholder="VD: RTCM3" />
                </Form.Item>
            </Col>
             <Col span={12}>
                <Form.Item name="status" label="Trạng thái" initialValue="inactive">
                  <Select>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>
            </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default StationForm;