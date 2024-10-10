import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authService from './authService';

// Check if the user is authenticated
const token = localStorage.getItem('token');
let saveUser = null;
if (token) {
  const tokenParts = token.split('.');
  if (tokenParts.length < 2) {
    console.error('Invalid token format');
  } else {
    const t = tokenParts[1];
    try {
      saveUser = t ? JSON.parse(atob(t)) : null;
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
}

const initialState = {
  auth: saveUser ? saveUser : null,
  user: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  message: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset2: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    resetMessage: (state) => {
      state.message = '';
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(signOut.fulfilled, (state) => {
        state.user = null;
        state.auth = null;
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.isError = false;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const signOut = createAsyncThunk('/signout', async () => {
  await authService.signOut();
  return;
});

export const signin = createAsyncThunk(
  '/signin',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.signin(userData);
      return response;
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

export const getUser = createAsyncThunk('/getUser', async (thunkAPI) => {
  try {
    const result = await authService.getUser();
    return result;
  } catch (error) {
    const message =
      error?.response?.data?.message || error?.message || error.toString();
    if (error?.response?.data?.status === 404) {
      localStorage.clear();
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const { reset2, resetMessage } = authSlice.actions;
export default authSlice.reducer;
