import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import projectService from './projectService';

const initialState = {
  projects: [],
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (data, thunkAPI) => {
    try {
      const res = await projectService.createProject(data);
      return res;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProject.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.products = action.payload.products;
        state.message = action.payload.message;
        state.isError = false;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = projectSlice.actions;
export default projectSlice.reducer;
