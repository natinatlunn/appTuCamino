import * as ActionTypes from "../ActionTypes";

export const rutasReducer = (state = { errMess: null, rutas: [] }, action) => {
  switch (action.type) {
    case ActionTypes.ADD_RUTAS:
      return { ...state, errMess: null, rutas: action.payload };

    case ActionTypes.RUTAS_FAILED:
      return { ...state, errMess: action.payload };

    default:
      return state;
  }
};
