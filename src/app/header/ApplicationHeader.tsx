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
    padding-left: 16px;
    padding-right: 4px;
  }

  padding-left: 16px;
  padding-right: 4px;
  gap: 8px;
`;

const Logo = emotionStyled.img`
  height: 64px;
  padding-top: 16px;
  padding-bottom: 16px;
`;

const Title = emotionStyled(Typography)`
  flex: 1;
  text-wrap: nowrap;
`;

const UserEmail = emotionStyled(Typography)`
  flex-grow: 0;
  flex-shrink: 1;
  flex-basis: auto;
  background-color: ${theme.backgroundPale};
  border-radius: 8px;
  padding: 4px;

  text-wrap: nowrap;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;
