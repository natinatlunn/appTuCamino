import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBOQgTuQff6r5hvgP8ZUjQzBpTVHHxtaxU",
  authDomain: "apptucamino.firebaseapp.com",
  databaseURL: "https://apptucamino-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "apptucamino",
  storageBucket: "apptucamino.firebasestorage.app",
  messagingSenderId: "292741118276",
  appId: "1:292741118276:web:1f71bc3789ffe22de6ff11"
};

//Conecta la app a firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);

//Funcion para obtener información del QR desde firebase
export const getQRInfo = async (qrCode) => {
  try {
    const qrRef = ref(database, `qr_codes/${qrCode}`);
    const snapshot = await get(qrRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("QR no encontrado en la base de datos");
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo información del QR:", error);
    return null;
  }
};

