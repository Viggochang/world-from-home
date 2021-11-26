import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import InputBase from "@mui/material/InputBase";

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
export default function Language({
  handleShow,
  handleDisappear,
  handleUpdateData,
  editRef,
  infoRef,
}) {
  const myInfo = useSelector((state) => state.userInfo);
  const edit_icon_ref = useRef();
  const [language, setLanguage] = useState("Chinese"); //to-do

  return (
    <InfoDiv
      onMouseEnter={() => handleShow(edit_icon_ref.current)}
      onMouseLeave={() => handleDisappear(edit_icon_ref.current)}
    >
      <InfoIcon>
        <i className="fas fa-globe" />
      </InfoIcon>
      <InfoText>
        <TitleDiv>
          <Title>Language</Title>
          <EditIcon
            ref={edit_icon_ref}
            onClick={() => {
              handleShow(editRef.current["language"]);
              handleDisappear(infoRef.current["language"]);
              allInfo
                .filter((data) => data !== "language")
                .forEach((data) => {
                  handleDisappear(editRef.current[data]);
                  handleShow(infoRef.current[data]);
                });
            }}
          >
            <i className="fas fa-pencil-alt" />
          </EditIcon>
        </TitleDiv>
        <InfoTextDiv ref={(el) => (infoRef.current["language"] = el)}>
          {myInfo.language}
        </InfoTextDiv>
        <EditDiv ref={(el) => (editRef.current["language"] = el)}>
          <InputBase
            inputProps={{
              style: {
                height: 24,
                fontSize: 16,
                outline: "1px rgb(58, 74, 88, 0.5) solid",
                padding: "4px 10px 0",
                backgroundColor: "rgb(255, 255, 255, 0.4)",
                borderRadius: "4px",
              },
            }}
            size="small"
            value={language}
            placeholder={myInfo.language}
            variant="outlined"
            multiline
            onChange={(e) => setLanguage(e.target.value)}
          />
          <Submit
            onClick={() => {
              handleUpdateData(
                { language },
                infoRef.current["language"],
                editRef.current["language"]
              );
            }}
          >
            <i className="fas fa-check-circle" />
          </Submit>
          <Cancel
            onClick={() => {
              handleDisappear(editRef.current["language"]);
              handleShow(infoRef.current["language"]);
            }}
          >
            <i className="fas fa-times-circle" />
          </Cancel>
        </EditDiv>
      </InfoText>
    </InfoDiv>
  );
}
