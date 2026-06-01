import { Component } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { connect } from "react-redux";
import Icon from "@expo/vector-icons/FontAwesome5";
import { colorHeader, obtenerRutasNormalizadas } from "../comun/comun";
import { Card, Text, IconButton, Surface } from "react-native-paper";

function TarjetaBienvenida({ user, datosPerfil }) {
  return (
    <View style={styles.bienvenidaCard}>
      <Image
        source={require("../components/imagenes/imagBienvenida.png")}
        style={styles.bienvenidaImage}
        resizeMode="contain"
      />
      {user && (
        <Text
          style={styles.bienvenidaTitle}
        >{`¡Bienvenido ${datosPerfil.nombre}!`}</Text>
      )}

      <Text style={styles.bienvenidaText}>
        Elige una ruta del Camino de Santiago y disfruta de una experiencia
        única.
      </Text>
    </View>
  );
}

function TarjetaRuta({ ruta, onPress }) {
  return (
    <Card
      mode="elevated"
      style={[
        styles.card,
        {
          borderLeftWidth: 5,
          borderLeftColor: colorHeader,
        },
      ]}
      onPress={onPress}
    >
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.routeCardIconWrap}>
            <Icon name="route" size={16} color="#ffffff" />
          </View>

          <View style={styles.titleContainer}>
            <Text variant="titleMedium" style={styles.nombre} numberOfLines={1}>
              {ruta.nombre}
            </Text>

            <Text
              variant="bodySmall"
              style={styles.recorrido}
              numberOfLines={2}
            >
              {ruta.lugarInicio} → {ruta.lugarFin}
            </Text>
          </View>

          <IconButton icon="chevron-right" size={22} />
        </View>

        <View style={styles.divider} />

        <View style={styles.statsContainer}>
          <Surface style={styles.statCard} elevation={0}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {ruta.distancia}
            </Text>
            <Text variant="labelMedium">km</Text>
          </Surface>
          <Surface style={styles.statCard} elevation={0}>
            <Text style={styles.statValueDificultad}>
              Dificultad {ruta.dificultad}
            </Text>
          </Surface>
          <Surface style={styles.statCard} elevation={0}>
            <Text variant="headlineSmall" style={styles.statValue}>
              {ruta.etapas}
            </Text>
            <Text variant="labelMedium">Etapas</Text>
          </Surface>
        </View>
      </Card.Content>
    </Card>
  );
}

const mapStateToProps = (state) => ({
  rutas: state.rutas,
  auth: state.auth,
});

class Home extends Component {
  seleccionarYRendirRuta = (ruta) => {
    if (!ruta) {
      return;
    }

    const { navigate } = this.props.navigation;

    navigate("Mapa", { screen: "Mapa", params: { rutaId: ruta.id } });
  };

  render() {
    const { rutas, isLoading } = this.props.rutas;
    const user = this.props.auth?.user;
    const datosPerfil = this.props.auth?.datosPerfil;

    return (
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colorHeader} />
            <Text style={styles.loadingText}>Cargando rutas...</Text>
          </View>
        ) : (
          <FlatList
            data={rutas}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={
              <TarjetaBienvenida user={user} datosPerfil={datosPerfil} />
            }
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TarjetaRuta
                ruta={item}
                onPress={() => this.seleccionarYRendirRuta(item)}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    fontSize: 23,
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
  routeCardIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colorHeader,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
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
  card: {
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },

  nombre: {
    fontWeight: "700",
  },

  recorrido: {
    marginTop: 4,
    opacity: 0.7,
  },

  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginVertical: 16,
  },

  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
  },

  statValue: {
    fontWeight: "700",
  },
  statValueDificultad: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#f7f3ea",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 14,
    color: "#6b6258",
    fontSize: 15,
  },
});

export default connect(mapStateToProps)(Home);
