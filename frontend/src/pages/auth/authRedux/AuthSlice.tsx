import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosRequest } from "../../../apis/AxiosHelper";

export const resendVerificationEmail = createAsyncThunk(
  "auth/resendVerificationEmail",
  async (_, { getState }) => {
    try {
      const response = await axiosRequest(
        "post",
        "/auth/resend-verification-email"
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ id, hash }: any, { getState }) => {
    try {
      const response = await axiosRequest(
        "get",
        `/auth/verify-email/${id}/${hash}`
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data;
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
  verification: {
    loading: false,
    error: null,
    message: null,
    resendLoading: false,
    resendError: null,
    resendSuccess: false,
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.access_token;
      state.loading = false;
      state.error = null;

      console.log("user: ", state.user);
      console.log(state.token);
    },
  },
  extraReducers: (builder) => {
    builder
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.verification.loading = true;
        state.verification.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verification.loading = false;
        state.verification.message = action.payload.message;
        if (state.user) {
          state.user.email_verified_at = new Date().toISOString();
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verification.loading = false;
        state.verification.error = action.error.message ?? "Verification failed. Please try again.";
      })
      // Resend Verification
      .addCase(resendVerificationEmail.pending, (state) => {
        state.verification.resendLoading = true;
        state.verification.resendError = null;
        state.verification.resendSuccess = false;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.verification.resendLoading = false;
        state.verification.resendSuccess = true;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.verification.resendLoading = false;
        state.verification.resendError = action.error.message ?? null;
      });
  },
});

export const AuthReducer = authSlice.reducer;
export const AuthActions = authSlice.actions;
