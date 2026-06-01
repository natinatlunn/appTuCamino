import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { connect } from "react-redux";
import InfoQrComponent from "./InfoQrComponent";
import {
  fetchQRInfo,
  setModalVisible,
  setQrData,
  setScanned,
} from "../redux/ActionCreators";
import { colorHeader } from "../comun/comun";

function CameraScanner({
  onClose,
  scanned,
  modalVisible,
  qrData,
  setScanned,
  setModalVisible,
  setQrData,
  fetchQRInfo,
}) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>
          Necesitamos permiso para abrir la cámara.
        </Text>
        <Pressable style={styles.actionButton} onPress={requestPermission}>
          <Text style={styles.actionText}>Conceder permiso</Text>
        </Pressable>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) {
      return;
    }

    setScanned(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    fetchQRInfo(data);
    setModalVisible(true);
    console.log("QR escaneado:", data);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setQrData(null);
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <Text style={styles.title}>Centra el código QR</Text>

        <Pressable
          style={styles.actionButton}
          onPress={() => {
            setScanned(false);
            onClose?.();
          }}
        >
          <Text style={styles.actionText}>Cerrar cámara</Text>
        </Pressable>
      </View>

      <InfoQrComponent
        visible={modalVisible}
        qrData={qrData}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const mapStateToProps = (state) => ({
  scanned: state.scanner.scanned,
  modalVisible: state.scanner.modalVisible,
  qrData: state.scanner.qrData,
});

const mapDispatchToProps = (dispatch) => ({
  setScanned: (value) => dispatch(setScanned(value)),
  setModalVisible: (value) => dispatch(setModalVisible(value)),
  setQrData: (data) => dispatch(setQrData(data)),
  fetchQRInfo: (qrCode) => dispatch(fetchQRInfo(qrCode)),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.28)",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: 24,
  },
  title: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#e2e8f0",
    fontSize: 15,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 20,
  },
  message: {
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: 16,
    fontSize: 15,
  },
  actionButton: {
    backgroundColor: colorHeader,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 180,
    alignItems: "center",
  },
  actionText: {
    color: "#052e16",
    fontSize: 16,
    fontWeight: "700",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CameraScanner);
