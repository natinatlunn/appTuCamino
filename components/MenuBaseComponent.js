import { Component } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { View, Image, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import CameraScanner from "./camera";
import { colorHeader } from "../comun/comun";

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

class MenuBase extends Component {
  menuHeaderOptions = (tite) => ({
    headerStyle: { backgroundColor: colorHeader },
    headerTintColor: "#000",
    headerTitleStyle: { fontWeight: "bold", fontSize: 22 },
    headerTitleAlign: "center",
    headerShadowVisible: false,
  });

  bottomTabOptions = () => ({
    headerShown: false,
    tabBarActiveTintColor: colorHeader,
    tabBarInactiveTintColor: "gray",
    tabBarStyle: styles.tabBar,
    tabBarLabelStyle: styles.tabBarLabel,
  });

  HomeNavegador = () => {
    return (
      <Stack.Navigator
        initialRouteName="Tu Camino"
        screenOptions={() => this.menuHeaderOptions()}
      >
        <Stack.Screen name="Tu Camino" component={CameraScanner} />
      </Stack.Navigator>
    );
  };

  MapaNavegador = () => {
    return (
      <Stack.Navigator
        initialRouteName="Mapa"
        screenOptions={() => this.menuHeaderOptions()}
      >
        <Stack.Screen name="Mapa" component={CameraScanner} />
      </Stack.Navigator>
    );
  };

  EscaneoQRNavegador = () => {
    return (
      <Stack.Navigator
        initialRouteName="Escanear QR"
        screenOptions={() => this.menuHeaderOptions()}
      >
        <Stack.Screen name="Escanear QR" component={CameraScanner} />
      </Stack.Navigator>
    );
  };

  PerfilNavegador = () => {
    return (
      <Stack.Navigator
        initialRouteName="Perfil"
        screenOptions={() => this.menuHeaderOptions()}
      >
        <Stack.Screen name="Perfil" component={CameraScanner} />
      </Stack.Navigator>
    );
  };

  BottomTabNavigator = () => {
    return (
      <BottomTab.Navigator screenOptions={() => this.bottomTabOptions()}>
        <BottomTab.Screen
          name="Home"
          component={this.HomeNavegador}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Mapa"
          component={this.MapaNavegador}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="map-marked-alt" color={color} size={size} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Escanear QR"
          component={this.EscaneoQRNavegador}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="qrcode-scan"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <BottomTab.Screen
          name="Perfil"
          component={this.PerfilNavegador}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user-circle-o" color={color} size={size} />
            ),
          }}
        />
      </BottomTab.Navigator>
    );
  };

  render() {
    return (
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <this.BottomTabNavigator />
        </View>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    height: 90,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default MenuBase;
