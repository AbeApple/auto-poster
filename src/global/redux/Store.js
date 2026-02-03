import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/UserSlice';
import displayReducer from './slices/DisplaySlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    display: displayReducer,
  },
});

export default store;
