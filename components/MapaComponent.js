import { Component } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/FontAwesome5";
import { colorHeader } from "../comun/comun";

const mapStateToProps = (state) => {
  return {
    rutas: state.rutas,
  };
};

function RenderPuntoCaracteristico({
  idPuntoSeleccionado,
  punto,
  handleClicarPunto,
  obtenerIconoPorPunto,
}) {
  const estaSeleccionado = idPuntoSeleccionado === punto.id;

  return (
    <Marker
      key={punto.id}
      coordinate={{
        latitude: punto.coordenadas.latitud,
        longitude: punto.coordenadas.longitud,
      }}
      onPress={(e) => handleClicarPunto(e, punto)}
    >
      <View
        style={[
          styles.customMarker,
          {
            backgroundColor: estaSeleccionado ? colorHeader : "#ffffff",
          },
        ]}
      >
        <Icon
          name={obtenerIconoPorPunto(punto.tipo)}
          size={14}
          color={estaSeleccionado ? "#ffffff" : colorHeader}
        />
      </View>
    </Marker>
  );
}

// function RenderStars({ rating }) {
//   const stars = [];
//   for (let i = 1; i <= 5; i++) {
//     stars.push(
//       <Icon
//         key={i}
//         name="star"
//         solid={i <= rating}
//         size={10}
//         color="#FBC02D"
//         style={{ marginRight: 1 }}
//       />,
//     );
//   }
//   return <View style={{ flexDirection: "row", marginRight: 4 }}>{stars}</View>;
// }

function RenderPopUpFlotante({
  puntoSeleccionado,
  cerrarPopup,
  seccionInfoDesplegada,
  setSeccionInfoDesplegada,
}) {
  if (!puntoSeleccionado) return null;

  // const [comentariosAbiertos, setComentariosAbiertos] = useState(false);
  // const comentarios = puntoSeleccionado.comentarios || [
  //   {
  //     id: 1,
  //     lugar: "Albergue Jesús y María:",
  //     texto: "¡Increíble lugar! Limpio y personal amable.",
  //     autor: "Maria L.",
  //     tiempo: "hace 2h",
  //     rating: 5,
  //     icon: "bed",
  //     iconBg: "#2b5b84",
  //   },
  //   {
  //     id: 2,
  //     lugar: "Restaurante San Cernin:",
  //     texto: "Menú del día muy rico y económico.",
  //     autor: "Pablo S.",
  //     tiempo: "hace 4h",
  //     rating: 4,
  //     icon: "utensils",
  //     iconBg: "#a0522d",
  //   },
  // ];

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
        {/* OPCIÓN 2: VER COMENTARIOS RECIENTES */}
        {/* <TouchableOpacity
          style={[styles.menuButton, !comentariosAbiertos && styles.lastButton]}
          onPress={() => {
            setComentariosAbiertos(!comentariosAbiertos);
            if (!comentariosAbiertos) setInfoAbierta(false); // Cierra el otro al abrir este
          }}
        >
          <Icon
            name="comment-alt"
            size={16}
            color="#111111"
            style={styles.buttonIcon}
          />
          <Text style={styles.menuButtonText}>Ver comentarios recientes</Text>
          <Icon
            name={comentariosAbiertos ? "chevron-up" : "chevron-down"}
            size={14}
            color="#666666"
            style={styles.chevronIcon}
          />
        </TouchableOpacity>

        <DesplegableAcordeon isOpen={comentariosAbiertos}>
          {comentarios.map((comentario) => (
            <View key={comentario.id} style={styles.commentCard}>
              <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
                <View
                  style={[
                    styles.commentAvatar,
                    { backgroundColor: comentario.iconBg },
                  ]}
                >
                  <Icon name={comentario.icon} size={11} color="#ffffff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.commentLugar}>{comentario.lugar}</Text>
                  <Text style={styles.commentTexto}>{comentario.texto}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RenderStars rating={comentario.rating} />
                    <Text style={styles.commentMetaText}>
                      - {comentario.autor} ({comentario.tiempo})
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </DesplegableAcordeon> */}
      </ScrollView>
    </View>
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
        onPress={() => {
          setSeccionInfoDesplegada(seccionInfoDesplegada);
          //if (!infoAbierta) setComentariosAbiertos(false);
        }}
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

function RenderComentariosPunto({ punto }) {
  return <></>;
}

class Mapa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      puntoSeleccionado: null,
      seccionInfoDesplegada: false,
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

  handleClicarPunto(e, punto) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    this.setState({
      puntoSeleccionado: punto,
      seccionInfoDesplegada: false,
    });
  }

  cerrarPopup() {
    this.setState({
      puntoSeleccionado: null,
      seccionInfoDesplegada: false,
    });
  }

  setSeccionInfoDesplegada(infoDesplegada) {
    this.setState({ seccionInfoDesplegada: !infoDesplegada });
  }

  formatearCoordenadas(rutaSeleccionada) {
    if (!rutaSeleccionada?.coordenadas?.length) return [];

    return rutaSeleccionada.coordenadas.map((punto) => ({
      latitude: punto[1],
      longitude: punto[0],
    }));
  }

  render() {
    const idRuta = this.props.route.params?.rutaId;
    const rutaSeleccionada = this.props.rutas.rutas[idRuta];
    const rutaCoordenadas = this.formatearCoordenadas(rutaSeleccionada);

    const idPuntoSeleccionado = this.state.puntoSeleccionado?.id;

    return (
      <SafeAreaView style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          // initialRegion={{
          //   latitude: 42.466,
          //   longitude: -2.445,
          //   latitudeDelta: 5,
          //   longitudeDelta: 5,
          // }}
          onPress={() => this.cerrarPopup}
        >
          {rutaCoordenadas.length > 0 && (
            <Polyline
              coordinates={rutaCoordenadas}
              strokeColor="#005293"
              strokeWidth={5}
            />
          )}

          {rutaSeleccionada?.puntosCaracteristicos?.map((punto) => (
            <RenderPuntoCaracteristico
              key={punto.id}
              idPuntoSeleccionado={idPuntoSeleccionado}
              punto={punto}
              handleClicarPunto={(e, punto) => this.handleClicarPunto(e, punto)}
              obtenerIconoPorPunto={(tipo) => this.obtenerIconoPorPunto(tipo)}
            />
          ))}
        </MapView>
        <RenderPopUpFlotante
          puntoSeleccionado={this.state.puntoSeleccionado}
          cerrarPopup={() => this.cerrarPopup()}
          seccionInfoDesplegada={this.state.seccionInfoDesplegada}
          setSeccionInfoDesplegada={(infoDesplegada) =>
            this.setSeccionInfoDesplegada(infoDesplegada)
          }
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
    maxHeight: Dimensions.get("window").height * 0.4,
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
  lastButton: {
    marginBottom: 0,
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
  commentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#edf0f4",
  },
  commentAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  commentLugar: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 1,
  },
  commentTexto: {
    fontSize: 12,
    color: "#444444",
    marginBottom: 4,
    lineHeight: 15,
  },
  commentMetaText: {
    fontSize: 11,
    color: "#777777",
  },
});

export default connect(mapStateToProps)(Mapa);
