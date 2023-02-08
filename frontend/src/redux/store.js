import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/auth";
import messagesSlice from "./slices/messages";
import privateConversationsSlice from "./slices/privateConversations";
import searchChatSlice from "./slices/searchChat";
import searchUsersSlice from "./slices/searchUsers";

const appReducer = combineReducers({
  auth: authSlice,
  searchUsers: searchUsersSlice,
  privateConversations: privateConversationsSlice,
  messages: messagesSlice,
  searchChat: searchChatSlice,
});

const reducerProxy = (state, action) => {
  if (action.type === "RESET_STORE") {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: reducerProxy,
});
