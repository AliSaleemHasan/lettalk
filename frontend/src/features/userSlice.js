import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: null,
};

const userSlice = createSlice({
  name: "const state = useSelector(state => state.state)",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;
//return Selector for ahead useSelctor

export const Selector = (state) => state.user?.value;
export default userSlice.reducer;
