import { configureStore } from "@reduxjs/toolkit";
import contactReducer from "./reducers/contactReducer";
import conversationReducer from "./reducers/conversationReducer";
import messageReducer from "./reducers/messageReducer";
import userReducer from "./reducers/userReducer";

export const store = configureStore({
  reducer: {
    userReducer: userReducer,
    conversationReducer: conversationReducer,
    contactReducer: contactReducer,
    messageReducer: messageReducer,
  },
});
