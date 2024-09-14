import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Select } from 'antd';
import { closeModal, createProject } from '../../redux/projectSlice';

const { Option } = Select;

const CreateProjectModal = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isModalVisible, projects } = useSelector(state => state.project);

  const handleOk = () => {
    console.log('handleOk called');
    form.validateFields().then(values => {
      console.log('Form values:', values);
      dispatch(createProject(values));
      console.log('Project created');
      form.resetFields();
      const newProjectId = projects.length + 1;
      navigate(`/detail/${newProjectId}`);
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  const handleCancel = () => {
    console.log('handleCancel called');
    dispatch(closeModal());
    form.resetFields();
  };

  return (
    <Modal
      title="新建项目"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="项目名称"
          rules={[{ required: true, message: '请输入项目名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="项目类型"
          rules={[{ required: true, message: '请选择项目类型' }]}
        >
          <Select>
            <Option value="web">网页</Option>
            <Option value="wechat">微信小程序</Option>
            <Option value="mobile">移动应用</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="项目备注"
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectModal;