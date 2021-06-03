import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: [],
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.value = action.payload;
    },
    addChat: (state, action) => {
      console.log(action);
      state.value.push(action.payload);
    },
    setMessage: (state, action) => {
      console.log(action.payload);
      console.log(state.value[action.payload.chatIndex]);
      state.value[action.payload.chatIndex].messages[
        state.value[action.payload.chatIndex].messages.length
      ] = action.payload.message;
    },
    editMessage: (state, action) => {
      console.log(action);
      if (action.payload.type === "edit")
        state.value[action.payload.chatIndex].messages.splice(
          action.payload.index,
          1,
          action.payload.message
        );
      else
        state.value[action.payload.chatIndex].messages.splice(
          action.payload.index,
          1
        );
    },
  },
});

export const { setChats, addChat, editMessage, setMessage } =
  chatsSlice.actions;
export const Selector = (state) => state.chats?.value;
export default chatsSlice.reducer;
