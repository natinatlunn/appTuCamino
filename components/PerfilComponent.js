import { Component } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colorHeader } from "../comun/comun";
import { auth } from "../comun/firebaseConfig";
import { connect } from "react-redux";

class Perfil extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      submitting: false,
      message: "",
    };
  }

  handleLogin = async () => {
    const { email, password } = this.state;

    this.setState({ submitting: true, message: "" });

    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      this.setState({
        user: credential.user,
        email: "",
        password: "",
      });
    } catch (error) {
      const authError = error?.code ? `${error.code}: ` : "";
      this.setState({ email: "", password: "", message: "" });
      this.setState({
        message: `${authError}No se ha podido iniciar sesión. Revisa el correo y la contraseña.`,
      });
    } finally {
      this.setState({ submitting: false });
    }
  };

  handleLogout = async () => {
    this.setState({ submitting: true, message: "" });

    try {
      await signOut(auth);
      this.setState({
        user: null,
        email: "",
        password: "",
      });
    } catch (error) {
      const authError = error?.code ? `${error.code}: ` : "";
      this.setState({ message: `${authError}No se ha podido cerrar la sesión.` });
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { email, password, submitting, message } = this.state;
    const { user, loading } = this.props.auth;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colorHeader} />
          <Text style={styles.loadingText}>Comprobando sesión...</Text>
        </View>
      );
    }

    if (user) {
      return (
        <View style={styles.container}>
          <View style={styles.heroCard}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="account-check" size={34} color="#ffffff" />
            </View>
            <Text style={styles.title}>Bienvenido a tu cuenta!</Text>
            <Text style={styles.subtitle}>
              Has iniciado sesión como {user.email || "usuario autenticado"}.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={this.handleLogout}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? "Cerrando sesión..." : "Cerrar sesión"}
            </Text>
          </TouchableOpacity>

          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.heroCard}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="account-lock" size={34} color="#ffffff" />
          </View>
          <Text style={styles.title}>Iniciar sesión</Text>
          
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(nextEmail) => this.setState({ email: nextEmail })}
            placeholder="usuario@correo.com"
            placeholderTextColor="#a49c92"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="username"
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={(nextPassword) => this.setState({ password: nextPassword })}
            placeholder="Tu contraseña"
            placeholderTextColor="#a49c92"
            secureTextEntry
            textContentType="password"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={this.handleLogin}
            disabled={submitting || !email || !password}
          >
            <Text style={styles.buttonText}>
              {submitting ? "Iniciando sesión..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          {!!message && <Text style={styles.message}>{message}</Text>}
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f3ea",
    padding: 18,
    justifyContent: "center",
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
  heroCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colorHeader,
    marginBottom: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1f1a14",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 8,
    color: "#6b6258",
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
  },
  label: {
    marginBottom: 8,
    marginTop: 12,
    color: "#1f1a14",
    fontWeight: "700",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ded6c8",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1f1a14",
    backgroundColor: "#fcfbf7",
  },
  button: {
    marginTop: 18,
    backgroundColor: colorHeader,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 0,
  },
  buttonText: {
    color: "#1f1a14",
    fontWeight: "800",
    fontSize: 15,
  },
  message: {
    marginTop: 14,
    color: "#8a4429",
    textAlign: "center",
    fontSize: 14,
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Perfil);