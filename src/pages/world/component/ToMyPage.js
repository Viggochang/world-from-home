import styled from "styled-components";
import React from 'react'

const ToMyPageDiv = styled.div`
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 2;
  display: flex;
  align-items: baseline;
`;

const MyPhoto = styled.div`
  background-color: white;
  width: 100px;
  height: 100px;
  cursor: pointer;
`;

const MyName = styled.div`
  color: white;
  font-size: 70px;
  padding-left: 30px;
`;

export default function ToMyPage() {
  return (
    <ToMyPageDiv>
      <MyPhoto/>
      <MyName>World from </MyName>
    </ToMyPageDiv>
  )
}
