import emotionStyled from "@emotion/styled";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { useAuthentication } from "../../authentication/authentication";
import { theme } from "../../theme/muiTheme";

export const ApplicationHeader = () => {
  const userCredential = useAuthentication();

  return (
    <AppBar position="sticky">
      <AppToolbar>
        <Logo src="/nochicane.svg" />
        <Title>No chicane</Title>
        <UserEmail>{userCredential.email}</UserEmail>
      </AppToolbar>
    </AppBar>
  );
};

const AppToolbar = emotionStyled(Toolbar)`
  @media (min-width: 600px) {
    padding-left: 0;
  }

  padding-left: 0;
`;

const Logo = emotionStyled.img`
  height: 64px;
  padding: 16px;
`;

const Title = emotionStyled(Typography)`
  flex: 1;
`;

const UserEmail = emotionStyled(Typography)`
  flex: 0;
  background-color: ${theme.backgroundPale};
  border-radius: 8px;
  padding: 4px;
`;
