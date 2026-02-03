import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  creatingNew: false,
  selectedCarData: null,
  topMenuOpen: false,
  refreshTrigger: 0,
  viewingImageId: null,
  addingImagesToCarId: null,
  deletingImage: null,
};

const displaySliceReducer = createSlice({
  name: 'display',
  initialState,
  reducers: {
    setCreatingNew: (state, action) => {
      state.creatingNew = action.payload;
    },
    setTopMenuOpen: (state, action) => {
      state.topMenuOpen = action.payload;
    },
    triggerRefresh: (state) => {
      state.refreshTrigger += 1;
    },
    setViewingImageId: (state, action) => {
      state.viewingImageId = action.payload;
    },
    setAddingImagesToCarId: (state, action) => {
      state.addingImagesToCarId = action.payload;
    },
    setDeletingImage: (state, action) => {
      state.deletingImage = action.payload;
    },
    setSelectedCarData: (state, action) => {
      state.selectedCarData = action.payload;
    },
  },
});

export const { setCreatingNew, setTopMenuOpen, triggerRefresh, setViewingImageId, setAddingImagesToCarId, setDeletingImage, setSelectedCarData } = displaySliceReducer.actions;
export default displaySliceReducer.reducer;
