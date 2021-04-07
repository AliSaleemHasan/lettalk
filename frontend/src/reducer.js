export const initialState = {
  user: null,
  chat: null,
};

export const ActionTypes = {
  SET_USER: "SET_USER",
  SET_CHAT: "SET_CHAT",
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case ActionTypes.SET_CHAT: {
      return {
        ...state,
        chat: action.chat,
      };
    }

    default:
      return state;
  }
};

export default reducer;
