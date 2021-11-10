import React, { useRef } from "react";
import styled from "styled-components";
import "firebase/auth";

import signinImg from "../../image/signin.jpeg";

import SignInChoice from "./component/SignInChoice";
import MoreInfoForm from "./component/MoreInfoForm";

const SigninDiv = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  display: none;
  z-index: 2;
`;

const BaseDiv = styled.div`
  width: 900px;
  height: 600px;
  background-color: #667484;
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

export default function Login({ innerRef }) {
  const moreInfoFormRef = useRef();
  const signInChoiceRef = useRef();
  return (
    <SigninDiv ref={innerRef}>
      <BaseDiv>
        <PhotoDiv></PhotoDiv>
        <SignInChoice
          signInRef={innerRef}
          signInChoiceRef={signInChoiceRef}
          moreInfoFormRef={moreInfoFormRef}
        />
        <MoreInfoForm signInRef={innerRef} moreInfoFormRef={moreInfoFormRef} />
      </BaseDiv>
    </SigninDiv>
  );
}
