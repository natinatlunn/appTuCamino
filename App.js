import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Camera } from 'expo-camera';

import CameraScanner from './components/camera';

export default function App() {
  const [scannerVisible, setScannerVisible] = useState(false);

  if (scannerVisible) {
    return (
      <View style={styles.fullScreen}>
        <CameraScanner onClose={() => setScannerVisible(false)} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantalla principal</Text>
      <Text style={styles.subtitle}>Pulsa el botón para abrir la cámara y escanear un código QR.</Text>

      <Pressable
        style={styles.button}
        onPress={async () => {
          const res = await Camera.requestCameraPermissionsAsync();
          if (res.granted) setScannerVisible(true);
        }}
      >
        <Text style={styles.buttonText}>Escanear codigo qr</Text>
      </Pressable>

      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fullScreen: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: 28,
  },
  button: {
    backgroundColor: '#22c55e',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: '#052e16',
    fontSize: 18,
    fontWeight: '700',
  },
});
