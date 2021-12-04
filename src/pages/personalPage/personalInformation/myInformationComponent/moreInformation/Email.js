import React from "react";
import styled from "styled-components";

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
const Title = styled.div`
  font-size: 24px;
  font-weight: bold;
  line-height: 28px;
  color: #3a4a58;
  margin-bottom: 3px;
`;

export default function Email({ email }) {
  return (
    <InfoDiv>
      <InfoIcon>
        <i className="fas fa-envelope" />
      </InfoIcon>
      <InfoText>
        <Title>Email</Title>
        <InfoTextDiv>{email}</InfoTextDiv>
      </InfoText>
    </InfoDiv>
  );
}
