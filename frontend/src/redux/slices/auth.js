import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../utils/apiUrl";
import { authHeader } from "../../utils/auth";
import { errorHandler } from "../../utils/errorHandler";

const initialState = {
  user: {},
  loading: false,
  error: "",
  initialLoad: true,
};

export const signup = createAsyncThunk(
  "SIGNUP_USER",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${apiUrl}/users/signup`, data);
      const { token, ...userDetails } = response.data;
      dispatch(storeToken(token));

      return userDetails;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const login = createAsyncThunk("LOGIN_USER", async (data, { rejectWithValue, dispatch }) => {
  try {
    const response = await axios.post(`${apiUrl}/users/login`, data);
    const { token, ...userDetails } = response.data;
    dispatch(storeToken(token));
    return userDetails;
  } catch (err) {
    return rejectWithValue(errorHandler(err));
  }
});

export const loadUser = createAsyncThunk(
  "GET_USER",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${apiUrl}/users/getUser`, {
        headers: authHeader(),
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    storeToken: (state, { payload }) => {
      localStorage.setItem("token", payload);
    },
    logout: (state) => {
      state.user = {};
      localStorage.removeItem("token");
    },
  },

  extraReducers: {
    // SIGNUP_USER
    [signup.pending]: (state) => {
      state.loading = true;
      state.error = "";
    },

    [signup.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.loading = false;
      state.initialLoad = false;
    },

    [signup.rejected]: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
      state.initialLoad = false;
    },

    //LOGIN_USER
    [login.pending]: (state) => {
      state.loading = true;
      state.error = "";
    },

    [login.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.loading = false;
      state.initialLoad = false;
    },

    [login.rejected]: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
      state.initialLoad = false;
    },

    //GET_USER
    [loadUser.pending]: (state) => {
      state.loading = true;
      state.error = "";
    },

    [loadUser.fulfilled]: (state, { payload }) => {
      state.user = payload;
      state.loading = false;
      state.initialLoad = false;
    },

    [loadUser.rejected]: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
      state.initialLoad = false;
    },
  },
});

export const { storeToken, logout,reset } = authSlice.actions;

export default authSlice.reducer;
