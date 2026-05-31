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

export const mapFirebaseUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email || null,
    displayName: user.displayName || null,
    emailVerified: !!user.emailVerified,
    photoURL: user.photoURL || null,
    phoneNumber: user.phoneNumber || null,
    isAnonymous: !!user.isAnonymous,
  };
};

export const startAuthListener = () => (dispatch) => {
  dispatch(setAuthLoading(true));

  return onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      dispatch(setAuthUser(mapFirebaseUser(currentUser)));
      dispatch(fetchUsuario(currentUser.uid));
    } else {
      dispatch(setAuthUser(null));
      dispatch(addUsuario(null));
    }

    dispatch(setAuthLoading(false));
  });
};

// Acción para cargar QR info desde Firebase
export const fetchQRInfo = (qrCode) => async (dispatch) => {
  try {
    const { getQRInfo } = await import("../comun/firebaseConfig");
    const qrInfo = await getQRInfo(qrCode);
    console.log("QR Info recibida en ActionCreator:", qrInfo);

    if (qrInfo) {
      dispatch(setQrData(qrInfo));
      dispatch(fetchQRInfoSuccess(qrInfo));
    } else {
      dispatch(fetchQRInfoFailed("QR no encontrado en la base de datos"));
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

export const addUsuario = (datos) => ({
  type: ActionTypes.ADD_USER,
  payload: datos,
});

export const fetchUsuario = (uid) => (dispatch) => {
  return fetch(baseUrl + "usuarios.json")
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          let error = new Error(
            "Error " + response.status + ": " + response.statusText,
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        throw new Error(error.message);
      },
    )
    .then((response) => response.json())
    .then((usuarios) => {
      const usuario = usuarios[uid];

      if (usuario) {
        dispatch(addUsuario(usuario));
      } else {
        console.warn("No se encontraron datos extra para el UID:", uid);
      }
    })
    .catch((error) =>
      console.error("Error al obtener datos del JSON:", error.message),
    );
};

export const fetchComentarios = () => (dispatch) => {
  return fetch(baseUrl + "comentarios.json")
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
    .then((comentarios) => {
      const comentariosMapeado = comentarios
        ? Object.keys(comentarios).map((idAleatorio) => {
            return {
              id: idAleatorio,
              ...comentarios[idAleatorio],
            };
          })
        : [];

      dispatch(addComentarios(comentariosMapeado));
    })
    .catch((error) => dispatch(comentariosFailed(error.message)));
};

export const comentariosFailed = (errmess) => ({
  type: ActionTypes.COMENTARIOS_FAILED,
  payload: errmess,
});

export const addComentarios = (comentarios) => ({
  type: ActionTypes.ADD_COMENTARIOS,
  payload: comentarios,
});

export const postComentario =
  (rutaId, puntoId, puntuacion, comentario) => async (dispatch, getState) => {
    const fecha = new Date().toISOString();
    const estadoAuth = getState().auth;
    const autor = estadoAuth.datosPerfil.nombre;

    const comentarioNuevo = {
      rutaId,
      puntoId,
      puntuacion,
      autor,
      comentario,
      fecha,
    };

    if (!auth.currentUser) {
      throw new Error("No hay ningún usuario autenticado en Firebase");
    }

    const token = await auth.currentUser.getIdToken(true);

    const url = `${baseUrl}comentarios.json?auth=${token}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(comentarioNuevo),
    });

    if (response.ok) {
      dispatch(addComentario(comentarioNuevo));
    } else {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Error al guardar el comentario en Firebase",
      );
    }
  };

export const addComentario = (comentarioNuevo) => ({
  type: ActionTypes.ADD_COMENTARIO,
  payload: comentarioNuevo,
});
