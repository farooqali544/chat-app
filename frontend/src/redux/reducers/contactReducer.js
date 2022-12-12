import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchValue: "",
  contacts: [],
  activeContact: null,
};

export const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    searchHandler: (state, { payload }) => {
      state.searchValue = payload;
    },
    updateContacts: (state, { payload }) => {
      state.contacts = payload;
    },

    updateActiveContact: (state, { payload }) => {
      state.activeContact = payload;
    },

    setInitialContact: (state, { payload }) => {
      state.searchValue = "";
      state.contacts = [];
      state.activeContact = null;
    },
  },
});

export const { searchHandler, updateContacts, updateActiveContact, setInitialContact } = contactSlice.actions;

export default contactSlice.reducer;
