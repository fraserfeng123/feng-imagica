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
        type: action.payload.type === 'mobile' ? 'mobile' : 'web',
        primaryColor: action.payload.primaryColor || '#00ffff',
        secondaryColor: action.payload.secondaryColor || '#ffffff',
      };
      state.projects.push(newProject);
      saveProjectsToLocalStorage(state.projects);
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(project => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = {
          ...state.projects[index],
          ...action.payload,
          type: action.payload.type === 'mobile' ? 'mobile' : 'web',
        };
        saveProjectsToLocalStorage(state.projects);
      }
    },
    openModal: (state) => {
      state.isModalVisible = true;
    },
    closeModal: (state) => {
      state.isModalVisible = false;
    },
    createProject: (state, action) => {
      const newProject = {
        ...action.payload,
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
  addProject,
  updateProject,
  updateProjectCode, 
  updateProjectChatList 
} = projectSlice.actions;

export const selectLastCreatedProjectId = (state) => state.project.lastCreatedProjectId;

export default projectSlice.reducer;