import { createTheme } from "@mui/material";

export const theme = {
  background: "#121212",
  backgroundPale: "#1e1e1e",
  palette: {
    error: "#f44336",
    success: "#4caf50",
  },
};

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#90caf9",
    },
    secondary: {
      main: "#ce93d8",
    },
    background: {
      default: theme.background,
    },
    error: {
      main: theme.palette.error,
    },
    success: {
      main: theme.palette.success,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          color: "rgba(255,255,255,.87)",
          backgroundColor: theme.background,
        },
      },
    },
  },
});
