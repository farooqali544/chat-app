import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  activeConversation: null,
  onlineConversations: {},
};

export const conversationSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateConversations: (state, { payload }) => {
      state.conversations = payload;
    },

    changeActiveConversation: (state, { payload }) => {
      state.activeConversation = payload;
    },

    updateOnlineConversations: (state, { payload }) => {
      state.onlineConversations = payload;
    },

    //in case of logout
    setInitialConversation: (state, { payload }) => {
      state.conversations = [];
      state.activeConversation = null;
      state.onlineConversations = {};
    },
  },
});

export const { updateConversations, changeActiveConversation, updateOnlineConversations, setInitialConversation } = conversationSlice.actions;

export default conversationSlice.reducer;
