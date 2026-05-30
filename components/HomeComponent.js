import { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/FontAwesome5";
import { colorHeader, obtenerRutasNormalizadas } from "../comun/comun";
import { setRutaSeleccionada } from "../redux/ActionCreators";

function TarjetaBienvenida({ user }) {
  return (
    <View style={styles.bienvenidaCard}>
      <Image
        source={require("../components/imagenes/imagBienvenida.png")}
        style={styles.bienvenidaImage}
        resizeMode="contain"
      />
      <Text style={styles.bienvenidaTitle}>Tu Camino</Text>
      {user && (
        <Text style={styles.welcomeUser}>
          {`Bienvenido ${user.displayName || (user.email || "").split("@")[0]}`}
        </Text>
      )}
      <Text style={styles.bienvenidaText}>
        Elige una ruta del Camino de Santiago y se mostrará en el mapa.
      </Text>
    </View>
  );
}

function TarjetaRuta({ ruta, onPress }) {
  return (
    <TouchableOpacity style={styles.routeCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.routeCardHeader}>
        <View style={styles.routeCardIconWrap}>
          <Icon name="route" size={16} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.routeTitle}>{ruta.nombre}</Text>
          <Text style={styles.routeSubtitle}>Toca para abrirla en el mapa</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const mapStateToProps = (state) => ({
  rutas: state.rutas,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  elegirRuta: (ruta) => dispatch(setRutaSeleccionada(ruta)),
});

class Home extends Component {
  rutasDisponibles() {
    return obtenerRutasNormalizadas(this.props.rutas?.rutas || []);
  }

  seleccionarYRendirRuta = (ruta) => {
    if (!ruta) {
      return;
    }

    this.props.elegirRuta(ruta);

    const parentNavigation = this.props.navigation?.getParent?.();
    if (parentNavigation) {
      parentNavigation.navigate("Mapa");
      return;
    }

    this.props.navigation?.navigate?.("Mapa");
  };

  render() {
    const rutas = this.rutasDisponibles();
    const user = this.props.auth?.user;

    return (
      <View style={styles.container}>
        <FlatList
          data={rutas}
          keyExtractor={(item) => item.key}
          ListHeaderComponent={<TarjetaBienvenida user={user} />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TarjetaRuta ruta={item} onPress={() => this.seleccionarYRendirRuta(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Cargando rutas</Text>
              <Text style={styles.emptyText}>
                
              </Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f3ea",
  },
  listContent: {
    padding: 16,
    paddingBottom: 28,
  },
  bienvenidaCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  bienvenidaImage: {
    width: "100%",
    height: 170,
    marginBottom: 10,
  },
  bienvenidaTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1f1a14",
    marginBottom: 8,
  },
  welcomeUser: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6b6258",
    marginBottom: 6,
  },
  bienvenidaText: {
    textAlign: "center",
    color: "#6b6258",
    fontSize: 15,
    lineHeight: 21,
  },
  routeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(246,190,46,0.22)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  routeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  routeCardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colorHeader,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1a14",
  },
  routeSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6b6258",
  },
  emptyState: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f1a14",
    marginBottom: 6,
  },
  emptyText: {
    textAlign: "center",
    color: "#6b6258",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
