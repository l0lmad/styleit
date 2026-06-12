import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAsqphTQa-Wa3zJI5Q2e_y2T6ML1wW6WqU",
  authDomain: "warawear-ca26c.firebaseapp.com",
  projectId: "warawear-ca26c",
  storageBucket: "warawear-ca26c.firebasestorage.app",
  messagingSenderId: "249525014760",
  appId: "1:249525014760:web:f5df8084eb0307effcf95d",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
