import { Component } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import { connect } from "react-redux";
import datosCamino from "../data_provisional/puntosCaracteristicos/puntosCaminoNorte.json";

const mapStateToProps = (state) => {
  return {
    rutas: state.rutas,
  };
};

class Mapa extends Component {
  constructor(props) {
    super(props);

    // Inicializamos el estado para controlar el punto seleccionado en el mapa
    this.state = {
      puntoSeleccionado: null,
    };

    // Vinculamos el método para no perder el contexto de 'this'
    this.getMarkerColor = this.getMarkerColor.bind(this);
  }

  getMarkerColor(tipo) {
    switch (tipo) {
      case "Albergue":
        return "#3498db"; // Azul
      case "Monumento":
        return "#e74c3c"; // Rojo
      case "Interés Turístico":
        return "#9b59b6"; // Morado
      case "Localidad de Interés":
        return "#2ecc71"; // Verde
      default:
        return "#7f8c8d"; // Gris
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
            <Polyline
              coordinates={routeCoords}
              strokeColor="#005293"
              strokeWidth={4}
            />
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
              pinColor={this.getMarkerColor(punto.tipo)}
              // Al pulsar en el globo de información, se guarda el punto en el estado
              onCalloutPress={() => this.setState({ puntoSeleccionado: punto })}
            />
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
});

export default connect(mapStateToProps)(Mapa);
