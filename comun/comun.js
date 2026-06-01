export const colorHeader = "#f6be2e";
export const baseUrl =
  "https://apptucamino-default-rtdb.europe-west1.firebasedatabase.app/";

const routeLabels = {
  caminoDelNorte: "Camino del Norte",
  caminoFrances: "Camino Francés",
  caminoPortuguesCentral: "Camino Portugués Central",
  caminoPrimitivo: "Camino Primitivo",
  caminoIngles: "Camino Inglés",
  viaDeLaPlata: "Vía de la Plata",
  caminoFisterraMuxia: "Fisterra y Muxía",
  caminoPortuguesCosta: "Camino Portugués por la Costa",
  caminoInvierno: "Camino de Invierno",
  rutaMarArousaRioUlla: "Ruta Mar de Arousa y Río Ulla",
};

const routeDescriptions = {
  caminoDelNorte:
    "Recorre la cornisa cantábrica con etapas junto al mar y ciudades con mucha historia.",
  caminoFrances:
    "La ruta jacobea más clásica, con gran variedad de paisajes, servicios y patrimonio.",
  caminoPortuguesCentral:
    "Une Portugal con Santiago por una ruta histórica, cómoda y muy bien señalizada.",
  caminoPrimitivo:
    "La ruta más antigua, exigente y montañosa, pensada para quien busca un Camino más auténtico.",
  caminoIngles:
    "Una opción más corta para llegar a Santiago, ideal si buscas un recorrido breve e intenso.",
  viaDeLaPlata:
    "Un Camino largo y amplio que cruza el oeste de la península desde el sur hasta Galicia.",
  caminoFisterraMuxia:
    "La prolongación simbólica del Camino hasta el fin de la tierra y la costa atlántica.",
  caminoPortuguesCosta:
    "Ruta atlántica con mucha presencia del mar y pueblos costeros con encanto.",
  caminoInvierno:
    "Una alternativa más tranquila para evitar la nieve de O Cebreiro en invierno.",
  rutaMarArousaRioUlla:
    "Ruta vinculada a la tradición jacobea del traslado del apóstol por las rías gallegas.",
};

export const obtenerRutasNormalizadas = (rutas = []) => {
  return rutas.flatMap((rutaItem) => {
    if (rutaItem?.coordenadas?.length) {
      const routeKey = rutaItem.id?.toString() || rutaItem.nombre || "ruta";

      return [
        {
          key: routeKey,
          nombre: rutaItem.nombre || routeKey,
          descripcion:
            rutaItem.descripcion ||
            rutaItem.descrpcion ||
            "Selecciona esta ruta para mostrarla en el mapa.",
          coordinates: rutaItem.coordenadas,
          puntosCaracteristicos: rutaItem.puntosCaracteristicos || [],
        },
      ];
    }

    return Object.entries(rutaItem).flatMap(([rutaKey, rutaValor]) => {
      const rutaGeometry = Array.isArray(rutaValor) ? rutaValor[0] : rutaValor;
      const coordinates = rutaGeometry?.coordinates || [];

      if (!coordinates.length) {
        return [];
      }

      return [
        {
          key: rutaKey,
          nombre: routeLabels[rutaKey] || rutaKey,
          descripcion:
            routeDescriptions[rutaKey] ||
            "Selecciona esta ruta para mostrarla en el mapa.",
          coordinates,
          puntosCaracteristicos: rutaGeometry?.puntosCaracteristicos || [],
        },
      ];
    });
  });
};
