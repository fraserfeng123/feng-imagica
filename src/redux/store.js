import { configureStore } from '@reduxjs/toolkit';
import projectReducer from './projectSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,  // 注意这里使用 'project' 而不是 'projects'
  },
});