import { Button, CircularProgress } from "@mui/material";
import { signInWithRedirect } from "firebase/auth";
import { authProvider, firebaseAuth } from "./authentication";
import emotionStyled from "@emotion/styled";

type AuthenticationPageProps = {
  status: "loading" | "loggedOut";
};

export const AuthenticationPage = ({ status }: AuthenticationPageProps) => (
  <Container>
    <div>
      {status === "loading" && <CircularProgress />}
      {status === "loggedOut" && (
        <Button
          variant="contained"
          onClick={() => signInWithRedirect(firebaseAuth, authProvider)}
        >
          Login
        </Button>
      )}
    </div>
  </Container>
);

const Container = emotionStyled.div`
  width: 100vw;
  height: 100vh;
  display: flex;

  align-items: center;

  div {
    margin: auto;
  }
`;
