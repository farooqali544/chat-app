import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../utils/apiUrl";
import { authHeader } from "../../utils/auth";
import { errorHandler } from "../../utils/errorHandler";

const initialState = {
  data: [],
  loading: false,
  error: "",
};

export const searchUsers = createAsyncThunk(
  "SEARCH_USERS",
  async (searchValue, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${apiUrl}/users/searchUsersByNameOrEmail/${searchValue}`, {
        headers: authHeader(),
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const addContact = createAsyncThunk(
  "ADD_CONTACT",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      await axios.patch(`${apiUrl}/users/addContact/${userId}`, null, {
        headers: authHeader(),
      });

      return userId;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const removeContact = createAsyncThunk(
  "REMOVE_CONTACT",
  async (userId, { rejectWithValue, dispatch }) => {
    try {
      await axios.patch(`${apiUrl}/users/removeContact/${userId}`, null, {
        headers: authHeader(),
      });

      return userId;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const searchUsersSlice = createSlice({
  name: "searchUsers",
  initialState,
  reducers: {
    resetSearchUsers: (state) => {
      state.loading = false;
      state.error = "";
      state.data = [];
    },
  },

  extraReducers: {
    // SEARCH_USERS
    [searchUsers.pending]: (state) => {
      state.loading = true;
      state.error = "";
    },

    [searchUsers.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data = payload;
    },

    [searchUsers.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    // Add Contact
    [addContact.fulfilled]: (state, { payload }) => {
      state.data = state.data.map((user) =>
        user._id === payload ? { ...user, isContact: true } : user
      );
    },

    [addContact.rejected]: (state, { payload }) => {
      state.error = payload;
    },

    //Remove Contact
    [removeContact.fulfilled]: (state, { payload }) => {
      state.data = state.data.map((user) =>
        user._id === payload ? { ...user, isContact: false } : user
      );
    },

    [removeContact.rejected]: (state, { payload }) => {
      state.error = payload;
    },
  },
});

export const { resetSearchUsers } = searchUsersSlice.actions;

export default searchUsersSlice.reducer;
