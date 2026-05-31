import { configureStore } from "@reduxjs/toolkit";
import { rutasReducer } from "./reducers/rutasReducer";
import { userReducer } from "./reducers/userReducer";
import { comentariosReducer } from "./reducers/comentariosReducer";
import { scannerReducer } from "./reducers/scannerReducer";

export const ConfigureStore = () => {
  const store = configureStore({
    reducer: {
      rutas: rutasReducer,
      auth: userReducer,
      comentarios: comentariosReducer,
      scanner: scannerReducer,
    },
  });

  return store;
};
