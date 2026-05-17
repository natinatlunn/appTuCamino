import { Component } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/FontAwesome5";
import datosCamino from "../data_provisional/puntosCaracteristicos/puntosCaminoNorte.json";
import { colorHeader } from "../comun/comun";

const mapStateToProps = (state) => {
  return {
    rutas: state.rutas,
  };
};

class Mapa extends Component {
  constructor(props) {
    super(props);

    this.state = {
      puntoSeleccionado: null,
    };

    this.getMarkerIcon = this.getMarkerIcon.bind(this);
  }

  getMarkerIcon(tipo) {
    switch (tipo) {
      case "Albergue":
        return "bed";
      case "Restaurante":
        return "utensils";
      case "Interés Turístico" || "Monumento":
        return "landmark";
      default:
        return "info-circle";
    }
  }

  formatearCoordenadas(rutas) {
    if (!rutas || rutas.length === 0) return [];

    return rutas[0].caminoDelNorte[0].coordinates.map((punto) => ({
      latitude: punto[1],
      longitude: punto[0],
    }));
  }

  render() {
    const routeCoords = this.formatearCoordenadas(this.props.rutas.rutas);
    const { puntoSeleccionado } = this.state;

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 42.466,
            longitude: -2.445,
            latitudeDelta: 5,
            longitudeDelta: 5,
          }}
        >
          {routeCoords.length > 0 && (
            <Polyline coordinates={routeCoords} strokeWidth={4} />
          )}
          {datosCamino.puntos_caracteristicos.map((punto) => (
            <Marker
              key={punto.id}
              coordinate={{
                latitude: punto.coordenadas.latitud,
                longitude: punto.coordenadas.longitud,
              }}
              title={punto.nombre}
              description={punto.subtipo}
              onCalloutPress={() => this.setState({ puntoSeleccionado: punto })}
            >
              <View style={styles.customMarker}>
                <Icon
                  name={this.getMarkerIcon(punto.tipo)}
                  size={14}
                  color="#111111"
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default connect(mapStateToProps)(Mapa);
