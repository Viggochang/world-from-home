import React from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import notFound from "../../image/notFound.jpeg";

const NotFoundDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #b8c3d0;
  display: flex;
`;

const ContentDiv = styled.div`
  width: 70%;
  height: 75%;
  margin: auto;
  border-radius: 10px;
  box-shadow: 4px 6px 10px rgb(80, 80, 80, 0.5);
  background: url(${notFound});
  background-size: cover;
  background-position: center;
  position: relative;
  @media (max-width: 800px) {
    width: 70vmin;
    height: 100vmin;
    max-height: 75%;
  }
`;

const ErrorMsg = styled.div`
  width: 320px;
  height: 260px;
  background-color: rgb(255, 255, 255, 0.8);
  position: absolute;
  right: 60px;
  bottom: 60px;
  color: #3a4a58;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px 60px;
  @media (max-width: 800px) {
    width: calc(70vmin - 180px);
    right: 30px;
  }
  @media (max-width: 600px) {
    bottom: 30px;
    padding: 30px 20px;
    width: calc(70vmin - 100px);
  }
`;

const Title = styled.div`
  font-size: 92px;
  font-weight: bold;
  margin: 0 auto;
  @media (max-width: 600px) {
    font-size: 72px;
  }
  @media (max-width: 425px) {
    font-size: 60px;
  }
`;

const Text = styled.div`
  font-size: 24px;
  line-height: 32px;
  @media (max-width: 800px) {
    font-size: 20px;
  }
  @media (max-width: 600px) {
    margin-top: 10px;
    font-size: 16px;
    line-height: 24px;
  }
`;

const HomeBtn = styled.div`
  width: 120px;
  font-size: 24px;
  line-height: 36px;
  background-color: #3a4a58;
  border-radius: 18px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  justify-content: center;
  margin: auto 0 0 auto;
`;

export default function NotFound() {
  const history = useHistory();
  function handleHome() {
    history.push({ pathname: "/home" });
  }
  return (
    <NotFoundDiv>
      <ContentDiv>
        <ErrorMsg>
          <Title> 404 ! </Title>
          <Text>
            Looks like you're lost.
            <br />
            Don't worry,
            <br /> we're here to rescue you !
          </Text>
          <HomeBtn onClick={handleHome}>Home</HomeBtn>
        </ErrorMsg>
      </ContentDiv>
    </NotFoundDiv>
  );
}
