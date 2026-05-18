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

// Acción para cargar QR info desde Firebase
export const fetchQRInfo = (qrCode) => async (dispatch) => {
  try {
    const { getQRInfo } = await import('../comun/firebaseConfig');
    const qrInfo = await getQRInfo(qrCode);
    
    if (qrInfo) {
      dispatch(setQrData(qrInfo));
      dispatch(fetchQRInfoSuccess(qrInfo));
    } else {
      dispatch(fetchQRInfoFailed('QR no encontrado en la base de datos'));
    }
  } catch (error) {
    dispatch(fetchQRInfoFailed(error.message));
  }
};

export const fetchQRInfoSuccess = (qrInfo) => ({
  type: ActionTypes.FETCH_QR_INFO_SUCCESS,
  payload: qrInfo,
});

export const fetchQRInfoFailed = (errmess) => ({
  type: ActionTypes.FETCH_QR_INFO_FAILED,
  payload: errmess,
});
