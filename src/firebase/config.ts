import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export const firebaseApp = initializeApp({
  apiKey: "AIzaSyBBv1a695chwPZNm3NN_zP6C8OgmZKKJDU",
  authDomain: "nochicane-1.web.app",
  projectId: "nochicane-1",
  storageBucket: "nochicane-1.appspot.com",
  messagingSenderId: "944003543899",
  appId: "1:944003543899:web:288108249c68bd657b607e",
});

export const database = getFirestore(firebaseApp);
