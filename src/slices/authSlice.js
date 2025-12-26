import { createSlice } from "@reduxjs/toolkit";

// Load token + user from localStorage when app starts
const token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token"))
  : null;

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;

const initialState = {
  signupData: null,
  loading: false,
  token: token,
  user: user, // ✅ restore user on refresh
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem("token", JSON.stringify(action.payload)); // keep in sync
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload)); // keep in sync
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.signupData = null; // optional: clear signup data too
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setSignupData, setLoading, setToken, setUser, logout } =
  authSlice.actions;

export default authSlice.reducer;