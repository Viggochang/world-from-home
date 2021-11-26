import React from "react";
import styled from "styled-components";

const MyPhoto = styled.div`
  width: 350px;
  height: 350px;
  box-shadow: 2px 2px 20px #4f4f4f;
  position: relative;
  color: white;
  border-radius: 20px;
  background-image: ${(props) => `url(${props.backgroundImg})`};
  background-size: ${() => "cover"};
  background-position: ${() => "center"};
  @media (max-width: 1180px) {
    width: 250px;
    height: 250px;
  }
  @media (max-width: 932px) {
    margin-top: 60px;
    width: 375px;
    height: 375px;
  }
  @media (max-width: 450px) {
    width: 300px;
    height: 300px;
  }
`;

export default function Photo({ photo }) {
  return <MyPhoto backgroundImg={photo} />;
}
