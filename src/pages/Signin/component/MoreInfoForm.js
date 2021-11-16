import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { styled as styledMui } from "@mui/styles";

import { db_userInfo } from "../../../util/firebase";
import countryTrans from "../../../util/countryTrans";
import { signInEnterTheme } from "../../../util/muiTheme";

const MoreInfoFormDiv = styled.div`
  width: 400px;
  height: 100%;
  display: none; /* to-do */
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const MoreInfoFormTitleDiv = styled.div`
  font-size: 36px;
  font-weight: bold;
  line-height: 40px;
  padding: 0 30px;
  margin-top: 50px;
  color: #3a4a58;
`;
const MoreInfoFormArea = styled.div`
  background-color: white;
  width: 260px;
  height: 380px;
  overflow: scroll;
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 20px 20px;
  box-shadow: 4px 6px 10px rgb(80, 80, 80, 0.6);
  border-radius: 10px;
  /* box-shadow: 0px 0px 6px #000000; */
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  line-height: 28px;
  margin: 15px 0 5px;
  color: #3a4a58;
`;

const CountrySelect = styledMui(Select)({
  height: "30px",
  lineHeight: "12px",
});

const LanguageTextField = styledMui(TextField)({
  width: "100%",
  height: "36px",
});

const IntroductionTextField = styledMui(TextField)({
  width: "100%",
});

const BackDiv = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  left: 15px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    background-color: rgb(255, 255, 255, 0.2);
  }
`;

export default function MoreInfoForm({
  signinRef,
  signInFormRef,
  moreInfoFormRef,
  currentUser,
}) {
  const history = useHistory();
  const myUserId = useSelector((state) => state.myUserId);

  const [country, setCountry] = useState("TW");
  const [birthday, setBirthday] = useState(new Date());
  const [language, setLanguage] = useState("");
  const [introduction, setIntroduction] = useState("");

  function handleToWorldPage() {
    console.log(
      new Date(birthday.seconds * 1000).toDateString(),
      new Date().toDateString()
    );
    console.log(birthday, birthday.toDateString());

    db_userInfo
      .doc(myUserId)
      .set({
        id: myUserId,
        email: currentUser.email,
        name: currentUser.displayName,
        photo: currentUser.photoURL,
        country,
        language,
        introduction,
        birthday:
          birthday.toDateString() === new Date().toDateString()
            ? new Date(0)
            : birthday,
      })
      .then(() => {
        signinRef.current.style.display = "none";
        history.push({ pathname: "home" });
      });
  }

  function handleSetValue(event, key) {
    switch (key) {
      case "country":
        setCountry(event.target.value);
        break;
      case "language":
        setLanguage(event.target.value);
        break;
      case "introduction":
        setIntroduction(event.target.value);
        break;
      default:
        break;
    }
  }

  function handleBack() {
    signInFormRef.current.style.display = "flex";
    moreInfoFormRef.current.style.display = "none";
  }

  return (
    <MoreInfoFormDiv ref={moreInfoFormRef}>
      <MoreInfoFormTitleDiv>MORE ABOUT YOU</MoreInfoFormTitleDiv>
      <MoreInfoFormArea>
        <Title>
          <i className="fas fa-birthday-cake"></i>&ensp;Birthday
        </Title>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label=""
            value={birthday}
            onChange={(newValue) => {
              setBirthday(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
            inputProps={{
              style: { height: "6px" },
            }}
          />
        </LocalizationProvider>

        <Title>
          <i className="fas fa-globe"></i>&ensp;Country
        </Title>
        <FormControl fullWidth variant="filled">
          <InputLabel id="set-country-label"></InputLabel>
          <CountrySelect
            labelId="set-country-label"
            id="set-country-order"
            value={country}
            label="Country"
            onChange={(e) => {
              handleSetValue(e, "country");
            }}
          >
            {Object.entries(countryTrans)
              .filter((country) => country.country !== "AQ")
              .map((country, index) => (
                <MenuItem key={index} value={country[0]}>
                  {country[1].name_en}
                </MenuItem>
              ))}
          </CountrySelect>
        </FormControl>

        <Title>
          <i className="fas fa-globe"></i>&ensp;Language
        </Title>
        <LanguageTextField
          inputProps={{
            style: {
              height: 18,
              fontSize: 10,
            },
          }}
          size="small"
          placeholder="your language"
          variant="outlined"
          onChange={(e) => {
            handleSetValue(e, "language");
          }}
          // ref={input_ref}
        />
        <Title>
          <i className="fas fa-list-ul"></i>&ensp;Introduction
        </Title>
        <IntroductionTextField
          inputProps={{
            style: {
              fontSize: 10,
              height: 205,
            },
          }}
          size="small"
          placeholder="introduce yourself"
          variant="outlined"
          // ref={input_ref}
          multiline
          onChange={(e) => {
            handleSetValue(e, "introduction");
          }}
        />
      </MoreInfoFormArea>
      <ThemeProvider theme={signInEnterTheme}>
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: "100px",
            margin: "4px 0 24px",
            // border: `2px white solid`,
            // boxShadow: "1px 3px 10px rgb(80, 80, 80)",
            boxShadow: "4px 6px 10px rgb(80, 80, 80, 0.6)",
            color: "white",
            ":hover": {
              boxShadow: "2px 3px 10px rgb(80, 80, 80, 0.6)",
            },
          }}
          // style={{
          //   marginTop: "20px",
          //   borderRadius: "40px",
          //   lineHeight: 1.5,
          //   color: "#3A4A58",
          //   fontWeight: "bold",
          // }}
          onClick={handleToWorldPage}
        >
          enter
        </Button>
      </ThemeProvider>
      <BackDiv onClick={handleBack}>
        <i className="fas fa-arrow-left"></i>
      </BackDiv>
    </MoreInfoFormDiv>
  );
}
