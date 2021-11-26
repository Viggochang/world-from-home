import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Photo from "./myInformationComponent/photo/Photo";
import ChangeBackground from "./myInformationComponent/changeBackground/ChangeBackground";
import Country from "./myInformationComponent/country/Country";
import MoreInformation from "./myInformationComponent/moreInformation/MoreInformation";

const UpperDiv = styled.div`
  display: flex;
  width: calc(100vw - 160px);
  max-width: 1500px;
  position: relative;
  @media (max-width: 932px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 640px) {
    width: calc(100vw - 60px);
  }
`;

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  margin-left: 40px;
  max-width: calc(100vw - 704px);
  font-weight: bold;
  line-height: 1.15;
  @media (max-width: 932px) {
    max-width: 500px;
    margin-left: 0;
    margin-top: 20px;
    border-left: 4px white solid;
    padding-left: 20px;
  }
`;

const NameDiv = styled.div`
  font-size: 92px;
  @media (max-width: 1180px) {
    font-size: 64px;
  }
`;
const TextDiv = styled.div`
  font-size: 30px;
  @media (max-width: 1180px) {
    font-size: 24px;
  }
`;
const AgeDiv = styled.div`
  font-size: 30px;
  margin-bottom: 22px;
  @media (max-width: 1180px) {
    font-size: 24px;
  }
`;

export default function MyInformation() {
  const myInfo = useSelector((state) => state.userInfo);
  const { id, name, country, photo, birthday } = myInfo;
  const age =
    birthday &&
    new Date(birthday.seconds * 1000).toDateString() !==
      new Date(0).toDateString()
      ? new Date().getFullYear() -
        new Date(1000 * birthday.seconds).getFullYear()
      : "unknown";

  return (
    <UpperDiv>
      <Photo id={id} photo={photo} />
      <ChangeBackground id={id} />
      <UserInfoDiv>
        <NameDiv>{name}</NameDiv>
        <TextDiv>from</TextDiv>
        <Country country={country} />
        <AgeDiv>{`age: ${age}`}</AgeDiv>
        <MoreInformation />
      </UserInfoDiv>
    </UpperDiv>
  );
}
