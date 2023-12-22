import { CssBaseline, ThemeProvider } from "@mui/material";
import { TransactionList } from "./content/TransactionList";
import { muiTheme } from "./theme/muiTheme";
import emotionStyled from "@emotion/styled";
import { ApplicationHeader } from "./header/ApplicationHeader";
import { AuthenticationProvider } from "./authentication/AuthenticationProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { TopContent } from "./content/topContent/TopContent";

export const App = () => (
  <LocalizationProvider dateAdapter={AdapterLuxon}>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthenticationProvider>
        <ApplicationHeader />
        <ApplicationContainer>
          <TopContent />
          <MainTablesContainer>
            <TransactionList
              sortSelector={(transaction) => transaction.transactionDate}
            />
          </MainTablesContainer>
        </ApplicationContainer>
      </AuthenticationProvider>
    </ThemeProvider>
  </LocalizationProvider>
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
