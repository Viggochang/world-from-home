import React, { useRef, useState, useEffect } from "react";
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

const IntroductionDiv = styled.div`
  width: 100%;
  height: 114px;
  color: #5b5b5b;
  overflow: scroll;
  padding-left: 5px;
  font-size: 20px;
  line-height: 30px;
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
export default function Introduction({
  handleShow,
  handleDisappear,
  handleUpdateData,
  editRef,
  infoRef,
}) {
  const myInfo = useSelector((state) => state.userInfo);
  const edit_icon_ref = useRef();
  const [introduction, setIntroduction] = useState();

  useEffect(() => {
    setIntroduction(myInfo.introduction);
  }, [myInfo.introduction]);

  return (
    <InfoDiv
      onMouseEnter={() => handleShow(edit_icon_ref.current)}
      onMouseLeave={() => handleDisappear(edit_icon_ref.current)}
    >
      <InfoIcon>
        <i className="fas fa-smile" />
      </InfoIcon>
      <InfoText>
        <TitleDiv>
          <Title>Introduction</Title>
          <EditIcon
            ref={edit_icon_ref}
            onClick={() => {
              handleShow(editRef.current["introduction"]);
              handleDisappear(infoRef.current["introduction"]);
              allInfo
                .filter((data) => data !== "introduction")
                .forEach((data) => {
                  handleDisappear(editRef.current[data]);
                  handleShow(infoRef.current[data]);
                });
            }}
          >
            <i className="fas fa-pencil-alt" />
          </EditIcon>
        </TitleDiv>
        <IntroductionDiv ref={(el) => (infoRef.current["introduction"] = el)}>
          {myInfo.introduction}
        </IntroductionDiv>
        <EditDiv ref={(el) => (editRef.current["introduction"] = el)}>
          <InputBase
            inputProps={{
              style: {
                height: 104,
                fontSize: 16,
                outline: "1px rgb(58, 74, 88, 0.5) solid",
                padding: "4px 10px 0",
                backgroundColor: "rgb(255, 255, 255, 0.4)",
                borderRadius: "8px",
              },
            }}
            size="small"
            value={introduction}
            placeholder={myInfo.introduction}
            variant="outlined"
            multiline
            onChange={(e) => setIntroduction(e.target.value)}
          />
          <Submit
            onClick={() => {
              handleUpdateData(
                { introduction },
                infoRef.current["introduction"],
                editRef.current["introduction"]
              );
            }}
          >
            <i className="fas fa-check-circle" />
          </Submit>
          <Cancel
            onClick={() => {
              handleDisappear(editRef.current["introduction"]);
              handleShow(infoRef.current["introduction"]);
            }}
          >
            <i className="fas fa-times-circle" />
          </Cancel>
        </EditDiv>
      </InfoText>
    </InfoDiv>
  );
}
