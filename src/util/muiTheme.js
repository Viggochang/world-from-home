import { createTheme } from "@material-ui/core/styles";

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
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
  },
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
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    secondary: {
      main: "#ffffff",
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

export { albumFriendBtnTheme, changeBackgroundBtnTheme, moreInfoBtnTheme };
