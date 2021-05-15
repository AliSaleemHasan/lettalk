import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import chatReducer from "../features/chatSlice";
const store = configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
  },
});

export default store;
