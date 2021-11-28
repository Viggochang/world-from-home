import Button from "@material-ui/core/Button";
import { ThemeProvider } from "@material-ui/core/styles";
import {
  primaryPaletteTheme,
  whiteBtnTheme,
  signInEnterTheme,
  moreInfoBtnTheme,
  albumFriendBtnTheme,
  signInBtnTheme,
  changeBackgroundBtnTheme,
} from "./muiTheme";
import styled from "styled-components";

function SigninEnterBtn({ onClick }) {
  const btnStyle = {
    width: "100px",
    margin: "4px 0 24px",
    boxShadow: "4px 6px 10px rgb(80, 80, 80, 0.6)",
    color: "white",
    ":hover": {
      boxShadow: "2px 3px 10px rgb(80, 80, 80, 0.6)",
    },
  };
  return (
    <ThemeProvider theme={signInEnterTheme}>
      <Button
        variant="contained"
        color="primary"
        sx={btnStyle}
        onClick={onClick}
      >
        enter
      </Button>
    </ThemeProvider>
  );
}

function SigninMediaBtn({ content, onClick }) {
  const mediaIcon = {
    Google: <i className="fab fa-google" />,
    Facebook: <i className="fab fa-facebook" />,
  };

  const SignInBtnStyle = {
    width: "100%",
    marginBottom: "20px",
    boxShadow: "2px 3px 6px rgb(80, 80, 80, 0.7)",
  };

  return (
    <ThemeProvider theme={signInBtnTheme}>
      <Button
        variant="contained"
        color="primary"
        sx={SignInBtnStyle}
        onClick={onClick}
      >
        {mediaIcon[content]} &emsp;&emsp; Sign in with&ensp;
        {content}
      </Button>
    </ThemeProvider>
  );
}

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

function AlbumFriendBtn({ content, activeButton, onClick }) {
  const btnStyle = {
    width: "190px",
    margin: "4px 0 24px",
    border: `2px #ffffff solid`,
    color: "#ffffff",
    boxShadow: "4px 6px 10px rgb(50, 50, 50, 0.7)",
    ":hover": {
      boxShadow: "4px 6px 5px rgb(50, 50, 50, 0.7)",
    },
  };

  return (
    <ThemeProvider theme={albumFriendBtnTheme}>
      <Button
        variant="contained"
        sx={btnStyle}
        color={activeButton === content ? "primary" : "secondary"}
        onClick={onClick}
      >
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

function FriendAcceptRemoveBtn({ content, innerRef, onClick }) {
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
    <Button ref={innerRef} onClick={onClick} sx={btnStyle}>
      {content}
    </Button>
  );
}

function AlbumQuestionBtn({ content, onClick }) {
  const btnStyle = {
    width: "200px",
    fontSize: "20px",
    fontWeight: "bold",
    borderRadius: "40px",
    lineHeight: 1.5,
    margin: "0 15px",
    color: "#667484",
    boxShadow: "4px 6px 10px rgb(80, 80, 80, 0.4)",
    ":hover": {
      backgroundColor: "rgb(255, 255, 255, 0.8)",
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

function AddAlbumBtn({ onClick, fontSize }) {
  const btnStyle = {
    margin: "auto",
    lineHeight: 1.5,
    fontSize: fontSize,
  };
  return (
    <ThemeProvider theme={primaryPaletteTheme}>
      <Button
        variant="outlined"
        color="primary"
        onClick={onClick}
        style={btnStyle}
      >
        +&emsp; add my album
      </Button>
    </ThemeProvider>
  );
}

function EditBtn({ content, onClick, innerRef }) {
  const BtnStyle = {
    boxShadow: "2px 3px 6px rgb(80, 80, 80, 0.7)",
    marginRight: "10px",
  };
  return (
    <ThemeProvider theme={signInBtnTheme}>
      <Button
        variant="contained"
        color="primary"
        sx={BtnStyle}
        onClick={onClick}
        ref={innerRef}
      >
        {content}
      </Button>
    </ThemeProvider>
  );
}

function ChangeBackgroundBtn() {
  const CameraIcon = styled.div`
    font-size: 18px;
    margin-right: 10px;
  `;
  const btnStyle = {
    outline: `1px #ffffff solid`,
    color: "#ffffff",
    textAlign: "left",
    padding: "5px 15px",
  };
  return (
    <ThemeProvider theme={changeBackgroundBtnTheme}>
      <Button variant="outlined" component="span" sx={btnStyle} color="primary">
        <CameraIcon>
          <i className="fas fa-camera" />
        </CameraIcon>
        <div>
          change
          <br />
          background
        </div>
      </Button>
    </ThemeProvider>
  );
}

export {
  SigninEnterBtn,
  SigninMediaBtn,
  WelcomePageBtn,
  AlbumFriendBtn,
  MoreInformationBtn,
  FriendAcceptRemoveBtn,
  AlbumQuestionBtn,
  AddAlbumBtn,
  EditBtn,
  ChangeBackgroundBtn,
};
