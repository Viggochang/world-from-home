import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import styled from "styled-components";

import { db_userInfo } from "../../../util/firebase";
const myUerId = "yXtnB3CD0XAJDQ0Le51J";

const MoreInfoDiv = styled.div`
  color: white;
  width: 320px;
  height: auto;
  background-color: rgb(255, 255, 255, 0.7);
  box-shadow: 0px 0px 20px #4f4f4f;
  z-index: 2;
  display: none;
  position: absolute;
  right: 90px;
  padding: 30px;
  flex-direction: column;
  align-items: flex-start;
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
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  padding: 0 12px;
  border-radius: 14px;
  background-color: #3a4a58;
  margin-bottom: 10px;
`;

const InfoDiv = styled.div`
  display: flex;
  align-items: baseline;
`;

const InfoTextDiv = styled.div`
  font-size: 20px;
  margin-bottom: 20px;
  color: #3a4a58;
  padding-left: 5px;
`;

const EditIcon = styled.div`
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
  /* height: 138px; */
`;

const TextFieldDiv = styled.div`
  margin-bottom: 9px;
`;

const Submit = styled.div`
  cursor: pointer;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;
const Cancel = styled.div`
  cursor: pointer;
  margin-left: 10px;
  :hover {
    color: #3a4a58;
  }
`;

const IntroductionDiv = styled.div`
  width: 100%;
  height: 89px;
  color: #3a4a58;
  overflow: scroll;
  padding-left: 5px;
  font-size: 20px;
  line-height: 30px;
`;

export default function MoreInfo({
  innerRef,
  handleMoreInfo,
  handleShow,
  handleDisappear,
}) {
  const userInfo = useSelector((state) => state.userInfo);
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
    new Date(userInfo.birthday.seconds * 1000)
  );

  const { email, language, introduction } = userInfo;
  const birthdayFormat = userInfo.birthday
    ? new Date(userInfo.birthday.seconds * 1000).toDateString().slice(4)
    : "";
  const infoData = [
    {
      title: "Language",
      info_data: language,
      info_ref: languageInfoRef,
      edit_icon_ref: languageEditIconRef,
      edit_ref: languageEditRef,
      input_ref: languageInputRef,
    },
    {
      title: "Birthday",
      info_data: birthdayFormat,
      info_ref: birthdayInfoRef,
      edit_icon_ref: birthdayEditIconRef,
      edit_ref: birthdayEditRef,
      input_ref: birthdayInputRef,
    },
    {
      title: "Introduction",
      info_data: introduction,
      info_ref: introductionInfoRef,
      edit_icon_ref: introductionEditIconRef,
      edit_ref: introductionEditRef,
      input_ref: introductionInputRef,
    },
  ];

  function handleCloseMoreInfo() {
    innerRef.current.style.display = "none";
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

      <Title>Email</Title>
      <InfoTextDiv>{email}</InfoTextDiv>

      {infoData.map((info, index) => {
        const {
          title,
          info_data,
          info_ref,
          edit_icon_ref,
          edit_ref,
          input_ref,
        } = info;
        return (
          <div
            key={index}
            onMouseEnter={() => handleShow(edit_icon_ref)}
            onMouseLeave={() => handleDisappear(edit_icon_ref)}
          >
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
              <InfoDiv ref={info_ref}>
                {title === "Introduction" ? (
                  <IntroductionDiv>{info_data}</IntroductionDiv>
                ) : (
                  <InfoTextDiv>{info_data}</InfoTextDiv>
                )}
              </InfoDiv>
              <EditDiv ref={edit_ref}>
                <TextFieldDiv>
                  {title === "Birthday" ? (
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="Birthday"
                        value={birthday}
                        onChange={(newValue) => {
                          setBirthday(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                        inputProps={{
                          style: { height: "1px" },
                        }}
                      />
                    </LocalizationProvider>
                  ) : (
                    <TextField
                      inputProps={{
                        style: {
                          width: 200,
                          height: title === "Introduction" ? 83 : 17,
                          fontSize: 10,
                        },
                      }}
                      label={`Edit ${title}`}
                      size="small"
                      placeholder={info_data}
                      variant="outlined"
                      ref={input_ref}
                      multiline
                    />
                  )}
                </TextFieldDiv>
                <Submit
                  onClick={() => {
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

                    handleDisappear(edit_ref);
                    handleShow(info_ref);
                    // console.log(
                    //   input_ref.current.children[1].children[0].value
                    // );
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
          </div>
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
