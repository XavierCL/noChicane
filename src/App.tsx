import { CssBaseline, ThemeProvider } from "@mui/material";
import { muiTheme } from "./theme/muiTheme";
import { AuthenticationProvider } from "./authentication/AuthenticationProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { AuthenticatedApp } from "./app/AuthenticatedApp";

export const App = () => (
  <LocalizationProvider dateAdapter={AdapterLuxon}>
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthenticationProvider>
        <AuthenticatedApp />
      </AuthenticationProvider>
    </ThemeProvider>
  </LocalizationProvider>
);
