import { configureStore } from "@reduxjs/toolkit";
import { rutas } from "./rutas";

export const ConfigureStore = () => {
  const store = configureStore({
    reducer: {
      rutas: rutas,
    },
  });
  return store;
};
