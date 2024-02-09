import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyALq4AIi_Gv4asBUFTeh4sw0NcjUz_FkVU',
    appId: '1:33614390636:web:ea2bd340b5ab7bbe1aff49',
    messagingSenderId: '33614390636',
    projectId: 'freeretrospectivetool',
    authDomain: 'freeretrospectivetool.firebaseapp.com',
    databaseURL: 'https://freeretrospectivetool-default-rtdb.europe-west1.firebasedatabase.app',
    storageBucket: 'freeretrospectivetool.appspot.com',
    measurementId: 'G-Z6N0TNLJ7P',
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export { firebaseConfig, firebaseApp, auth, GoogleAuthProvider, signInWithPopup };