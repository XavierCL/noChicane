import { Button, CircularProgress } from "@mui/material";
import { signInWithPopup, signInWithRedirect } from "firebase/auth";
import { authProvider, firebaseAuth } from "./authentication";
import emotionStyled from "@emotion/styled";

type AuthenticationPageProps = {
  status: "loading" | "loggedOut";
};

export const AuthenticationPage = ({ status }: AuthenticationPageProps) => (
  <Container>
    <CentralControl>
      {status === "loading" && <CircularProgress />}
      {status === "loggedOut" && (
        <Button
          variant="contained"
          onClick={() => signInWithRedirect(firebaseAuth, authProvider)}
        >
          Login
        </Button>
      )}
    </CentralControl>
    <Button
      variant="outlined"
      onClick={() =>
        signInWithPopup(firebaseAuth, authProvider).catch((error) =>
          console.error("Error while signing with popup", error)
        )
      }
      style={{ alignSelf: "flex-end" }}
    >
      Manual login
    </Button>
  </Container>
);

const Container = emotionStyled.div`
  width: 100vw;
  height: 100vh;
  padding: 8px;

  display: flex;
  flex-direction: column;
`;

const CentralControl = emotionStyled.div`
  align-self: center;
  flex: 1;

  display: flex;
  flex-direction: row;
  align-items: center;
`;
