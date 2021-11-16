import React, { useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import InputBase from "@mui/material/InputBase";

import styled from "styled-components";
import "./input.css";

import { db_userInfo } from "../../../../util/firebase";
const myUerId = "yXtnB3CD0XAJDQ0Le51J";

const MoreInfoDiv = styled.div`
  width: 320px;
  height: auto;
  background-color: rgb(255, 255, 255, 0.7);
  box-shadow: 3px 2px 15px #5b5b5b;
  z-index: 2;
  display: none;
  position: absolute;
  top: 0;
  right: 80px;
  padding: 30px 30px 0;
  flex-direction: column;
  align-items: flex-start;
  font-weight: 400;
`;

const CloseDiv = styled.div`
  color: #9d9d9d;
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 26px;
  cursor: pointer;
  :hover {
    color: #3a4a58;
  }
`;

const TitleDiv = styled.div`
  display: flex;
  align-items: baseline;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  line-height: 28px;
  color: #3a4a58;
  margin-bottom: 3px;
`;

const InfoDiv = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const InfoIcon = styled.div`
  width: 50px;
  height: 50px;
  font-size: 20px;
  border-radius: 50%;
  background-color: #3a4a58;
  color: white;
  margin: 5.5px 20px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoText = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100% - 70px);
`;

const InfoTextDiv = styled.div`
  font-size: 20px;
  color: #5b5b5b;
  line-height: 34px;
`;

const EditIcon = styled.div`
  color: rgb(102, 116, 132, 0.9);
  cursor: pointer;
  display: none;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;

const EditDiv = styled.div`
  display: none;
  align-items: flex-end;
`;

const Submit = styled.div`
  margin-bottom: 9px;
  cursor: pointer;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;
const Cancel = styled.div`
  margin-bottom: 9px;
  cursor: pointer;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;

const IntroductionDiv = styled.div`
  width: 100%;
  height: 114px;
  color: #5b5b5b;
  overflow: scroll;
  padding-left: 5px;
  font-size: 20px;
  line-height: 30px;
`;

export default function MoreInfo({ innerRef, handleMoreInfo, userInfo }) {
  const languageInfoRef = useRef();
  const birthdayInfoRef = useRef();
  const introductionInfoRef = useRef();
  const languageEditIconRef = useRef();
  const birthdayEditIconRef = useRef();
  const introductionEditIconRef = useRef();
  const languageEditRef = useRef();
  const birthdayEditRef = useRef();
  const introductionEditRef = useRef();
  const languageInputRef = useRef();
  const birthdayInputRef = useRef();
  const introductionInputRef = useRef();
  const [birthday, setBirthday] = useState(
    userInfo.birthday ? new Date(userInfo.birthday.seconds * 1000) : undefined
  );

  const { email, language, introduction, birthday: birthdayData } = userInfo;
  const birthdayDate =
    birthdayData && new Date(birthdayData.seconds * 1000).toDateString();

  const birthdayFormat =
    birthdayData && birthdayDate !== new Date(0).toDateString()
      ? birthdayDate.slice(4)
      : "";
  const infoData = [
    {
      icon: <i className="fas fa-globe"></i>,
      title: "Language",
      info_data: language || "unknown",
      info_ref: languageInfoRef,
      edit_icon_ref: languageEditIconRef,
      edit_ref: languageEditRef,
      input_ref: languageInputRef,
    },
    {
      icon: <i className="fas fa-birthday-cake"></i>,
      title: "Birthday",
      info_data: birthdayFormat || "unknown",
      info_ref: birthdayInfoRef,
      edit_icon_ref: birthdayEditIconRef,
      edit_ref: birthdayEditRef,
      input_ref: birthdayInputRef,
    },
    {
      icon: <i className="fas fa-smile"></i>,
      title: "Introduction",
      info_data: introduction || "",
      info_ref: introductionInfoRef,
      edit_icon_ref: introductionEditIconRef,
      edit_ref: introductionEditRef,
      input_ref: introductionInputRef,
    },
  ];

  function handleCloseMoreInfo() {
    innerRef.current.style.display = "none";
  }

  function handleUpdateDate(title, input_ref, info_ref, edit_ref) {
    const updateData = {};
    updateData[title.toLowerCase()] =
      title === "Birthday"
        ? birthday
        : input_ref.current.children[1].children[0].value;
    db_userInfo
      .doc(myUerId)
      .update(updateData)
      .then(() => {
        handleShow(info_ref);
        handleDisappear(edit_ref);
      });
  }

  function handleShow(ref) {
    ref.current.style.display = "flex";
  }
  function handleDisappear(ref) {
    ref.current.style.display = "none";
  }

  return (
    <MoreInfoDiv ref={innerRef}>
      <CloseDiv
        onClick={() => {
          handleCloseMoreInfo();
          handleMoreInfo();
          infoData.forEach(({ edit_ref, info_ref }) => {
            handleDisappear(edit_ref);
            handleShow(info_ref);
          });
        }}
      >
        <i className="fas fa-times-circle"></i>
      </CloseDiv>

      <InfoDiv>
        <InfoIcon>
          <i className="fas fa-envelope"></i>
        </InfoIcon>
        <InfoText>
          <Title>Email</Title>
          <InfoTextDiv>{email}</InfoTextDiv>
        </InfoText>
      </InfoDiv>

      {infoData.map((info, index) => {
        const {
          icon,
          title,
          info_data,
          info_ref,
          edit_icon_ref,
          edit_ref,
          input_ref,
        } = info;
        return (
          <InfoDiv
            key={index}
            onMouseEnter={() => handleShow(edit_icon_ref)}
            onMouseLeave={() => handleDisappear(edit_icon_ref)}
          >
            <InfoIcon>{icon}</InfoIcon>
            <InfoText>
              <TitleDiv>
                <Title>{title}</Title>
                <EditIcon
                  ref={edit_icon_ref}
                  onClick={() => {
                    handleShow(edit_ref);
                    handleDisappear(info_ref);
                    infoData
                      .filter((data) => data.title !== title)
                      .forEach((data) => {
                        handleDisappear(data.edit_ref);
                        handleShow(data.info_ref);
                      });
                  }}
                >
                  <i className="fas fa-pencil-alt"></i>
                </EditIcon>
              </TitleDiv>
              <div>
                {/* <InfoDiv ref={info_ref}> */}
                {title === "Introduction" ? (
                  <IntroductionDiv ref={info_ref}>{info_data}</IntroductionDiv>
                ) : (
                  <InfoTextDiv ref={info_ref}>{info_data}</InfoTextDiv>
                )}
                {/* </InfoDiv> */}

                <EditDiv ref={edit_ref}>
                  {/* <TextFieldDiv> */}
                  {title === "Birthday" ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        // label="Birthday"
                        value={birthday}
                        onChange={(newValue) => {
                          setBirthday(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        inputProps={{
                          style: { height: "1px" },
                          color: "#3a4a58",
                          outline: "1px rgb(58, 74, 88, 0.5) solid",
                        }}
                      />
                    </LocalizationProvider>
                  ) : (
                    //<ThemeProvider theme={primaryPaletteTheme}>
                    <InputBase
                      inputProps={{
                        style: {
                          height: title === "Introduction" ? 104 : 24,
                          fontSize: 16,
                          outline: "1px rgb(58, 74, 88, 0.5) solid",
                          padding: "4px 10px 0",
                          backgroundColor: "rgb(255, 255, 255, 0.4)",
                          borderRadius: "4px",
                        },
                      }}
                      // label={`Edit ${title}`}
                      size="small"
                      placeholder={info_data}
                      variant="outlined"
                      ref={input_ref}
                      multiline
                    />
                    //</ThemeProvider>
                  )}
                  {/* </TextFieldDiv> */}

                  <Submit
                    onClick={() => {
                      handleUpdateDate(title, input_ref, info_ref, edit_ref);
                      handleDisappear(edit_ref);
                      handleShow(info_ref);
                    }}
                  >
                    <i className="fas fa-check-circle" />
                  </Submit>
                  <Cancel
                    onClick={() => {
                      handleDisappear(edit_ref);
                      handleShow(info_ref);
                    }}
                  >
                    <i className="fas fa-times-circle" />
                  </Cancel>
                </EditDiv>
              </div>
            </InfoText>
          </InfoDiv>
        );
      })}
    </MoreInfoDiv>
  );
}

// <TitleDiv>Email</TitleDiv>
// <InfoDiv
//   onMouseEnter={() => handleShow(editMyCountryIconRef)}
//   onMouseLeave={() => handleDisappear(editMyCountryIconRef)}
//   >
//   <MyInfoDiv ref={myCountryRef}>
//     <div style={{ fontSize: 120 }}>{country}</div>
//     <EditIcon
//       ref={editMyCountryIconRef}
//       onClick={() => {
//         handleShow(editRef);
//         handleDisappear(myCountryRef);
//       }}
//     >
//       <i className="fas fa-pencil-alt"></i>
//     </EditIcon>
//   </MyInfoDiv>
//   <EditDiv ref={editRef}>
//     <TextFieldDiv>
//       <TextField
//         inputProps={{
//           style: { width: 300, height: 60, fontSize: 50 },
//         }}
//         label="Edit country"
//         placeholder={country}
//         variant="outlined"
//         ref={countryInputRef}
//       />
//     </TextFieldDiv>
//     <Submit onClick={() => {
//       handleDisappear(editRef);
//       handleShow(myCountryRef);
//       console.log(countryInputRef.current.children[1].children[0].value);
//     }}>
//       <i className="fas fa-check-circle" />
//     </Submit>
//     <Cancel onClick={() => {
//       handleDisappear(editRef);
//       handleShow(myCountryRef);
//     }}>
//       <i className="fas fa-times-circle" />
//     </Cancel>
//   </EditDiv>
// </InfoDiv>
