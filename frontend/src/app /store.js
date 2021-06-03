import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import chatReducer from "../features/chatSlice";
import chatsReduce from "../features/chatsSlice";
const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
    chats: chatsReduce,
  },
});

export default store;
