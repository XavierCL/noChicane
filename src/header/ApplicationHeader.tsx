import emotionStyled from "@emotion/styled";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useAuthentication } from "../authentication/authentication";

export const ApplicationHeader = () => {
  const userCredential = useAuthentication();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Title>No chicane</Title>
        <UserEmail>{userCredential.email}</UserEmail>
      </Toolbar>
    </AppBar>
  );
};

const Title = emotionStyled(Typography)`
  flex: 1;
`;

const UserEmail = emotionStyled(Typography)`
  flex: 0;
`;
