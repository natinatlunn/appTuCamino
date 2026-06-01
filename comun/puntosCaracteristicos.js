import puntosCaminoDelNorte from "../data_provisional/puntosCaracteristicos/puntosCaminoDelNorte.json";
import puntosCaminoFisterraMuxia from "../data_provisional/puntosCaracteristicos/puntosCaminoFisterraMuxia.json";
import puntosCaminoFrances from "../data_provisional/puntosCaracteristicos/puntosCaminoFrances.json";
import puntosCaminoIngles from "../data_provisional/puntosCaracteristicos/puntosCaminoIngles.json";
import puntosCaminoInvierno from "../data_provisional/puntosCaracteristicos/puntosCaminoInvierno.json";

const puntosPorRuta = {
  caminoDelNorte: puntosCaminoDelNorte.puntos_caracteristicos,
  caminoFrances: puntosCaminoFrances.puntos_caracteristicos,
  caminoFisterraMuxia: puntosCaminoFisterraMuxia.puntos_caracteristicos,
  caminoIngles: puntosCaminoIngles.puntos_caracteristicos,
  caminoInvierno: puntosCaminoInvierno.puntos_caracteristicos,
};

export const obtenerPuntosCaracteristicosRuta = (rutaKey) => {
  return puntosPorRuta[rutaKey] || [];
};
