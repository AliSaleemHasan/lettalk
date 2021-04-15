import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import chatReducer from "../features/chatSlice";
import socketReducer from "../features/socketSlice";
export default configureStore({
  reducer: {
    chat: chatReducer,
    user: userReducer,
    socket: socketReducer,
  },
});
