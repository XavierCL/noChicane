import { useEffect, useState } from "react";
import { firebaseAuth, setUserCredentials } from "./authentication";
import { AuthenticationPage } from "./AuthenticationPage";

type AuthenticationProviderProps = {
  children: React.ReactNode;
};

export const AuthenticationProvider = ({
  children,
}: AuthenticationProviderProps) => {
  const [authReadyState, setAuthReadyState] = useState<
    "loading" | "loggedIn" | "loggedOut"
  >("loading");

  useEffect(() => {
    firebaseAuth.onAuthStateChanged(
      (newCredential) => {
        if (!newCredential) {
          setAuthReadyState("loggedOut");
          return;
        }

        if (newCredential) {
          setAuthReadyState("loggedIn");
          setUserCredentials(newCredential);
          return;
        }
      },
      (error) => {
        console.error("auth state error", error);
      }
    );
  }, []);

  if (authReadyState === "loading") {
    return <AuthenticationPage status="loading" />;
  }

  if (authReadyState === "loggedOut") {
    return <AuthenticationPage status="loggedOut" />;
  }

  return <>{children}</>;
};
