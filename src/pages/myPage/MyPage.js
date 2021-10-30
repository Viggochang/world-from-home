import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";

import { db_userInfo } from "../../util/firebase";

import MyGallery from "./component/MyGallery";
import MyFriends from "./component/MyFriends";
import MoreInfo from "./component/MoreInfo";
import AlbumFriendBtns from "./component/AlbumFriendBtns";
import countryTrans from "../../util/countryTrans";

const myUerId = "yXtnB3CD0XAJDQ0Le51J";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
      font: "#ffffff",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
      font: "#3A4A58",
    },
  },
});

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
`;

const Mask = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgb(142, 142, 142, 0.6);
`;

const MyPageDiv = styled.div`
  /* position: fixed;
  top: 0;
  left: 0; */
  padding: 50px 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100vw - 160px);
`;

const UpperDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  position: relative;
`;

const MyPhoto = styled.div`
  width: 450px;
  height: 450px;
  box-shadow: 0px 0px 20px #000000;
  position: relative;
  color: white;
`;

const EditMyPhoto = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: rgb(0, 0, 0, 0.5);
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
`;

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 40px;
  max-width: calc(100vw - 704px);
  font-weight: bold;
  line-height: 1.15;
`;
const CountryDiv = styled.div`
  display: flex;
`;
const MyCountryDiv = styled.div`
  font-size: 120px;
  display: flex;
  align-items: baseline;
`;
const EditIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  display: none;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;
const TextFieldDiv = styled.div`
  align-self: center;
`;
const EditDiv = styled.div`
  display: none;
  align-items: flex-end;
  height: 138px;
`;
const Submit = styled.div`
  font-size: 24px;
  cursor: pointer;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;
const Cancel = styled.div`
  font-size: 24px;
  cursor: pointer;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;

const ButtonsDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  font-size: 48px;
  position: fixed;
  top: 50px;
  right: 80px;
`;

const HomeLink = styled(NavLink)`
  color: white;
  :hover{
    color: #3A4A58;
  }
`;
const SettingLink = styled(NavLink)`
  color: white;
  margin-top: 20px;
`;

const LowerDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  margin-top: 40px;
`;

const AlbumFriendBtnsDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function MyPage() {
  const editMyPhotoRef = useRef();
  const myCountryRef = useRef();
  const editMyCountryIconRef = useRef();
  const editRef = useRef();
  const countryInputRef = useRef();
  const moreAboutMeBtnRef = useRef();
  const moreInfoRef = useRef();
  const [activeButton, setActiveButton] = useState("Albums");
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const myInfo = useSelector((state) => state.userInfo);

  const { id, name, country, photo, birthday, background_photo } = myInfo;
  const age = birthday
    ? new Date().getFullYear() - new Date(1000 * birthday.seconds).getFullYear()
    : '';

  function handleShow(ref) {
    ref.current.style.display = "flex";
  }
  function handleDisappear(ref) {
    ref.current.style.display = "none";
  }

  function handleMoreInfo() {
    setShowMoreInfo(showMoreInfo ? false : true);
    if (!showMoreInfo) {
      handleShow(moreInfoRef);
    } else {
      handleDisappear(moreInfoRef);
    }
  }

  return (
    <>
      <Background
        style={{
          backgroundImage: `url(${background_photo})`,
          backgroundSize: "cover",
        }}
      >
        <Mask />
      </Background>
      <MyPageDiv>
        <UpperDiv>
          <MyPhoto
            style={{
              backgroundImage: `url(${photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onMouseEnter={() => handleShow(editMyPhotoRef)}
            onMouseLeave={() => handleDisappear(editMyPhotoRef)}
          >
            <EditMyPhoto ref={editMyPhotoRef}>
              <i className="fas fa-camera"></i>
            </EditMyPhoto>
          </MyPhoto>
          <UserInfoDiv>
            <div style={{ fontSize: 148 }}>{name}</div>
            <div style={{ fontSize: 36 }}>from</div>
            <CountryDiv
              onMouseEnter={() => handleShow(editMyCountryIconRef)}
              onMouseLeave={() => handleDisappear(editMyCountryIconRef)}
            >
              <MyCountryDiv ref={myCountryRef}>
                {country ? countryTrans[country].name_en : ''}
                <EditIcon
                  ref={editMyCountryIconRef}
                  onClick={() => {
                    handleShow(editRef);
                    handleDisappear(myCountryRef);
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </EditIcon>
              </MyCountryDiv>
              <EditDiv ref={editRef}>
                <TextFieldDiv>
                  <TextField
                    inputProps={{
                      style: { width: 300, height: 60, fontSize: 50 },
                    }}
                    label="Edit country"
                    placeholder={country}
                    variant="outlined"
                    ref={countryInputRef}
                  />
                </TextFieldDiv>
                <Submit
                  onClick={() => {
                    db_userInfo
                      .doc(myUerId)
                      .update({
                        country:
                          countryInputRef.current.children[1].children[0].value,
                      })
                      .then(() => {
                        handleShow(myCountryRef);
                        handleDisappear(editRef);
                      });
                  }}
                >
                  <i className="fas fa-check-circle" />
                </Submit>
                <Cancel
                  onClick={() => {
                    handleDisappear(editRef);
                    handleShow(myCountryRef);
                  }}
                >
                  <i className="fas fa-times-circle" />
                </Cancel>
              </EditDiv>
            </CountryDiv>
            <div
              style={{ fontSize: 36, marginBottom: "24px" }}
            >{`age: ${age}`}</div>
            <ThemeProvider theme={theme}>
              <Button
                onClick={() => {
                  handleMoreInfo();
                }}
                variant="contained"
                color={showMoreInfo ? "primary" : "white"}
                // color={activeButton === "Friends" ? "primary" : "white"}
                style={{
                  width: "220px",
                  fontSize: "16px",
                  borderRadius: "40px",
                  lineHeight: 1.5,
                  fontWeight: "bold",
                  color: showMoreInfo ? "white" : "#3A4A58",
                }}
              >
                More about Me
              </Button>
            </ThemeProvider>
          </UserInfoDiv>
          <MoreInfo
            innerRef={moreInfoRef}
            handleMoreInfo={handleMoreInfo}
            handleShow={handleShow}
            handleDisappear={handleDisappear}
          ></MoreInfo>
          <ButtonsDiv>
            <HomeLink to="home">
              <i className="fas fa-home"></i>
            </HomeLink>
            <SettingLink to="setting">
              <i className="fas fa-cog"></i>
            </SettingLink>
          </ButtonsDiv>
        </UpperDiv>
        <LowerDiv>
          <AlbumFriendBtns activeButton={activeButton} setActiveButton={setActiveButton} />
          {activeButton === "Albums" ? (
            <MyGallery title={"My Albums"} id={id} />
          ) : (
            <MyFriends title={"My Friends"} userInfo={myInfo} mypage={true} />
          )}
        </LowerDiv>
      </MyPageDiv>
    </>
  );
}
