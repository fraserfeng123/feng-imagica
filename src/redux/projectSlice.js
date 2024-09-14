import { createSlice } from '@reduxjs/toolkit';

const loadProjectsFromLocalStorage = () => {
  const storedProjects = localStorage.getItem('projects');
  if (storedProjects) {
    return JSON.parse(storedProjects);
  }
  return [
    { id: 1, name: '电商网站重构', description: '对现有电商平台进行全面升级和重构', type: 'web', members: 5, code: null, chatList: [] },
    { id: 2, name: '健康追踪App', description: '开发一款用于追踪用户健康数据的移动应用', type: 'mobile', members: 3, code: null, chatList: [] },
    { id: 3, name: '社交媒体小程序', description: '为年轻用户群体开发一款创新的社交媒体小程序', type: 'wechat', members: 4, code: null, chatList: [] },
    { id: 4, name: '企业资源管理系统', description: '为中型企业开发一套全面的资源管理系统', type: 'web', members: 6, code: null, chatList: [] },
    { id: 5, name: '在线教育平台', description: '开发一个支持多媒体内容的在线教育平台', type: 'web', members: 4, code: null, chatList: [] },
  ];
};

const saveProjectsToLocalStorage = (projects) => {
  localStorage.setItem('projects', JSON.stringify(projects));
};

const projectSlice = createSlice({
  name: 'project',
  initialState: {
    projects: loadProjectsFromLocalStorage(),
    isModalVisible: false,
  },
  reducers: {
    openModal: (state) => {
      state.isModalVisible = true;
    },
    closeModal: (state) => {
      state.isModalVisible = false;
    },
    createProject: (state, action) => {
      const newProject = {
        id: state.projects.length + 1,
        ...action.payload,
        members: 1,
        code: null,
        chatList: [],
      };
      state.projects.push(newProject);
      state.isModalVisible = false;
      saveProjectsToLocalStorage(state.projects);
    },
    updateProjectCode: (state, action) => {
      const { id, code } = action.payload;
      const project = state.projects.find(p => p.id === id);
      if (project) {
        project.code = code;
        saveProjectsToLocalStorage(state.projects);
      }
    },
    updateProjectChatList: (state, action) => {
      const { id, chatList } = action.payload;
      const project = state.projects.find(p => p.id === id);
      if (project) {
        project.chatList = chatList;
        saveProjectsToLocalStorage(state.projects);
      }
    },
  },
});

export const { 
  openModal, 
  closeModal, 
  createProject, 
  updateProjectCode, 
  updateProjectChatList 
} = projectSlice.actions;

export default projectSlice.reducer;