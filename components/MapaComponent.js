import { Component } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/FontAwesome5";
import { colorHeader, obtenerRutasNormalizadas } from "../comun/comun";
import { addUserRouteMarker, getUserRouteMarkers } from "../comun/markersStorage";
import { obtenerPuntosCaracteristicosRuta } from "../comun/puntosCaracteristicos";

const mapStateToProps = (state) => ({
  rutas: state.rutas,
  auth: state.auth,
});

function RenderPuntoCaracteristico({
  idPuntoSeleccionado,
  punto,
  handleClicarPunto,
  obtenerIconoPorPunto,
}) {
  const estaSeleccionado = idPuntoSeleccionado === punto.id;

  return (
    <Marker
      key={`caracteristico-${punto.id}`}
      coordinate={{
        latitude: punto.coordenadas.latitud,
        longitude: punto.coordenadas.longitud,
      }}
      onPress={(e) => handleClicarPunto(e, punto)}
    >
      <View
        style={[
          styles.characteristicMarker,
          estaSeleccionado && styles.characteristicMarkerSelected,
        ]}
      >
        <Icon
          name={obtenerIconoPorPunto(punto.tipo)}
          size={14}
          color="#ffffff"
        />
      </View>
    </Marker>
  );
}

function RenderMarcadorUsuario({ marcador, onPress }) {
  return (
    <Marker
      key={marcador.id}
      coordinate={{
        latitude: marcador.latitude,
        longitude: marcador.longitude,
      }}
      onPress={() => onPress(marcador)}
    >
      <View style={styles.userMarker}>
        <Icon name="map-marker-alt" size={14} color="#ffffff" />
      </View>
    </Marker>
  );
}

function RenderInformacionPunto({
  puntoSeleccionado,
  seccionInfoDesplegada,
  setSeccionInfoDesplegada,
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setSeccionInfoDesplegada(seccionInfoDesplegada)}
      >
        <Icon
          name="info-circle"
          size={16}
          color="#111111"
          style={styles.buttonIcon}
        />
        <Text style={styles.menuButtonText}>Mostrar información</Text>
        <Icon
          name={seccionInfoDesplegada ? "chevron-up" : "chevron-down"}
          size={14}
          color="#666666"
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
      {seccionInfoDesplegada && (
        <View style={styles.acordeonContent}>
          <View style={styles.infoSectionRow}>
            <View style={styles.infoIconContainer}>
              <Icon name="align-left" size={12} color={colorHeader} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoSectionLabel}>Descripción</Text>
              <Text style={styles.infoSectionText}>
                {puntoSeleccionado.descripcion}
              </Text>
            </View>
          </View>

          <View style={styles.infoSectionRow}>
            <View style={styles.infoIconContainer}>
              <Icon name="map-marker-alt" size={13} color={colorHeader} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoSectionLabel}>Dirección</Text>
              <Text style={styles.infoSectionText}>
                {puntoSeleccionado.direccion}
              </Text>
            </View>
          </View>
        </View>
      )}
    </>
  );
}

function RenderPopUpFlotante({
  puntoSeleccionado,
  cerrarPopup,
  seccionInfoDesplegada,
  setSeccionInfoDesplegada,
  mensajeMarcador,
  instruccionesMarcador,
}) {
  if (!puntoSeleccionado) return null;

  return (
    <View style={styles.floatingPopupContainer}>
      <View style={styles.headerMenu}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={styles.menuTitle}>{puntoSeleccionado.nombre}</Text>
          <Text style={styles.menuSubtitle}>{puntoSeleccionado.tipo}</Text>
        </View>
        <TouchableOpacity onPress={cerrarPopup} style={styles.closeButton}>
          <Icon name="times" size={16} color="#999999" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollMenuContainer}
      >
        <RenderInformacionPunto
          puntoSeleccionado={puntoSeleccionado}
          seccionInfoDesplegada={seccionInfoDesplegada}
          setSeccionInfoDesplegada={setSeccionInfoDesplegada}
        />

        <View style={styles.markerActionSection}>
          {!!mensajeMarcador && (
            <Text style={styles.markerFeedbackText}>{mensajeMarcador}</Text>
          )}

          {!!instruccionesMarcador && (
            <Text style={styles.markerHintText}>{instruccionesMarcador}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

class Mapa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      puntoSeleccionado: null,
      seccionInfoDesplegada: false,
      marcadoresUsuario: [],
      loadingMarcadores: false,
      mensajeMarcador: "",
    };

    this.cargarMarcadoresUsuario = this.cargarMarcadoresUsuario.bind(this);
    this.obtenerRouteKey = this.obtenerRouteKey.bind(this);
    this.obtenerRutaSeleccionada = this.obtenerRutaSeleccionada.bind(this);
    this.obtenerCoordenadasRuta = this.obtenerCoordenadasRuta.bind(this);
    this.obtenerRegionInicial = this.obtenerRegionInicial.bind(this);
    this.obtenerIconoPorPunto = this.obtenerIconoPorPunto.bind(this);
    this.handleClicarPunto = this.handleClicarPunto.bind(this);
    this.handleClicarMarcadorUsuario = this.handleClicarMarcadorUsuario.bind(this);
    this.cerrarPopup = this.cerrarPopup.bind(this);
    this.setSeccionInfoDesplegada = this.setSeccionInfoDesplegada.bind(this);
    this.handleLongPressMapa = this.handleLongPressMapa.bind(this);
  }

  componentDidMount() {
    this.cargarMarcadoresUsuario();
  }

  componentDidUpdate(prevProps) {
    const routeKeyAnterior = this.obtenerRouteKey(prevProps);
    const routeKeyActual = this.obtenerRouteKey(this.props);
    const uidAnterior = prevProps.auth?.user?.uid;
    const uidActual = this.props.auth?.user?.uid;

    if (routeKeyAnterior !== routeKeyActual || uidAnterior !== uidActual) {
      this.cargarMarcadoresUsuario();
    }
  }

  obtenerRouteKey(props = this.props) {
    return props.route?.params?.rutaKey || props.route?.params?.rutaId || null;
  }

  obtenerRutaSeleccionada(props = this.props) {
    const rutasNormalizadas = obtenerRutasNormalizadas(props.rutas?.rutas || []);
    const routeKey = this.obtenerRouteKey(props);

    return (
      rutasNormalizadas.find((ruta) => ruta.key === routeKey) ||
      rutasNormalizadas[0] ||
      null
    );
  }

  obtenerCoordenadasRuta(rutaSeleccionada) {
    if (!rutaSeleccionada?.coordinates?.length) {
      return [];
    }

    return rutaSeleccionada.coordinates.map((punto) => ({
      latitude: punto[1],
      longitude: punto[0],
    }));
  }

  

  obtenerRegionInicial(coordenadasRuta) {
    if (!coordenadasRuta.length) {
      return {
        latitude: 42.466,
        longitude: -2.445,
        latitudeDelta: 5,
        longitudeDelta: 5,
      };
    }

    const latitudes = coordenadasRuta.map((punto) => punto.latitude);
    const longitudes = coordenadasRuta.map((punto) => punto.longitude);
    const minLat = Math.min(...latitudes);
    const maxLat = Math.max(...latitudes);
    const minLon = Math.min(...longitudes);
    const maxLon = Math.max(...longitudes);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.4, 0.6),
      longitudeDelta: Math.max((maxLon - minLon) * 1.4, 0.6),
    };
  }

  obtenerIconoPorPunto(tipo) {
    switch (tipo) {
      case "Albergue":
      case "Hostal":
        return "bed";
      case "Restaurante":
        return "utensils";
      case "Interés Turístico":
      case "Monumento":
        return "landmark";
      case "Fuente":
        return "tint";
      case "Playa":
        return "umbrella-beach";
      default:
        return "info-circle";
    }
  }

  async cargarMarcadoresUsuario() {
    const uid = this.props.auth?.user?.uid;
    const routeKey = this.obtenerRouteKey();

    if (!uid || !routeKey) {
      this.setState({
        marcadoresUsuario: [],
        loadingMarcadores: false,
        mensajeMarcador: "",
      });
      return;
    }

    this.setState({ loadingMarcadores: true, mensajeMarcador: "" });

    try {
      const marcadoresUsuario = await getUserRouteMarkers(uid, routeKey);
      this.setState({ marcadoresUsuario });
    } finally {
      this.setState({ loadingMarcadores: false });
    }
  }

  handleClicarPunto(e, punto) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    this.setState({
      puntoSeleccionado: punto,
      seccionInfoDesplegada: false,
      mensajeMarcador: "",
    });
  }

  handleClicarMarcadorUsuario(marcador) {
    const routeKey = this.obtenerRouteKey();
    const puntosCaracteristicos = obtenerPuntosCaracteristicosRuta(routeKey);
    const puntoRelacionado = marcador.pointId
      ? puntosCaracteristicos.find((punto) => punto.id === marcador.pointId)
      : {
          id: marcador.id,
          nombre: marcador.name || "Marcador personal",
          descripcion: "Marcador creado por ti sobre la ruta.",
          direccion: `Lat ${Number(marcador.latitude).toFixed(5)}, Lon ${Number(
            marcador.longitude,
          ).toFixed(5)}`,
          coordenadas: {
            latitud: marcador.latitude,
            longitud: marcador.longitude,
          },
        };

    if (!puntoRelacionado) {
      return;
    }

    this.setState({
      puntoSeleccionado: puntoRelacionado,
      seccionInfoDesplegada: true,
      mensajeMarcador: "",
    });
  }

  cerrarPopup() {
    this.setState({
      puntoSeleccionado: null,
      seccionInfoDesplegada: false,
      mensajeMarcador: "",
    });
  }

  setSeccionInfoDesplegada(infoDesplegada) {
    this.setState({ seccionInfoDesplegada: !infoDesplegada });
  }

  

  async handleLongPressMapa(e) {
    const usuario = this.props.auth?.user;
    const routeKey = this.obtenerRouteKey();
    if (!usuario || !routeKey) {
      this.setState({ mensajeMarcador: "Inicia sesión para crear marcadores." });
      return;
    }

    const coordenadaPulsada = e?.nativeEvent?.coordinate;
    if (!coordenadaPulsada) {
      return;
    }

    const nuevoMarcador = {
      id: `${usuario.uid}-${routeKey}-${Date.now()}`,
      routeKey,
      latitude: coordenadaPulsada.latitude,
      longitude: coordenadaPulsada.longitude,
      createdAt: new Date().toISOString(),
      source: "user",
      color: "orange",
    };

    const marcadoresUsuario = await addUserRouteMarker(
      usuario.uid,
      routeKey,
      nuevoMarcador,
    );

    this.setState({
      marcadoresUsuario,
      mensajeMarcador: "Marcador creado sobre la ruta.",
      puntoSeleccionado: null,
      seccionInfoDesplegada: false,
    });
  }

  render() {
    const rutaSeleccionada = this.obtenerRutaSeleccionada();
    const routeKey = this.obtenerRouteKey();
    const rutaCoordenadas = this.obtenerCoordenadasRuta(rutaSeleccionada);
    const puntosCaracteristicos =
      rutaSeleccionada?.puntosCaracteristicos?.length
        ? rutaSeleccionada.puntosCaracteristicos
        : obtenerPuntosCaracteristicosRuta(routeKey);
    const marcadoresVisibles = this.state.marcadoresUsuario || [];
    const idPuntoSeleccionado = this.state.puntoSeleccionado?.id;
    const puedeCrearMarcador = !!this.props.auth?.user;
    const instruccionesMarcador = puedeCrearMarcador
      ? "Mantén pulsado sobre cualquier punto de la ruta para crear tu marcador."
      : "Inicia sesión para crear marcadores personales.";

    return (
      <SafeAreaView style={styles.container}>
        <MapView
          key={routeKey || "mapa-base"}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={this.obtenerRegionInicial(rutaCoordenadas)}
          onPress={this.cerrarPopup}
          onLongPress={this.handleLongPressMapa}
        >
          {rutaCoordenadas.length > 0 && (
            <Polyline
              coordinates={rutaCoordenadas}
              strokeColor="#005293"
              strokeWidth={5}
            />
          )}

          {puntosCaracteristicos.map((punto) => (
            <RenderPuntoCaracteristico
              key={`caracteristico-${punto.id}`}
              idPuntoSeleccionado={idPuntoSeleccionado}
              punto={punto}
              handleClicarPunto={(e, puntoActual) => this.handleClicarPunto(e, puntoActual)}
              obtenerIconoPorPunto={(tipo) => this.obtenerIconoPorPunto(tipo)}
            />
          ))}

          {marcadoresVisibles.map((marcador) => (
            <RenderMarcadorUsuario
              key={marcador.id}
              marcador={marcador}
              onPress={(marker) => this.handleClicarMarcadorUsuario(marker)}
            />
          ))}
        </MapView>

        {this.state.loadingMarcadores && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color={colorHeader} />
            <Text style={styles.loadingOverlayText}>Cargando marcadores...</Text>
          </View>
        )}

        <RenderPopUpFlotante
          puntoSeleccionado={this.state.puntoSeleccionado}
          cerrarPopup={this.cerrarPopup}
          seccionInfoDesplegada={this.state.seccionInfoDesplegada}
          setSeccionInfoDesplegada={this.setSeccionInfoDesplegada}
          mensajeMarcador={this.state.mensajeMarcador}
          instruccionesMarcador={instruccionesMarcador}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  characteristicMarker: {
    backgroundColor: colorHeader,
    borderWidth: 1.5,
    borderColor: "#d18f00",
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  characteristicMarkerSelected: {
    borderColor: "#9a6700",
    borderWidth: 2,
  },
  userMarker: {
    backgroundColor: "#f97316",
    borderWidth: 1.5,
    borderColor: "#c2410c",
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  floatingPopupContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 18,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  headerMenu: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111111",
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#666666",
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  scrollMenuContainer: {
    maxHeight: Dimensions.get("window").height * 0.42,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  buttonIcon: {
    marginRight: 12,
    width: 18,
    textAlign: "center",
  },
  menuButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111111",
    flex: 1,
  },
  chevronIcon: {
    marginLeft: 4,
  },
  acordeonContent: {
    paddingHorizontal: 4,
    paddingTop: 2,
    paddingBottom: 10,
  },
  infoSectionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#edf0f4",
  },
  infoIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#eef2f7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  infoSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#777777",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  infoSectionText: {
    fontSize: 13,
    color: "#222222",
    lineHeight: 17,
    textAlign: "justify",
  },
  markerActionSection: {
    paddingHorizontal: 4,
    paddingTop: 2,
    paddingBottom: 4,
  },
  markerActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f97316",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 4,
  },
  markerActionButtonDisabled: {
    backgroundColor: "#f0f0f0",
  },
  markerActionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
    flex: 1,
  },
  markerActionButtonTextDisabled: {
    color: "#8f8f8f",
  },
  markerFeedbackText: {
    marginTop: 8,
    fontSize: 12,
    color: "#666666",
  },
  markerHintText: {
    marginTop: 6,
    fontSize: 11,
    color: "#8a5a00",
  },
  loadingOverlay: {
    position: "absolute",
    top: 16,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },
  loadingOverlayText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#444444",
  },
});

export default connect(mapStateToProps)(Mapa);
