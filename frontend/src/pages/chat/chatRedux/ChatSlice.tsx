import { createSlice } from "@reduxjs/toolkit";
import { fetchChat } from "./ChatReduxThunk";

interface ChatState {
  messages: any[];
  recentMessages: any[];
  selectedUser: any | null;
  count: number;
  status: string;
  error: string;
}

const initialState: ChatState = {
  messages: [],
  recentMessages: [],
  selectedUser: null,
  count: 0,
  status: "idle",
  error: "",
};

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addCount(state, action) {
      state.count += action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChat.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.recentMessages = [...action.payload.recentMessages];
        state.messages = [...action.payload.messages];
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "";
      });
  },
});

export const ChatReducer = ChatSlice.reducer;
export const ChatActions = ChatSlice.actions;
