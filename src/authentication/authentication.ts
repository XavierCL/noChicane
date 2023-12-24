import { getAuth, User } from "firebase/auth";
import { firebaseApp } from "../firebase/config";
import { GoogleAuthProvider } from "firebase/auth";

export const firebaseAuth = getAuth(firebaseApp);

export const authProvider = new GoogleAuthProvider();
let userCredential: User | undefined = undefined;

export const setUserCredentials = (newCredential: User) =>
  (userCredential = newCredential);

export const useAuthentication = () => {
  return userCredential!;
};

export const useIsXcl = () => {
  return useAuthentication().uid === "CjpvbFe7Uod443sLQdkUMDhtgXD2";
};
