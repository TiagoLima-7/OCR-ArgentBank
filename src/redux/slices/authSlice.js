import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getUserProfile, loginUser } from "../../services/apiService";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const data = await loginUser(email, password);
      const token = data.body.token;
      localStorage.setItem("token", token); //sauvegarde du token en localStorage
      //Une fois récupéré le token, on fetch le profil
      dispatch(fetchUserProfile(token));
      return token;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (token, { rejectWithValue }) => {
    try {
      const data = await getUserProfile(token);
      return data.body;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Profile fetch failed",
      );
    }
  },
);

const token = localStorage.getItem("token"); //récupération du token au démarrage

const initialState = {
  user: null,
  token: token || null,
  // isAuthenticated: false,
  isAuthenticated: !!token, //true si token existe
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut(state) {
      localStorage.removeItem("token"); //supression du token
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Login
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //Profil
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { logOut, setUser } = authSlice.actions;
export default authSlice.reducer;
