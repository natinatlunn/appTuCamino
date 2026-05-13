import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import InfoQrComponent from './InfoQrComponent';

export default function CameraScanner({ onClose }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false); //Para que solo se escanee un código QR 
  const [modalVisible, setModalVisible] = useState(false);
  const [qrData, setQrData] = useState(null);

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
        <Text style={styles.message}>Necesitamos permiso para abrir la cámara.</Text>
        <Pressable style={styles.actionButton} onPress={requestPermission}>
          <Text style={styles.actionText}>Conceder permiso</Text>
        </Pressable>
      </View>
    );
  }

  //Funcion que se ejecuta al escanear un código QR
  const handleBarcodeScanned = async ({ data }) => {
    if (scanned) {
      return;
    }

    setScanned(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setQrData(data);
    setModalVisible(true);
    console.log('QR escaneado:', data);
  };

  //Función para cerrar el modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setQrData(null);
    setScanned(false); // Permite escanear otro código QR
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
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

      {/* Modal con información del QR */}
      <InfoQrComponent 
        visible={modalVisible}
        qrData={qrData}
        onClose={handleCloseModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.28)',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 20,
  },
  message: {
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 16,
  },
  actionButton: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    minWidth: 180,
    alignItems: 'center',
  },
  actionText: {
    color: '#052e16',
    fontSize: 16,
    fontWeight: '700',
  },
});
