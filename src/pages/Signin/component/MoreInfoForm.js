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

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
    },
  },
});

const MoreInfoFormDiv = styled.div`
  width: 400px;
  height: 100%;
  display: none; /* to-do */
  flex-direction: column;
  align-items: center;
`;
const MoreInfoFormTitleDiv = styled.div`
  font-size: 20px;
  font-weight: bold;
  line-height: 40px;
  border-radius: 20px;
  background-color: white;
  padding: 0 30px;
  margin-top: 80px;
`;
const MoreInfoFormArea = styled.div`
  background-color: white;
  width: 220px;
  height: 260px;
  overflow: scroll;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 10px 20px 20px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  line-height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  background-color: #3a4a58;
  margin: 10px 0;
  color: white;
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

export default function MoreInfoForm({ moreInfoFormRef }) {
  const history = useHistory();
  const myUserId = useSelector((state) => state.myUserId);

  const [country, setCountry] = useState("TW");
  const [birthday, setBirthday] = useState();
  const [language, setLanguage] = useState("");
  const [introduction, setIntroduction] = useState("");

  function handleToWorldPage() {
    db_userInfo
      .doc(myUserId)
      .update({ country, birthday, language, introduction })
      .then(() => {
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

  return (
    <MoreInfoFormDiv ref={moreInfoFormRef}>
      <MoreInfoFormTitleDiv>MORE ABOUT YOU</MoreInfoFormTitleDiv>
      <MoreInfoFormArea>
        <Title>Birthday</Title>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Birthday"
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

        <Title>Country</Title>
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
              .map((country) => {
                return (
                  <MenuItem value={country[0]}>{country[1].name_en}</MenuItem>
                );
              })}
          </CountrySelect>
        </FormControl>

        <Title>Language</Title>
        <LanguageTextField
          inputProps={{
            style: {
              height: 18,
              fontSize: 10,
            },
          }}
          label="set your language"
          size="small"
          placeholder="your language"
          variant="outlined"
          onChange={(e) => {
            handleSetValue(e, "language");
          }}
          // ref={input_ref}
        />
        <Title>Introduction</Title>
        <IntroductionTextField
          inputProps={{
            style: {
              fontSize: 10,
              height: 205,
            },
          }}
          label="introduce yourself"
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
      <div>
        <ThemeProvider theme={theme}>
          <Button
            variant="contained"
            color="white"
            style={{
              marginTop: "30px",
              borderRadius: "40px",
              lineHeight: 1.5,
            }}
            onClick={handleToWorldPage}
          >
            enter
          </Button>
        </ThemeProvider>
      </div>
    </MoreInfoFormDiv>
  );
}
