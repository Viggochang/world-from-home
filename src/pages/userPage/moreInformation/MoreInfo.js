import React from "react";

import styled from "styled-components";

const MoreInfoDiv = styled.div`
  color: white;
  width: 320px;
  height: auto;
  background-color: rgb(255, 255, 255, 0.7);
  box-shadow: 3px 2px 15px #5b5b5b;
  z-index: 2;
  display: none;
  position: absolute;
  top: 0px;
  right: 80px;
  padding: 30px 30px 0;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 10px;
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
  font-weight: 400;
`;

const IntroductionDiv = styled.div`
  width: 100%;
  height: 114px;
  color: #5b5b5b;
  overflow: scroll;
  font-size: 20px;
  line-height: 30px;
`;

export default function MoreInfo({ innerRef, userInfo, handleMoreInfo }) {
  // const userInfo = useSelector((state) => state.userInfo);

  const { email, language, introduction, birthday } = userInfo;
  const birthdayDate =
    birthday && new Date(birthday.seconds * 1000).toDateString();

  const birthdayFormat =
    birthday && birthdayDate !== new Date(0).toDateString()
      ? birthdayDate.slice(4)
      : "";

  function handleCloseMoreInfo() {
    innerRef.current.style.display = "none";
  }

  const infoData = [
    {
      title: "Email",
      info_data: email,
      icon: <i className="fas fa-envelope"></i>,
    },
    {
      title: "Language",
      info_data: language,
      icon: <i className="fas fa-globe"></i>,
    },
    {
      title: "Birthday",
      info_data: birthdayFormat,
      icon: <i className="fas fa-birthday-cake"></i>,
    },
    {
      title: "Introduction",
      info_data: <IntroductionDiv>{introduction}</IntroductionDiv>,
      icon: <i className="fas fa-smile"></i>,
    },
  ];
  return (
    <MoreInfoDiv ref={innerRef}>
      <CloseDiv
        onClick={() => {
          handleCloseMoreInfo();
          handleMoreInfo();
        }}
      >
        <i className="fas fa-times-circle"></i>
      </CloseDiv>
      {infoData.map((info, index) => {
        const { title, info_data, icon } = info;
        return (
          <InfoDiv key={index}>
            <InfoIcon>{icon}</InfoIcon>
            <InfoText>
              <Title>{title}</Title>
              <InfoTextDiv>{info_data}</InfoTextDiv>
            </InfoText>
          </InfoDiv>
        );
      })}
    </MoreInfoDiv>
  );
}
