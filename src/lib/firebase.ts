import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  projectId: 'studio-5747447299-c92b3',
  appId: '1:355137968279:web:ee9e23b3a1fa7483c031d2',
  apiKey: 'AIzaSyAyDmupkUNp56nXY-ZtjXZvQ3V1NCdgE2g',
  authDomain: 'studio-5747447299-c92b3.firebaseapp.com',
  measurementId: '',
  messagingSenderId: '355137968279'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
