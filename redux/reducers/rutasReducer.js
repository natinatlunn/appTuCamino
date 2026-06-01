import * as ActionTypes from "../ActionTypes";

export const rutasReducer = (
  state = { errMess: null, rutas: [], rutaSeleccionada: null },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_RUTAS:
      return {
        ...state,
        errMess: null,
        rutas: Array.isArray(action.payload) ? action.payload : action.payload?.rutas || [],
      };

    case ActionTypes.RUTAS_FAILED:
      return { ...state, errMess: action.payload };

    default:
      return state;
  }
};
