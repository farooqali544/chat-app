import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    updateMessages: (state, { payload }) => {
      state.messages = payload;
    },
  },

  setInitialMessage: (state, { payload }) => {
    state.messages = [];
  },
});

export const { updateMessages,setInitialMessage} = messageSlice.actions;

export default messageSlice.reducer;
