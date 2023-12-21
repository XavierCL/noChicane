import { getAuth, UserCredential } from "firebase/auth";
import { firebaseApp } from "../firebase/config";
import { GoogleAuthProvider } from "firebase/auth";

export const firebaseAuth = getAuth(firebaseApp);
export const authProvider = new GoogleAuthProvider();
let userCredential: UserCredential | undefined = undefined;

export const setUserCredentials = (newCredential: UserCredential) =>
  (userCredential = newCredential);

export const useAuthentication = () => {
  return userCredential!;
};
