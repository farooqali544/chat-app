import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { apiUrl } from "../../utils/apiUrl";
import { authHeader } from "../../utils/auth";
import { errorHandler } from "../../utils/errorHandler";
import { markMessagesAsRead, updateActivePrivateConversation } from "./privateConversations";

const initialState = {
  data: {},
  allMessagesFetched: {},
  loading: false,
  error: "",
};

export const getMessages = createAsyncThunk(
  "GET_MESSAGES",
  async (conversationId, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(`${apiUrl}/messages/${conversationId}`, {
        headers: authHeader(),
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const loadMoreMessages = createAsyncThunk(
  "LOAD_MORE_MESSAGES",
  async ({ conversationId, firstMessageTime }, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.get(
        `${apiUrl}/messages/${conversationId}?firstMessageTime=${firstMessageTime}`,
        {
          headers: authHeader(),
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const sendMessage = createAsyncThunk(
  "SEND_MESSAGE",
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${apiUrl}/messages/sendMessage`, data, {
        headers: authHeader(),
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const readMessages = createAsyncThunk(
  "READ_MESSAGES",
  async (payload, { rejectWithValue, dispatch }) => {
    dispatch(markMessagesAsRead(payload));
    try {
      const response = await axios.patch(
        `${apiUrl}/messages/readMessages/${payload.conversationId}`,
        null,
        {
          headers: authHeader(),
        }
      );

      return response.data;
    } catch (err) {
      return rejectWithValue(errorHandler(err));
    }
  }
);

export const messagesSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    insertMessage: (state, { payload }) => {
      if (!state.data[payload.conversationId]) return;
      state.data[payload.conversationId].push(payload);
    },
  },

  extraReducers: {
    // GET_MESSAGES
    [getMessages.pending]: (state) => {
      state.loading = true;
      state.error = "";
    },

    [getMessages.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data[payload.conversationId] = payload.messages;
      state.allMessagesFetched[payload.conversationId] = payload.allMessagesFetched;
    },

    [getMessages.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    //SEND MESSAGE

    [sendMessage.pending]: (state) => {
      state.loading = true;
      state.error = "";
    },

    [sendMessage.fulfilled]: (state, { payload }) => {
      state.loading = false;

      state.data[payload.conversationId].push(payload);
    },

    [loadMoreMessages.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },

    [loadMoreMessages.pending]: (state) => {
      state.loading = true;
      state.error = "";
    },

    [loadMoreMessages.fulfilled]: (state, { payload }) => {
      state.loading = false;
      let temp = [...payload.messages, ...state.data[payload.conversationId]];
      state.data[payload.conversationId] = temp;
      state.allMessagesFetched[payload.conversationId] = payload.allMessagesFetched;
    },

    [sendMessage.rejected]: (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    },
  },
});

export const { insertMessage } = messagesSlice.actions;

export default messagesSlice.reducer;
