import { Component } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/FontAwesome5";
import datosCamino from "../data_provisional/puntosCaracteristicos/puntosCaminoInvierno.json";
import { colorHeader } from "../comun/comun";

const mapStateToProps = (state) => {
  return {
    rutas: state.rutas,
  };
};

function RenderPuntoCaracteristico({
  idPuntoSeleccionado,
  punto,
  handleMarkerPress,
  obtenerIconoPorPunto,
}) {
  const isSelected = idPuntoSeleccionado === punto.id;
  return (
    <Marker
      key={punto.id}
      coordinate={{
        latitude: punto.coordenadas.latitud,
        longitude: punto.coordenadas.longitud,
      }}
      onPress={(e) => handleMarkerPress(e, punto)}
    >
      <View
        style={[
          styles.customMarker,
          {
            backgroundColor: isSelected ? colorHeader : "#ffffff",
          },
        ]}
      >
        <Icon
          name={obtenerIconoPorPunto(punto.tipo)}
          size={14}
          color={isSelected ? "#ffffff" : colorHeader}
        />
      </View>
    </Marker>
  );
}

function RenderPopUpFlotante({
  puntoSeleccionado,
  cerrarPopup,
  mostrarInformacion,
  mostrarComentarios,
}) {
  if (!puntoSeleccionado) return null;

  return (
    <View style={styles.floatingPopupContainer}>
      <View style={styles.headerMenu}>
        <View style={{ flex: 1 }}>
          <Text style={styles.menuTitle} numberOfLines={1}>
            {puntoSeleccionado.nombre}
          </Text>
          <Text style={styles.menuSubtitle}>{puntoSeleccionado.subtipo}</Text>
        </View>
        <TouchableOpacity onPress={cerrarPopup} style={styles.closeButton}>
          <Icon name="times" size={16} color="#999999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => mostrarInformacion(puntoSeleccionado)}
      >
        <Icon
          name="info-circle"
          size={16}
          color="#111111"
          style={styles.buttonIcon}
        />
        <Text style={styles.menuButtonText}>Mostrar información</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuButton, styles.lastButton]}
        onPress={() => mostrarComentarios(puntoSeleccionado)}
      >
        <Icon
          name="comment-alt"
          size={16}
          color="#111111"
          style={styles.buttonIcon}
        />
        <Text style={styles.menuButtonText}>Ver comentarios recientes</Text>
      </TouchableOpacity>
    </View>
  );
}

class Mapa extends Component {
  constructor(props) {
    super(props);

    this.state = {
      puntoSeleccionado: null,
    };

    this.obtenerIconoPorPunto = this.obtenerIconoPorPunto.bind(this);
    this.handleMarkerPress = this.handleMarkerPress.bind(this);
    this.cerrarPopup = this.cerrarPopup.bind(this);
    this.handleShowInfo = this.handleShowInfo.bind(this);
    this.handleShowComments = this.handleShowComments.bind(this);
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

  handleMarkerPress(e, punto) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    this.setState({
      puntoSeleccionado: punto,
    });
  }

  cerrarPopup() {
    this.setState({
      puntoSeleccionado: null,
    });
  }

  handleShowInfo(punto) {
    console.log("Información de:", punto.nombre);
    this.cerrarPopup();
  }

  handleShowComments(punto) {
    console.log("Comentarios de:", punto.nombre);
    this.cerrarPopup();
  }

  formatearCoordenadas(rutas, rutaSeleccionada) {
    if (rutaSeleccionada?.coordinates?.length) {
      return rutaSeleccionada.coordinates.map((punto) => ({
        latitude: punto[1],
        longitude: punto[0],
      }));
    }

    if (!rutas || rutas.length === 0) return [];

    const primeraRuta = Object.values(rutas[0])[0]?.[0]?.coordinates || [];

    return primeraRuta.map((punto) => ({
      latitude: punto[1],
      longitude: punto[0],
    }));
  }

  render() {
    const routeCoords = this.formatearCoordenadas(
      this.props.rutas.rutas,
      this.props.rutas.rutaSeleccionada,
    );
    const idPuntoSeleccionado = this.state.puntoSeleccionado
      ? this.state.puntoSeleccionado.id
      : null;

    return (
      <SafeAreaView style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 42.466,
            longitude: -2.445,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
          onPress={this.cerrarPopup}
        >
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#005293"
              strokeWidth={5}
            />
          )}

          {datosCamino.puntos_caracteristicos.map((punto) => (
            <RenderPuntoCaracteristico
              key={punto.id}
              idPuntoSeleccionado={idPuntoSeleccionado}
              punto={punto}
              handleMarkerPress={this.handleMarkerPress}
              obtenerIconoPorPunto={this.obtenerIconoPorPunto}
            />
          ))}
        </MapView>
        <RenderPopUpFlotante
          puntoSeleccionado={this.state.puntoSeleccionado}
          mostrarComentarios={this.handleShowComments}
          mostrarInformacion={this.handleShowInfo}
          cerrarPopup={this.cerrarPopup}
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
  customMarker: {
    backgroundColor: "#ffffff",
    borderWidth: 1.5,
    borderColor: colorHeader,
    borderRadius: 15,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  floatingPopupContainer: {
    position: "absolute",
    bottom: 8,
    left: 16,
    right: 16,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    zIndex: 999,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    elevation: 20,
  },
  headerMenu: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#666666",
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  lastButton: {
    marginBottom: 0,
  },
  buttonIcon: {
    marginRight: 12,
    width: 18,
    textAlign: "center",
  },
  menuButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111111",
  },
});

export default connect(mapStateToProps)(Mapa);
