import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDXaInajkq5SehPCkfm2V3RLW3OgCvwwSM",
    authDomain: "damarisfcmapp.firebaseapp.com",
    databaseURL: "https://damarisfcmapp.firebaseio.com",
    projectId: "damarisfcmapp",
    storageBucket: "damarisfcmapp.firebasestorage.app",
    messagingSenderId: "327649713751",
    appId: "1:327649713751:web:e96f6890ac3eb975",
    measurementId: "G-QF5GJKPSWS"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app); // Realtime DB