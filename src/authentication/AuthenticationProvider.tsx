import { useEffect, useState } from "react";
import { firebaseAuth, useAuthentication } from "./authentication";
import { AuthenticationPage } from "./AuthenticationPage";

type AuthenticationProviderProps = {
  children: React.ReactNode;
};

export const AuthenticationProvider = ({
  children,
}: AuthenticationProviderProps) => {
  const [changeCount, setChangeCount] = useState(0);

  const credential = useAuthentication();

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(
      (newCredential) => {
        console.log("on auth changed", newCredential);
        setChangeCount((old) => old + 1);
      },
      (error) => {
        console.error("auth state is not ready", error);
      }
    );
  }, []);

  if (changeCount === 0) {
    return <AuthenticationPage status="loading" />;
  }

  if (!credential) {
    return <AuthenticationPage status="loggedOut" />;
  }

  return <>{children}</>;
};
