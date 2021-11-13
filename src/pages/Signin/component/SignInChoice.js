import React, { useState, useRef } from "react";
import styled from "styled-components";

import SignInForm from "./SignInForm";
import MoreInfoForm from "./MoreInfoForm";

const SignInChoiceDiv = styled.div`
  width: 400px;
  height: 100%;
`;

const CrossDiv = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  right: 15px;
  color: white;
  font-weight: bold;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  :hover {
    background-color: rgb(255, 255, 255, 0.2);
  }
`;

export default function SignInChoice({ signinRef }) {
  const signInFormRef = useRef();
  const moreInfoFormRef = useRef();

  const [currentUser, setCurrentUser] = useState({});

  function handleClose() {
    signinRef.current.style.zIndex = -1;
  }

  return (
    <SignInChoiceDiv>
      <SignInForm
        signinRef={signinRef}
        signInFormRef={signInFormRef}
        moreInfoFormRef={moreInfoFormRef}
        setCurrentUser={setCurrentUser}
      />
      <MoreInfoForm
        signinRef={signinRef}
        signInFormRef={signInFormRef}
        moreInfoFormRef={moreInfoFormRef}
        currentUser={currentUser}
      />
      <CrossDiv onClick={handleClose}>
        <i className="fas fa-times"></i>
      </CrossDiv>
    </SignInChoiceDiv>
  );
}
