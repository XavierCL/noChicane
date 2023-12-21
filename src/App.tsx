import { CssBaseline, ThemeProvider } from "@mui/material";
import { AddNewTransaction } from "./content/AddNewTransaction";
import { TransactionList } from "./content/TransactionList";
import { muiTheme } from "./theme/muiTheme";
import emotionStyled from "@emotion/styled";
import { ApplicationHeader } from "./header/ApplicationHeader";
import { AuthenticationProvider } from "./authentication/AuthenticationProvider";

export const App = () => (
  <ThemeProvider theme={muiTheme}>
    <CssBaseline />
    <AuthenticationProvider>
      <ApplicationHeader />
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
    </AuthenticationProvider>
  </ThemeProvider>
);

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
