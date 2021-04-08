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
  },
});

export const { setChat } = chatSlice.actions;

export const Selector = (state) => state.chat?.value;
export default chatSlice.reducer;
