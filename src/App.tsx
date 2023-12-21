import {
  AppBar,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { AddNewTransaction } from "./ingredients/AddNewTransaction";
import { TransactionList } from "./ingredients/TransactionList";
import { muiTheme } from "./theme/muiTheme";
import emotionStyled from "@emotion/styled";

export const App = () => {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppBar position="sticky">
        <Toolbar>
          <Typography>No chicane</Typography>
        </Toolbar>
      </AppBar>
      <ApplicationContainer>
        <AddNewTransaction />
        <MainTablesContainer>
          <TransactionList
            sortSelector={(transaction) => transaction.transactionDate}
          />
          <TransactionList
            sortSelector={(transaction) => transaction.addedDate}
          />
        </MainTablesContainer>
      </ApplicationContainer>
    </ThemeProvider>
  );
};

const ApplicationContainer = emotionStyled.div`
  padding: 8px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MainTablesContainer = emotionStyled.div`
  flex: 1;

  display: flex;
  flex-direction: row;
  gap: 8px;
`;
