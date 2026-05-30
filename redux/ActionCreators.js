import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../comun/comun";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../comun/firebaseConfig";

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

export const setRutaSeleccionada = (ruta) => ({
  type: ActionTypes.SET_RUTA_SELECCIONADA,
  payload: ruta,
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

export const setAuthUser = (user) => ({
  type: ActionTypes.SET_AUTH_USER,
  payload: user,
});

export const setAuthLoading = (loading) => ({
  type: ActionTypes.SET_AUTH_LOADING,
  payload: loading,
});

export const startAuthListener = () => (dispatch) => {
  dispatch(setAuthLoading(true));

  return onAuthStateChanged(auth, (currentUser) => {
    dispatch(setAuthUser(currentUser));
    dispatch(setAuthLoading(false));
  });
};

// Acción para cargar QR info desde Firebase
export const fetchQRInfo = (qrCode) => async (dispatch) => {
  try {
    const { getQRInfo } = await import('../comun/firebaseConfig');
    const qrInfo = await getQRInfo(qrCode);
    console.log("QR Info recibida en ActionCreator:", qrInfo);
    
    if (qrInfo) {
      dispatch(setQrData(qrInfo));
      dispatch(fetchQRInfoSuccess(qrInfo));
    } else {
      dispatch(fetchQRInfoFailed('QR no encontrado en la base de datos'));
    }
  } catch (error) {
    console.error("Error en fetchQRInfo:", error);
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
