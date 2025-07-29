// src/components/RoverForm.jsx
import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, DatePicker, Row, Col, message } from 'antd';
import { stationService } from '../services/station.service';
import { userService } from '../services/user.service';
import { useAuth } from '../context/AuthContext';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const RoverForm = ({ open, onFinish, onCancel, loading, initialValues }) => {
  const [form] = Form.useForm();
  const { user: currentUser } = useAuth();
  const [stations, setStations] = useState([]);
  const [users, setUsers] = useState([]);
  
  const isEditing = !!initialValues;

  useEffect(() => {
    if (open) {
      // Fetch data cho các dropdown
      stationService.getAllStations().then(setStations).catch(err => message.error(err.message));
      if (currentUser.role === 'admin') {
        userService.getAllUsers().then(setUsers).catch(err => message.error(err.message));
      }
    }
  }, [open, currentUser.role]);

  useEffect(() => {
    form.resetFields();
    if (initialValues) {
      // Chuyển đổi date string sang dayjs object cho RangePicker
      const dateRange = (initialValues.start_date && initialValues.end_date)
        ? [dayjs(initialValues.start_date), dayjs(initialValues.end_date)]
        : null;
      form.setFieldsValue({ ...initialValues, date_range: dateRange });
    }
  }, [initialValues, form, open]);

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        // Xử lý dữ liệu trước khi gửi đi
        const { date_range, ...restValues } = values;
        const finalValues = {
          ...restValues,
          start_date: date_range ? date_range[0].toISOString() : null,
          end_date: date_range ? date_range[1].toISOString() : null,
        };
        // Nếu là edit và không nhập password, không gửi trường password
        if (isEditing && !finalValues.password) {
            delete finalValues.password;
        }
        onFinish(finalValues);
      })
      .catch(info => console.log('Validate Failed:', info));
  };

  return (
    <Modal open={open} title={isEditing ? 'Chỉnh sửa Rover' : 'Thêm mới Rover'} onCancel={onCancel} onOk={handleOk} confirmLoading={loading} width={800} destroyOnClose>
      <Form form={form} layout="vertical" name="rover_form">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Vui lòng nhập username!' }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="password" label="Password" help={isEditing ? "Để trống nếu không muốn đổi" : ""} rules={[{ required: !isEditing, message: 'Vui lòng nhập password!' }]}>
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="station_id" label="Gán vào trạm" rules={[{ required: true, message: 'Vui lòng chọn trạm!' }]}>
                <Select placeholder="Chọn trạm" showSearch optionFilterProp="children">
                    {stations.map(st => <Option key={st.id} value={st.id}>{st.name}</Option>)}
                </Select>
                </Form.Item>
            </Col>
            {currentUser.role === 'admin' && (
                <Col span={12}>
                    <Form.Item name="user_id" label="Người sở hữu" help="Chỉ Admin có thể thấy trường này">
                        <Select placeholder="Chọn người dùng" showSearch optionFilterProp="children" allowClear>
                            {users.map(u => <Option key={u.id} value={u.id}>{u.name} ({u.email})</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
            )}
        </Row>
        <Form.Item name="description" label="Mô tả">
          <Input.TextArea rows={2} />
        </Form.Item>
        <Row gutter={16}>
            <Col span={12}>
                <Form.Item name="status" label="Trạng thái" initialValue="active">
                    <Select>
                        <Option value="active">Active</Option>
                        <Option value="inactive">Inactive</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col span={12}>
                <Form.Item name="date_range" label="Thời gian hiệu lực">
                    <RangePicker style={{ width: '100%' }} />
                </Form.Item>
            </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default RoverForm;