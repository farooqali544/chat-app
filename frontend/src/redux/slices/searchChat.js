import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../utils/apiUrl";
import { authHeader } from "../../utils/auth";
import { errorHandler } from "../../utils/errorHandler";

const initialState = {
  data: {
    contacts: [],
    messages: [],
    privateConversations: [],
    groupConversations: [],
  },
  loading: false,
  error: "",
};

export const searchChatAPI = createAsyncThunk(
  "SEARCH_CHAT",
  async (searchValue, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${apiUrl}/chat/search?q=${searchValue}`, {
        headers: authHeader(),
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const searchChatSlice = createSlice({
  name: "searchChat",
  initialState,
  reducers: {},

  extraReducers: {
    [searchChatAPI.pending]: (state, { payload }) => {
      state.loading = true;
      state.error = "";
    },
    [searchChatAPI.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data = payload;
    },
    [searchChatAPI.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = "";
    },
  },
});

export const {} = searchChatSlice.actions;

export default searchChatSlice.reducer;
