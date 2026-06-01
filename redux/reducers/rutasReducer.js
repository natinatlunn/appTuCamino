import * as ActionTypes from "../ActionTypes";

export const rutasReducer = (
  state = {
    errMess: null,
    rutas: [],
    rutaSeleccionada: null,
    isLoading: false,
  },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_RUTAS:
      return {
        ...state,
        errMess: null,
        rutas: action.payload,
        isLoading: false,
      };
    case ActionTypes.RUTAS_LOADING:
      return { ...state, errMess: null, rutas: [], isLoading: true };

    case ActionTypes.RUTAS_FAILED:
      return { ...state, errMess: action.payload, rutas: [], isLoading: false };

    default:
      return state;
  }
};
