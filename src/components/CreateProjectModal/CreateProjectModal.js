import React from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Form, Input, Select } from 'antd';
import { closeModal, createProject } from '../../redux/projectSlice';

const { Option } = Select;

const CreateProjectModal = ({ isOpen }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const handleSubmit = (values) => {
    dispatch(createProject(values));
    form.resetFields();
  };

  return (
    <Modal
      title="Create New Project"
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={() => dispatch(closeModal())}
      okText="Confirm"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Project Name"
          rules={[{ required: true, message: 'Please enter project name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Project Type"
          rules={[{ required: true, message: 'Please select project type' }]}
        >
          <Select>
            <Option value="web">Web</Option>
            <Option value="mobile">Mobile App</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="Project Description"
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="primaryColor"
          label="Primary Color"
          initialValue="#00ffff"
        >
          <Input type="color" />
        </Form.Item>
        <Form.Item
          name="secondaryColor"
          label="Secondary Color"
          initialValue="#ffffff"
        >
          <Input type="color" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;