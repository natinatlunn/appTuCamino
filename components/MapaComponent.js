import { Component } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import caminoData from "../data_provisional/viaDeLaPlata.json";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    rutas: state.rutas,
  };
};

class Mapa extends Component {
  formatearCoordenadas(rutas) {
    if (!rutas || rutas.length === 0) return [];

    return rutas[0].viaDeLaPlata[0].coordinates.map((punto) => ({
      latitude: punto[1],
      longitude: punto[0],
    }));
  }

  render() {
    const routeCoords = this.formatearCoordenadas(this.props.rutas.rutas);

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
