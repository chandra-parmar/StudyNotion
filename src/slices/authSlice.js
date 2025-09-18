import { createSlice } from "@reduxjs/toolkit";

// Load token + user from localStorage when app starts
const token = localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token"))
  : null

const user = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null

const initialState = {
  signupData: null,
  loading: false,
  token: token,
  user: user,   // ✅ restore user on refresh
}

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload
    },
    setLoading(state, value) {
      state.loading = value.payload
    },
    setToken(state, value) {
      state.token = value.payload
      localStorage.setItem("token", JSON.stringify(value.payload)) // keep in sync
    },
    setUser(state, value) {   // ✅ add this reducer
      state.user = value.payload
      localStorage.setItem("user", JSON.stringify(value.payload)) // keep in sync
    },
    logout(state) {   // ✅ clear everything when logging out
      state.token = null
      state.user = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },
  },
})

export const { setSignupData, setLoading, setToken, setUser, logout } =
  authSlice.actions

export default authSlice.reducer
