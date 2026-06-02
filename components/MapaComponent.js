import { Component } from "react";
import MapView, { PROVIDER_GOOGLE, Polyline, Marker } from "react-native-maps";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/FontAwesome5";
import { colorHeader } from "../comun/comun";
import {
  addUserRouteMarker,
  getUserRouteMarkers,
  removeUserRouteMarker,
} from "../comun/markersStorage";
import { postComentario } from "../redux/ActionCreators";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(relativeTime);
dayjs.locale("es");

const mapStateToProps = (state) => {
  return {
    rutas: state.rutas,
    comentarios: state.comentarios,
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => ({
  postComentario: (rutaId, puntoId, puntuacion, comentario) =>
    dispatch(postComentario(rutaId, puntoId, puntuacion, comentario)),
});

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

function RenderMarcadorUsuario({ marcador, onPress }) {
  return (
    <Marker
      key={marcador.id}
      coordinate={{
        latitude: marcador.latitude,
        longitude: marcador.longitude,
      }}
      onPress={(e) => onPress(e, marcador)}
    >
      <View style={styles.userMarker}>
        <Icon name="map-marker-alt" size={14} color="#ffffff" />
      </View>
    </Marker>
  );
}

function RenderPopUpFlotante({
  puntoSeleccionado,
  comentarios,
  cerrarPopup,
  eliminarMarcador,
  seccionInfoDesplegada,
  setSeccionInfoDesplegada,
  seccionComentariosDesplegada,
  setSeccionComentariosDesplegada,
  setMostrarFormularioComentario,
  usuarioLogueago,
}) {
  if (!puntoSeleccionado) return null;

  const comentariosFiltradosPorPunto = comentarios.filter(
    (comentario) => comentario.puntoId === puntoSeleccionado.id,
  );

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

      <RenderInformacionPunto
        puntoSeleccionado={puntoSeleccionado}
        seccionInfoDesplegada={seccionInfoDesplegada}
        setSeccionInfoDesplegada={setSeccionInfoDesplegada}
        setSeccionComentariosDesplegada={setSeccionComentariosDesplegada}
      />

      <RenderComentariosPunto
        comentarios={comentariosFiltradosPorPunto}
        seccionComentariosDesplegada={seccionComentariosDesplegada}
        setSeccionComentariosDesplegada={setSeccionComentariosDesplegada}
        setSeccionInfoDesplegada={setSeccionInfoDesplegada}
        setMostrarFormularioComentario={setMostrarFormularioComentario}
        usuarioLogueago={usuarioLogueago}
      />

      {puntoSeleccionado.esMarcadorUsuario && (
        <TouchableOpacity style={styles.deleteButton} onPress={eliminarMarcador}>
          <Icon name="trash-alt" size={14} color="#b42318" style={styles.buttonIcon} />
          <Text style={styles.deleteButtonText}>Eliminar marcador</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function RenderInformacionPunto({
  puntoSeleccionado,
  seccionInfoDesplegada,
  setSeccionInfoDesplegada,
  setSeccionComentariosDesplegada,
}) {
  return (
    <>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => {
          setSeccionInfoDesplegada(!seccionInfoDesplegada);
          if (!seccionInfoDesplegada) setSeccionComentariosDesplegada(false);
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

function RenderComentariosPunto({
  comentarios,
  seccionComentariosDesplegada,
  setSeccionComentariosDesplegada,
  setSeccionInfoDesplegada,
  setMostrarFormularioComentario,
  usuarioLogueago,
}) {
  const obtenerTiempoRelativo = (fechaRaw) => {
    if (!fechaRaw) return "";
    const fecha = fechaRaw.toDate ? fechaRaw.toDate() : fechaRaw;
    const fechaRelativa = dayjs(fecha).fromNow();
    return fechaRelativa.charAt(0).toUpperCase() + fechaRelativa.slice(1);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.menuButton,
          !seccionComentariosDesplegada && styles.lastButton,
        ]}
        onPress={() => {
          setSeccionComentariosDesplegada(!seccionComentariosDesplegada);
          if (!seccionComentariosDesplegada) setSeccionInfoDesplegada(false);
        }}
      >
        <Icon
          name="comment-alt"
          size={16}
          color="#111111"
          style={styles.buttonIcon}
        />
        <Text style={styles.menuButtonText}>
          Opiniones y reseñas ({comentarios.length})
        </Text>
        <Icon
          name={seccionComentariosDesplegada ? "chevron-up" : "chevron-down"}
          size={14}
          color="#666666"
          style={styles.chevronIcon}
        />
      </TouchableOpacity>
      {seccionComentariosDesplegada && (
        <View style={styles.comentariosContainer}>
          <FlatList
            data={comentarios}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={true}
            renderItem={({ item: comentario }) => (
              <View style={styles.commentCard}>
                <View
                  style={{ flexDirection: "row", alignItems: "flex-start" }}
                >
                  <View
                    style={[
                      styles.commentAvatar,
                      { backgroundColor: "#2b5b84" },
                    ]}
                  >
                    <Icon name="user" size={11} color="#ffffff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.comentarioEncabezado}>
                      <Text style={styles.commentLugar}>
                        {comentario.autor}
                      </Text>
                      <RenderEstrellas puntuacion={comentario.puntuacion} />
                    </View>
                    <Text style={styles.commentTexto}>
                      {comentario.comentario}
                    </Text>
                    <Text style={styles.commentMetaText}>
                      {obtenerTiempoRelativo(comentario.fecha)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
          {usuarioLogueago && (
            <TouchableOpacity
              style={styles.fabButton}
              onPress={() => setMostrarFormularioComentario()}
            >
              <Icon
                name="plus"
                size={15}
                color="#fff"
                style={{ marginRight: 5 }}
              />
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 15 }}>
                Nuevo comentario
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
}

function RenderEstrellas({ puntuacion }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Icon
        key={i}
        name="star"
        solid={i <= puntuacion}
        size={10}
        color="#FBC02D"
        style={{ marginRight: 1 }}
      />,
    );
  }
  return <View style={{ flexDirection: "row", marginRight: 4 }}>{stars}</View>;
}

function ModalNuevoComentario({
  mostrarFormularioComentario,
  setCerrarFormularioComentario,
  comentario,
  setComentario,
  puntuacion,
  setPuntuacion,
  publicarComentario,
}) {
  return (
    <Modal
      visible={mostrarFormularioComentario}
      transparent
      animationType="fade"
      onRequestClose={() => setCerrarFormularioComentario()}
    >
      <TouchableWithoutFeedback onPress={() => setCerrarFormularioComentario()}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <TouchableOpacity
                style={styles.cerrarModal}
                onPress={() => setCerrarFormularioComentario()}
              >
                <Icon name="times" size={18} color="#666" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Añadir comentario</Text>

              <View style={styles.ratingContainer}>
                <View style={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((estrella) => (
                    <TouchableOpacity
                      key={estrella}
                      onPress={() => setPuntuacion(estrella)}
                    >
                      <Icon
                        name="star"
                        solid={estrella <= puntuacion}
                        size={28}
                        color="#FBC02D"
                        style={{ marginHorizontal: 3 }}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TextInput
                multiline
                placeholder="Escribe tu comentario..."
                placeholderTextColor="#999"
                style={styles.inputComentario}
                value={comentario}
                onChangeText={(value) => setComentario(value)}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setCerrarFormularioComentario()}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => publicarComentario()}
                >
                  <Text style={styles.submitButtonText}>Publicar</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

class Mapa extends Component {
  constructor(props) {
    super(props);
    this.state = {
      puntoSeleccionado: null,
      seccionInfoDesplegada: false,
      seccionComentariosDesplegada: false,
      mostrarFormularioComentario: false,
      comentario: "",
      puntuacion: 3,
      marcadoresUsuario: [],
    };

    this.cargarMarcadoresUsuario = this.cargarMarcadoresUsuario.bind(this);
    this.handleLongPressMapa = this.handleLongPressMapa.bind(this);
    this.handleClicarMarcadorUsuario = this.handleClicarMarcadorUsuario.bind(this);
  }

  componentDidMount() {
    this.cargarMarcadoresUsuario();
  }

  componentDidUpdate(prevProps) {
    const routeIdAnterior = prevProps.route.params?.rutaId;
    const routeIdActual = this.props.route.params?.rutaId;
    const uidAnterior = prevProps.auth?.user?.uid;
    const uidActual = this.props.auth?.user?.uid;

    if (routeIdAnterior !== routeIdActual || uidAnterior !== uidActual) {
      this.cargarMarcadoresUsuario();
    }
  }

  async cargarMarcadoresUsuario() {
    const uid = this.props.auth?.user?.uid;
    const routeId = this.props.route.params?.rutaId;

    if (!uid || routeId === undefined || routeId === null) {
      this.setState({ marcadoresUsuario: [] });
      return;
    }

    const marcadoresUsuario = await getUserRouteMarkers(uid, String(routeId));
    this.setState({ marcadoresUsuario });
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
      seccionComentariosDesplegada: false,
    });
  }

  handleClicarMarcadorUsuario(e, marcador) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    this.setState({
      puntoSeleccionado: {
        id: marcador.id,
        markerId: marcador.id,
        nombre: marcador.nombre || "Marcador personal",
        tipo: "Marcador personal",
        descripcion: marcador.descripcion || "Marcador creado por el usuario.",
        direccion:
          marcador.direccion ||
          `Lat ${Number(marcador.latitude).toFixed(5)}, Lon ${Number(marcador.longitude).toFixed(5)}`,
        esMarcadorUsuario: true,
      },
      seccionInfoDesplegada: true,
      seccionComentariosDesplegada: false,
    });
  }

  async handleLongPressMapa(e) {
    const uid = this.props.auth?.user?.uid;
    const routeId = this.props.route.params?.rutaId;
    const coordinate = e?.nativeEvent?.coordinate;

    if (!uid || routeId === undefined || routeId === null || !coordinate) {
      return;
    }

    const nuevoMarcador = {
      id: `${uid}-${routeId}-${Date.now()}`,
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      createdAt: new Date().toISOString(),
    };

    const marcadoresUsuario = await addUserRouteMarker(
      uid,
      String(routeId),
      nuevoMarcador,
    );

    this.setState({ marcadoresUsuario });
  }

  async eliminarMarcadorUsuario() {
    const uid = this.props.auth?.user?.uid;
    const routeId = this.props.route.params?.rutaId;
    const markerId = this.state.puntoSeleccionado?.markerId;

    if (!uid || routeId === undefined || routeId === null || !markerId) {
      return;
    }

    const marcadoresUsuario = await removeUserRouteMarker(
      uid,
      String(routeId),
      markerId,
    );

    this.setState({
      marcadoresUsuario,
      puntoSeleccionado: null,
      seccionInfoDesplegada: false,
      seccionComentariosDesplegada: false,
    });
  }

  cerrarPopup() {
    this.setState({
      puntoSeleccionado: null,
      seccionInfoDesplegada: false,
      seccionComentariosDesplegada: false,
    });
  }

  setSeccionInfoDesplegada(infoDesplegada) {
    this.setState({ seccionInfoDesplegada: infoDesplegada });
  }

  setSeccionComentariosDesplegada(comentariosDesplegada) {
    this.setState({ seccionComentariosDesplegada: comentariosDesplegada });
  }

  setMostrarFormularioComentario() {
    this.setState({ mostrarFormularioComentario: true });
  }

  setCerrarFormularioComentario() {
    this.setState({
      mostrarFormularioComentario: false,
      comentario: "",
      puntuacion: 3,
    });
  }

  setComentario(texto) {
    this.setState({ comentario: texto });
  }

  setPuntuacion(puntuacion) {
    this.setState({ puntuacion: puntuacion });
  }

  publicarComentario() {
    const idRuta = this.props.route.params?.rutaId;
    const { puntuacion, comentario, puntoSeleccionado } = this.state;
    this.props.postComentario(
      idRuta,
      puntoSeleccionado.id,
      puntuacion,
      comentario,
    );
    this.setCerrarFormularioComentario();
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
    const routeIdString = String(idRuta);
    const marcadoresUsuario = this.state.marcadoresUsuario || [];

    const comentarios = this.props.comentarios.comentarios;
    const comentariosFiltrados = comentarios
      ? comentarios.filter((comentario) => comentario.rutaId === idRuta)
      : [];

    const usuarioLogueago = !!this.props.auth?.user;

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
          onPress={() => this.cerrarPopup()}
          onLongPress={(e) => this.handleLongPressMapa(e)}
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

          {marcadoresUsuario.map((marcador) => (
            <RenderMarcadorUsuario
              key={marcador.id}
              marcador={marcador}
              onPress={(e, marker) => this.handleClicarMarcadorUsuario(e, marker)}
            />
          ))}
        </MapView>

        <RenderPopUpFlotante
          puntoSeleccionado={this.state.puntoSeleccionado}
          comentarios={comentarios}
          cerrarPopup={() => this.cerrarPopup()}
          seccionInfoDesplegada={this.state.seccionInfoDesplegada}
          setSeccionInfoDesplegada={(infoDesplegada) =>
            this.setSeccionInfoDesplegada(infoDesplegada)
          }
          seccionComentariosDesplegada={this.state.seccionComentariosDesplegada}
          setSeccionComentariosDesplegada={(comentariosDesplegada) =>
            this.setSeccionComentariosDesplegada(comentariosDesplegada)
          }
          eliminarMarcador={() => this.eliminarMarcadorUsuario()}
          mostrarFormularioComentario={this.state.mostrarFormularioComentario}
          setMostrarFormularioComentario={() =>
            this.setMostrarFormularioComentario()
          }
          usuarioLogueago={usuarioLogueago}
        />

        <ModalNuevoComentario
          mostrarFormularioComentario={this.state.mostrarFormularioComentario}
          setCerrarFormularioComentario={() =>
            this.setCerrarFormularioComentario()
          }
          comentario={this.state.comentario}
          setComentario={(texto) => this.setComentario(texto)}
          puntuacion={this.state.puntuacion}
          setPuntuacion={(puntuacion) => this.setPuntuacion(puntuacion)}
          publicarComentario={() => this.publicarComentario()}
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
  userMarker: {
    backgroundColor: "#f97316",
    borderWidth: 1.5,
    borderColor: "#c2410c",
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fef3f2",
    borderWidth: 1,
    borderColor: "#fecdca",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 10,
  },
  deleteButtonText: {
    color: "#b42318",
    fontWeight: "700",
    fontSize: 14,
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
  comentariosScrollContainer: {
    paddingHorizontal: 4,
    paddingTop: 2,
    paddingBottom: 10,
    maxHeight: Dimensions.get("window").height * 0.5,
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
    fontSize: 14,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 1,
  },
  commentTexto: {
    fontSize: 13,
    color: "#444444",
    marginBottom: 4,
    lineHeight: 15,
  },
  commentMetaText: {
    fontSize: 11,
    color: "#777777",
    alignSelf: "flex-end",
    marginRight: 5,
  },
  comentarioEncabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  comentariosContainer: {
    position: "relative",
  },

  fabButton: {
    width: 170,
    height: 35,
    borderRadius: 25,
    backgroundColor: colorHeader,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    alignSelf: "flex-end",
    flexDirection: "row",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },

  inputComentario: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },

  botonEnviar: {
    marginTop: 15,
    backgroundColor: colorHeader,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cerrarModal: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 1,
    padding: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 15,
  },

  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },

  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },

  submitButton: {
    backgroundColor: colorHeader,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },

  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  ratingContainer: {
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Mapa);
