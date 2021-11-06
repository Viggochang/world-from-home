import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import Compressor from "compressorjs";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { styled as styledMui } from "@mui/styles";

import { storage, db_userInfo } from "../../util/firebase";

import MyGallery from "./component/MyGallery";
import MyFriends from "./component/MyFriends";
import MoreInfo from "./component/MoreInfo";
import AlbumFriendBtns from "./component/AlbumFriendBtns";
import countryTrans from "../../util/countryTrans";
import Album from "../album/Album";

// const myUerId = "yXtnB3CD0XAJDQ0Le51J";

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
  background-color: rgb(0, 0, 0, 0.7);
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
`;
const EditBackgroundImage = styled.div`
  position: absolute;
  top: 0px;
  right: 90px;
  display: flex;
  align-items: center;
  outline: 1px white solid;
  border-radius: 20px;
  padding-right: 12px;
  color: white;
  cursor: pointer;
  :hover {
    background-color: #3a4a58;
  }
`;

const Input = styledMui("input")({
  display: "none",
});

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

const EditDiv = styled.div`
  display: none;
  align-items: center;
  height: 138px;
`;
const SearchDiv = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 20px;
  background-color: rgb(255, 255, 255, 0.3);
`;
const TextFieldDiv = styled.div`
  margin-left: 20px;
  align-self: center;
`;
const Inputdiv = styled.input`
  width: 240px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: white;
    font-size: 20px;
  }
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
  :hover {
    color: #3a4a58;
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
  const editCountryRef = useRef();
  const countryInputRef = useRef();
  const moreAboutMeBtnRef = useRef();
  const moreInfoRef = useRef();
  const [activeButton, setActiveButton] = useState("Albums");
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const myUserId = useSelector((state) => state.myUserId);
  const myInfo = useSelector((state) => state.userInfo);
  const defaultBackground =
    "https://firebasestorage.googleapis.com/v0/b/world-from-home.appspot.com/o/user_background_photo%2Fdefault-background.jpg?alt=media&token=17d3a90e-1f80-45c2-9b1d-e641d7ee0b88";

  const { id, name, country, photo, birthday, background_photo } = myInfo;
  const age =
    birthday &&
    new Date(birthday.seconds * 1000).toDateString() !==
      new Date(0).toDateString()
      ? new Date().getFullYear() -
        new Date(1000 * birthday.seconds).getFullYear()
      : "unknown";

  const [country2id, setCountry2id] = useState({});
  useEffect(() => {
    const country2id = Object.entries(countryTrans).reduce(
      (acc, [key, { name_en }]) => {
        acc[name_en] = key;
        return acc;
      },
      {}
    );
    setCountry2id(country2id);
  }, []);

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

  function handleSubmitCountry() {
    if (country2id[countryInputRef.current.value]) {
      db_userInfo
        .doc(myUserId)
        .update({
          country: country2id[countryInputRef.current.value],
        })
        .then(() => {
          handleShow(myCountryRef);
          handleDisappear(editCountryRef);
        });
    } else {
      countryInputRef.current.parentNode.parentNode.style.outline =
        "4px #AE0000 solid";
    }
  }

  function handleUploadPhoto(event, key) {
    const img = event.target.files[0];

    new Compressor(img, {
      quality: 0.6,
      success(result) {
        // Send the compressed image file to server with XMLHttpRequest.
        const metadata = { contentType: result.type };
        const storageRef = storage.ref(`user_${key}/${id}`);
        storageRef.put(result, metadata).then(() => {
          storageRef.getDownloadURL().then((imageUrl) => {
            console.log(imageUrl);
            let photoObj = {};
            photoObj[key] = imageUrl;
            db_userInfo.doc(id).update(photoObj);
          });
        });
      },
      error(err) {
        console.log(err.message);
      },
    });
  }

  return (
    <>
      <Background
        style={{
          backgroundImage: background_photo
            ? `url(${background_photo})`
            : `url(${defaultBackground})`,
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
            <label htmlFor="my-photo">
              <EditMyPhoto ref={editMyPhotoRef}>
                <Input
                  accept="image/*"
                  id="my-photo"
                  type="file"
                  onChange={(e) => handleUploadPhoto(e, "photo")}
                />
                <ThemeProvider theme={theme}>
                  <IconButton
                    color="white"
                    aria-label="upload picture"
                    component="span"
                    size="large"
                  >
                    <PhotoCamera />
                  </IconButton>
                </ThemeProvider>
              </EditMyPhoto>
            </label>
          </MyPhoto>
          <label htmlFor="background-photo">
            <EditBackgroundImage>
              <Input
                accept="image/*"
                id="background-photo"
                type="file"
                onChange={(e) => handleUploadPhoto(e, "background_photo")}
              />
              <ThemeProvider theme={theme}>
                <IconButton
                  color="white"
                  aria-label="upload picture"
                  component="span"
                  size="large"
                >
                  <PhotoCamera />
                </IconButton>
              </ThemeProvider>
              <div>
                change
                <br />
                background
              </div>
            </EditBackgroundImage>
          </label>
          <UserInfoDiv>
            <div style={{ fontSize: 148 }}>{name}</div>
            <div style={{ fontSize: 36 }}>from</div>
            <CountryDiv
              onMouseEnter={() => handleShow(editMyCountryIconRef)}
              onMouseLeave={() => handleDisappear(editMyCountryIconRef)}
            >
              <MyCountryDiv ref={myCountryRef}>
                {country ? countryTrans[country].name_en : ""}
                <EditIcon
                  ref={editMyCountryIconRef}
                  onClick={() => {
                    handleShow(editCountryRef);
                    handleDisappear(myCountryRef);
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </EditIcon>
              </MyCountryDiv>
              <EditDiv ref={editCountryRef}>
                <SearchDiv>
                  <i className="fas fa-search"></i>
                  <TextFieldDiv>
                    <Inputdiv
                      list="country-choice"
                      id="search-country"
                      name="search-country"
                      placeholder="Choose your country"
                      style={{
                        border: "none",
                        background: "none",
                        color: "white",
                        fontSize: "20px",
                      }}
                      ref={countryInputRef}
                      onChange={(e) => {
                        e.target.parentNode.parentNode.style.outline = "none";
                      }}
                    />
                    <datalist id="country-choice">
                      {Object.values(countryTrans)
                        .filter((country) => country.country !== "AQ")
                        .map((country) => (
                          <option
                            key={country.country}
                            value={country.name_en}
                          />
                        ))}
                    </datalist>
                    {/* <TextField
                    inputProps={{
                      style: { width: 300, height: 60, fontSize: 50 },
                    }}
                    label="Edit country"
                    placeholder={country}
                    variant="outlined"
                    ref={countryInputRef}
                  /> */}
                  </TextFieldDiv>
                </SearchDiv>
                <Submit onClick={handleSubmitCountry}>
                  <i className="fas fa-check-circle" />
                </Submit>
                <Cancel
                  onClick={() => {
                    handleDisappear(editCountryRef);
                    handleShow(myCountryRef);
                    countryInputRef.current.parentNode.parentNode.style.outline =
                      "none";
                    countryInputRef.current.value = "";
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
                  outline: showMoreInfo
                    ? "3px white solid"
                    : "3px #3A4A58 solid",
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
            {/* <SettingLink to="setting">
              <i className="fas fa-cog"></i>
            </SettingLink> */}
          </ButtonsDiv>
        </UpperDiv>
        <LowerDiv>
          <AlbumFriendBtns
            activeButton={activeButton}
            setActiveButton={setActiveButton}
          />
          {activeButton === "Albums" ? (
            <MyGallery title={"My Albums"} id={id} />
          ) : (
            <MyFriends title={"My Friends"} userInfo={myInfo} isMyPage={true} />
          )}
        </LowerDiv>
      </MyPageDiv>
      <Album />
    </>
  );
}
