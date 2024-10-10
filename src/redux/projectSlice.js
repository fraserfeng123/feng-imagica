import { createSlice } from '@reduxjs/toolkit';

const loadProjectsFromLocalStorage = () => {
  const storedProjects = localStorage.getItem('projects');
  if (storedProjects) {
    return JSON.parse(storedProjects);
  }
  return [];
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
    addProject: (state, action) => {
      const newProject = {
        ...action.payload,
      };
      state.projects.push(newProject);
      saveProjectsToLocalStorage(state.projects);
    },
    updateProject: (state, action) => {
      if (action.payload._delete) {
        // 如果是删除操作
        state.projects = state.projects.filter(project => project.id !== action.payload.id);
      } else {
        // 如果是更新操作
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = {
            ...state.projects[index],
            ...action.payload,
          };
        }
      }
      saveProjectsToLocalStorage(state.projects);
    },
    openModal: (state) => {
      state.isModalVisible = true;
    },
    closeModal: (state) => {
      state.isModalVisible = false;
    },
    createProject: (state, action) => {
      state.projects.push(action.payload);
    },
    updateProjectNodes: (state, action) => {
      const { id, nodes } = action.payload;
      const project = state.projects.find(p => p.id === id);
      if (project) {
        project.nodes = nodes;
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
    updateProjectCode: (state, action) => {
      const { id, nodes, title, description } = action.payload;
      const project = state.projects.find(p => p.id === id);
      if (project) {
        project.nodes = nodes;
        if (title !== undefined) project.name = title;
        if (description !== undefined) project.description = description;
        saveProjectsToLocalStorage(state.projects);
      }
    },
  },
});

export const { 
  openModal, 
  closeModal, 
  createProject, 
  addProject,
  updateProject,
  updateProjectCode, 
  updateProjectChatList 
} = projectSlice.actions;

export const selectLastCreatedProjectId = (state) => state.project.lastCreatedProjectId;

export default projectSlice.reducer;