import { createSlice } from "@reduxjs/toolkit";

const initialToken = JSON.parse(localStorage.getItem("token"));

const initialState = {
  user: null,
  token: initialToken,

};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, { payload }) => {
      state.token = payload.token;
      localStorage.setItem("token", JSON.stringify(payload.token));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    setUser: (state, {payload}) =>{
      state.user = payload.user;
    }
  },
});

export const { login, logout, setUser } = userSlice.actions;

export default userSlice.reducer;
