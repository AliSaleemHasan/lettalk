import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChat: (state, action) => {
      state.value = action.payload;
    },
    setMessage: (state, action) => {
      state.value.messages[action.payload.index] = action.payload.message;
    },
  },
});

export const { setChat, setMessage } = chatSlice.actions;

export const Selector = (state) => state.chat?.value;
export default chatSlice.reducer;
