// src/components/StationForm.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, InputNumber, Row, Col, message, Typography } from 'antd';
import { locationService } from '../services/location.service';

const { Option } = Select;
const { Title } = Typography;

const StationForm = ({ open, onFinish, onCancel, loading, initialValues }) => {
  const [form] = Form.useForm();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Reset và set giá trị cho form mỗi khi initialValues thay đổi
    form.resetFields();
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form, open]);

  useEffect(() => {
    if (open) {
      locationService.getAllLocations()
        .then(setLocations)
        .catch(error => message.error(error.message));
    }
  }, [open]);

  const handleOk = () => {
    form.validateFields()
      .then(values => onFinish(values))
      .catch(info => console.log('Validate Failed:', info));
  };

  return (
    <Modal
      open={open}
      title={initialValues ? 'Chỉnh sửa Trạm' : 'Thêm mới Trạm'}
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="station_form">
        <Title level={5}>Thông tin cơ bản</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Tên trạm (Mount Point)" rules={[{ required: true, message: 'Vui lòng nhập tên trạm!' }]}>
              <Input placeholder="Ví dụ: HANO" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Trạng thái" initialValue="inactive" rules={[{ required: true }]}>
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={2} placeholder="Mô tả về trạm" />
        </Form.Item>

        <Title level={5}>Thông tin vị trí</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="location_id" label="Vị trí (Tỉnh/Thành)" rules={[{ required: true, message: 'Vui lòng chọn vị trí!' }]}>
              <Select placeholder="Chọn vị trí" showSearch optionFilterProp="children">
                {locations.map(loc => <Option key={loc.id} value={loc.id}>{loc.province_name}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="lat" label="Vĩ độ (Latitude)" rules={[{ required: true, message: 'Vui lòng nhập vĩ độ!' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="21.028511" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="lon" label="Kinh độ (Longitude)" rules={[{ required: true, message: 'Vui lòng nhập kinh độ!' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="105.804817" />
            </Form.Item>
          </Col>
        </Row>

        <Title level={5}>Thông tin nguồn (Source Caster)</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="source_host" label="Source Host" rules={[{ required: true, message: 'Vui lòng nhập host!' }]}>
              <Input placeholder="vd.rtk2go.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="source_port" label="Source Port" initialValue={2101} rules={[{ required: true, message: 'Vui lòng nhập port!' }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="source_mount_point" label="Source Mount Point" rules={[{ required: true, message: 'Vui lòng nhập mount point!' }]}>
              <Input placeholder="Tên mount point của nguồn" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="source_user" label="Source User (tùy chọn)">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="source_pass" label="Source Password (tùy chọn)">
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default StationForm;