import { Component } from "react";
import { View, Text } from "react-native";

function TarjetaBienvenida() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>¡Bienvenido a Tu Camino!</Text>
    </View>
  );
}

class Home extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <TarjetaBienvenida />
      </View>
    );
  }
}

export default Home;
