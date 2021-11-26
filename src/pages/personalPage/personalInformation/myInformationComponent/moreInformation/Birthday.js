import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";

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

const allInfo = ["language", "birthday", "introduction"];
export default function Birthday({
  handleShow,
  handleDisappear,
  handleUpdateData,
  editRef,
  infoRef,
}) {
  const myInfo = useSelector((state) => state.userInfo);
  const edit_icon_ref = useRef();
  const [birthday, setBirthday] = useState(
    myInfo.birthday ? new Date(myInfo.birthday.seconds * 1000) : undefined
  ); //to-do

  const { birthday: birthdayData } = myInfo;
  const birthdayDate =
    birthdayData && new Date(birthdayData.seconds * 1000).toDateString();

  const birthdayFormat =
    birthdayData && birthdayDate !== new Date(0).toDateString()
      ? birthdayDate.slice(4)
      : "";

  return (
    <InfoDiv
      onMouseEnter={() => handleShow(edit_icon_ref.current)}
      onMouseLeave={() => handleDisappear(edit_icon_ref.current)}
    >
      <InfoIcon>
        <i className="fas fa-birthday-cake" />
      </InfoIcon>
      <InfoText>
        <TitleDiv>
          <Title>Birthday</Title>
          <EditIcon
            ref={edit_icon_ref}
            onClick={() => {
              handleShow(editRef.current["birthday"]);
              handleDisappear(infoRef.current["birthday"]);
              allInfo
                .filter((data) => data !== "birthday")
                .forEach((data) => {
                  handleDisappear(editRef.current[data]);
                  handleShow(infoRef.current[data]);
                });
            }}
          >
            <i className="fas fa-pencil-alt" />
          </EditIcon>
        </TitleDiv>
        <InfoTextDiv ref={(el) => (infoRef.current["birthday"] = el)}>
          {birthdayFormat}
        </InfoTextDiv>
        <EditDiv ref={(el) => (editRef.current["birthday"] = el)}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
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
          <Submit
            onClick={() => {
              handleUpdateData(
                { birthday },
                infoRef.current["birthday"],
                editRef.current["birthday"]
              );
            }}
          >
            <i className="fas fa-check-circle" />
          </Submit>
          <Cancel
            onClick={() => {
              handleDisappear(editRef.current["birthday"]);
              handleShow(infoRef.current["birthday"]);
            }}
          >
            <i className="fas fa-times-circle" />
          </Cancel>
        </EditDiv>
      </InfoText>
    </InfoDiv>
  );
}
