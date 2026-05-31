import * as ActionTypes from "../ActionTypes";

const initialState = {
  user: null,
  isLoading: true,
  datosPerfil: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.SET_AUTH_USER:
      return { ...state, user: action.payload };
    case ActionTypes.SET_AUTH_LOADING:
      return { ...state, isLoading: action.payload };
    case ActionTypes.ADD_USER:
      return { ...state, datosPerfil: action.payload, isLoading: false };

    default:
      return state;
  }
};
