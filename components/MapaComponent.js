import { Component } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import { View, StyleSheet, Dimensions } from "react-native";
import caminoData from "../data_provisional/viaDeLaPlata.json";

class Mapa extends Component {
  constructor(props) {
    super(props);
    const rawCoords = caminoData.features[0].geometry.coordinates;
    const formattedCoords = rawCoords.map((punto) => ({
      latitude: punto[1],
      longitude: punto[0],
    }));

    this.state = {
      routeCoords: formattedCoords,
    };
  }

  render() {
    const { routeCoords } = this.state;

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
          <Polyline
            coordinates={routeCoords}
            strokeColor="#005293"
            strokeWidth={4}
          />
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

export default Mapa;
