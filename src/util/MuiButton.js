import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core/styles";
import { whiteBtnTheme, moreInfoBtnTheme } from "./muiTheme";

function WelcomePageBtn({ content, onClick }) {
  const btnStyle = {
    width: "200px",
    fontSize: "24px",
    fontWeight: "bold",
    borderRadius: "40px",
    lineHeight: 1.5,
    margin: "0 20px",
    color: "#3A4A58",
    boxShadow: "3px 3px 10px 5px rgb(80, 80, 80, 0.7)",
    ":hover": {
      backgroundColor: "#e0e0e0",
    },
  };
  return (
    <ThemeProvider theme={whiteBtnTheme}>
      <Button variant="contained" color="white" sx={btnStyle} onClick={onClick}>
        {content}
      </Button>
    </ThemeProvider>
  );
}

function MoreInformationBtn({ showMoreInfo, onClick }) {
  const btnStyle = {
    width: "220px",
    fontSize: "16px",
    borderRadius: "40px",
    lineHeight: 1.4,
    fontWeight: "bold",
    color: showMoreInfo ? "white" : "#3A4A58",
    border: showMoreInfo ? "2px white solid" : "2px #3A4A58 solid",
    boxShadow: "3px 3px 10px rgb(80, 80, 80, 0.7)",
    ":hover": {
      boxShadow: "3px 3px 5px rgb(80, 80, 80, 0.7)",
      backgroundColor: showMoreInfo ? "rgb(40, 51, 61)" : "#e0e0e0",
    },
  };
  return (
    <ThemeProvider theme={moreInfoBtnTheme}>
      <Button
        onClick={onClick}
        variant="contained"
        color={showMoreInfo ? "primary" : "secondary"}
        sx={btnStyle}
      >
        More about Me
      </Button>
    </ThemeProvider>
  );
}

function FriendAcceptRemoveBtn({ content, ref, callback }) {
  const color = content === "accept" ? "#006000" : "#AE0000";
  const btnStyle = {
    outline: `1px	${color} solid`,
    color: color,
    padding: "0 10px",
    borderRadius: "20px",
    marginRight: "15px",
    fontSize: "12px",
    "&:hover": {
      backgroundColor: color,
      color: "white",
    },
  };
  return (
    <Button ref={ref} onClick={callback} sx={btnStyle}>
      {content}
    </Button>
  );
}

export { WelcomePageBtn, MoreInformationBtn, FriendAcceptRemoveBtn };
