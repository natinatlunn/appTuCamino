import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

export default function InfoQrComponent({ visible, qrData, onClose }) {
  const info = qrData ?? {};

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        
          <Text style={styles.modalTitle}>Código QR Escaneado</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Código:</Text>
            <Text style={styles.infoText}>{info.id ?? 'Sin código'}</Text>

            <Text style={styles.infoLabel}>Nombre:</Text>
            <Text style={styles.infoText}>{info.nombre ?? 'Sin nombre'}</Text>

            <Text style={styles.infoLabel}>Descripción:</Text>
            <Text style={styles.infoText}>{info.descripcion ?? 'Sin descripción'}</Text>

            {info.tipo ? (
              <>
                <Text style={styles.infoLabel}>Tipo:</Text>
                <Text style={styles.infoText}>{info.tipo}</Text>
              </>
            ) : null}
          </View>

          <Pressable
            style={styles.closeModalButton}
            onPress={onClose}
          >
            <Text style={styles.closeModalButtonText}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 10,
    marginBottom: 15,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    color: '#333333',
    lineHeight: 24,
  },
  closeModalButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
