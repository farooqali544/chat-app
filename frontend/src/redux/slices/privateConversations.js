import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../utils/apiUrl";
import { authHeader } from "../../utils/auth";
import { errorHandler } from "../../utils/errorHandler";

const initialState = {
  data: [],
  activeConversation: null,
  loading: false,
  error: "",
};

export const getPrivateConversations = createAsyncThunk(
  "GET_PRIVATE_CONVERSATIONS",
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${apiUrl}/conversations/private`, {
        headers: authHeader(),
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const privateConversationsSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    updateActivePrivateConversation: (state, { payload }) => {
      state.activeConversation = payload;
    },

    sortPrivateConversations: (state, { payload }) => {
      state.data.sort((a, b) => {
        return new Date(b.lastMessage.updatedAt) - new Date(a.lastMessage.updatedAt);
      });
    },

    addLastMessageToPrivateConversation: (state, { payload }) => {
      let index = state.data.findIndex(
        (conversation) => conversation._id === payload.conversationId
      );
      state.data[index].lastMessage = payload;
      state.data[index].unreadMessagesCount++;
    },

    markMessagesAsRead: (state, { payload }) => {
      let index = state.data.findIndex(
        (conversation) => conversation._id === payload.conversationId
      );
      state.data[index].unreadMessagesCount = 0;
      state.data[index].lastMessage = payload;
    },
  },

  extraReducers: {
    // SEARCH_USERS
    [getPrivateConversations.pending]: (state) => {
      state.loading = true;
      state.error = "";
    },

    [getPrivateConversations.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data = payload;
    },

    [getPrivateConversations.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const {
  updateActivePrivateConversation,
  addLastMessageToPrivateConversation,
  markMessagesAsRead,
  sortPrivateConversations,
} = privateConversationsSlice.actions;

export default privateConversationsSlice.reducer;
