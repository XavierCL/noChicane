import { createTheme } from "@mui/material";

export const theme = {
  background: "#121212",
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
