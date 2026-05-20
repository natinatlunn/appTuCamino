import { Component } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/FontAwesome5";
import { colorHeader, obtenerRutasNormalizadas } from "../comun/comun";
import { setRutaSeleccionada } from "../redux/ActionCreators";

function TarjetaBienvenida() {
  return (
    <View style={styles.bienvenidaCard}>
      <Image
        source={require("../assets/icon.png")}
        style={styles.bienvenidaImage}
        resizeMode="contain"
      />
      <Text style={styles.bienvenidaTitle}>Tu Camino</Text>
      <Text style={styles.bienvenidaText}>
        Elige una ruta del Camino de Santiago y muéstrala en el mapa.
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
          <Text style={styles.routeSubtitle}>Toca para ver detalles</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const mapStateToProps = (state) => ({
  rutas: state.rutas,
});

const mapDispatchToProps = (dispatch) => ({
  elegirRuta: (ruta) => dispatch(setRutaSeleccionada(ruta)),
});

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rutaModalVisible: false,
      rutaSeleccionada: null,
    };
  }

  rutasDisponibles() {
    return obtenerRutasNormalizadas(this.props.rutas?.rutas || []);
  }

  abrirModal = (ruta) => {
    this.setState({ rutaModalVisible: true, rutaSeleccionada: ruta });
  };

  cerrarModal = () => {
    this.setState({ rutaModalVisible: false, rutaSeleccionada: null });
  };

  elegirRuta = () => {
    if (!this.state.rutaSeleccionada) {
      return;
    }

    this.props.elegirRuta(this.state.rutaSeleccionada);
    this.cerrarModal();
  };

  render() {
    const rutas = this.rutasDisponibles();
    const rutaModalVisible = this.state.rutaModalVisible;
    const rutaSeleccionada = this.state.rutaSeleccionada;

    return (
      <View style={styles.container}>
        <FlatList
          data={rutas}
          keyExtractor={(item) => item.key}
          ListHeaderComponent={<TarjetaBienvenida />}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TarjetaRuta ruta={item} onPress={() => this.abrirModal(item)} />
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

        <Modal
          visible={rutaModalVisible}
          transparent
          animationType="slide"
          onRequestClose={this.cerrarModal}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>{rutaSeleccionada?.nombre}</Text>
                  <Text style={styles.modalSubtitle}>Camino de Santiago</Text>
                </View>
                <TouchableOpacity onPress={this.cerrarModal} style={styles.closeButton}>
                  <Icon name="times" size={18} color="#666666" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalText}>{rutaSeleccionada?.descripcion}</Text>

              <TouchableOpacity style={styles.chooseButton} onPress={this.elegirRuta}>
                <Text style={styles.chooseButtonText}>Elegir ruta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f1a14",
  },
  modalSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: "#8a8076",
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
  },
  modalText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4d463d",
    marginBottom: 18,
  },
  chooseButton: {
    backgroundColor: colorHeader,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  chooseButtonText: {
    color: "#1f1a14",
    fontWeight: "800",
    fontSize: 16,
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
