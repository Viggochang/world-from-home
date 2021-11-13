import React from "react";
import styled from "styled-components";
import "firebase/auth";

import signinImg from "../../image/signin.jpeg";

import SignInChoice from "./component/SignInChoice";

const SigninDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  z-index: -1;
`;

const BaseDiv = styled.div`
  width: 900px;
  height: 600px;
  background-color: #b8c3d0;
  margin: auto;
  display: flex;
  position: relative;
`;

const PhotoDiv = styled.div`
  width: 500px;
  height: 100%;
  background: url(${signinImg});
  background-size: cover;
  background-position: 60%;
`;

export default function Login({ signinRef }) {
  // const signInChoiceRef = useRef();

  return (
    <SigninDiv ref={signinRef}>
      <BaseDiv>
        <PhotoDiv></PhotoDiv>
        <SignInChoice signinRef={signinRef} />
      </BaseDiv>
    </SigninDiv>
  );
}
