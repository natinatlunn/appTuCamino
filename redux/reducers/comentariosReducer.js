import * as ActionTypes from "../ActionTypes";

export const comentariosReducer = (
  state = { errMess: null, comentarios: [] },
  action,
) => {
  switch (action.type) {
    case ActionTypes.ADD_COMENTARIOS:
      return { ...state, errMess: null, comentarios: action.payload };

    case ActionTypes.COMENTARIOS_FAILED:
      return { ...state, errMess: action.payload };

    case ActionTypes.ADD_COMENTARIO:
      const nuevoComentario = action.payload;
      nuevoComentario.id = state.comentarios.length;

      return {
        ...state,
        errMess: null,
        comentarios: state.comentarios.concat(nuevoComentario),
      };

    default:
      return state;
  }
};
