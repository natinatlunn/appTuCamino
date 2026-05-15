import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../comun/comun";

export const fetchRutas = () => (dispatch) => {
  return fetch(baseUrl + "rutas.json")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText,
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errmess = new Error(error.message);
        throw errmess;
      },
    )
    .then((response) => response.json())
    .then((rutas) => dispatch(addRutas(rutas)))
    .catch((error) => dispatch(rutasFailed(error.message)));
};

export const rutasFailed = (errmess) => ({
  type: ActionTypes.RUTAS_FAILED,
  payload: errmess,
});

export const addRutas = (rutas) => ({
  type: ActionTypes.ADD_RUTAS,
  payload: rutas,
});

export const setScanned = (value) => ({
  type: ActionTypes.SET_SCANNED,
  payload: value,
});

export const setModalVisible = (value) => ({
  type: ActionTypes.SET_MODAL_VISIBLE,
  payload: value,
});

export const setQrData = (data) => ({
  type: ActionTypes.SET_QR_DATA,
  payload: data,
});
