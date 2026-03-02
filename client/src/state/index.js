import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null, // 👈 Ye batayega ki user logged in hai ya nahi
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    // 👈 Naye Auth Reducers
    setLogin: (state, action) => {
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.user = null;
    },
  },
});

export const { setMode, setLogin, setLogout } = globalSlice.actions;
export default globalSlice.reducer;