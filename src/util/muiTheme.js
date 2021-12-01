import { createTheme } from "@material-ui/core/styles";

const primaryPaletteTheme = createTheme({
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    secondary: {
      main: "rgb(255, 255, 255, 0.9)",
      darker: "#053e85",
    },
  },
});

const albumFriendBtnTheme = createTheme({
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    secondary: {
      main: "#ADADAD",
      darker: "#053e85",
    },
  },
  shape: { borderRadius: 24 },
  typography: {
    button: {
      fontSize: 20,
      fontWeight: 700,
    },
  },
});

const changeBackgroundBtnTheme = createTheme({
  ...primaryPaletteTheme,
  shape: { borderRadius: 20 },
  typography: {
    button: {
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.1,
      textTransform: "lowercase",
    },
  },
});

const moreInfoBtnTheme = createTheme({
  ...primaryPaletteTheme,
  shape: { borderRadius: 24 },
  typography: {
    button: {
      fontSize: 20,
      fontWeight: 700,
    },
  },
});
const signInBtnTheme = createTheme({
  ...primaryPaletteTheme,
  shape: { borderRadius: 18 },
  typography: {
    button: {
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.6,
      textTransform: "none",
    },
  },
});

const signInEnterTheme = createTheme({
  ...primaryPaletteTheme,
  shape: { borderRadius: 24 },
  typography: {
    button: {
      fontSize: 16,
      fontWeight: 700,
      lineHeight: 1.2,
    },
  },
});

const whiteBtnTheme = createTheme({
  palette: {
    white: {
      main: "#ffffff",
    },
  },
});

export {
  primaryPaletteTheme,
  albumFriendBtnTheme,
  changeBackgroundBtnTheme,
  moreInfoBtnTheme,
  signInBtnTheme,
  signInEnterTheme,
  whiteBtnTheme,
};
