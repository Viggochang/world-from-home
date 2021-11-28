import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SigninMediaBtn } from "../../../util/muiButton";

import { getUserIsExist } from "../../../util/firebase";
import socialMediaAuth from "../../../util/auth";
import { facebookProvider, googleProvider } from "../../../util/authMethod";
import worldIcon from "../../../image/worldIcon/worldIcon.png";

const SignInFormDiv = styled.div`
  display: flex; /* to-do */
  flex-direction: column;
  align-items: center;
`;

const SignTitleDiv = styled.div`
  font-size: 40px;
  font-weight: bold;
  line-height: 40px;
  padding: 0 30px;
  margin-top: 80px;
  color: #3a4a58;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignInBtnArea = styled.div`
  background-color: white;
  width: 220px;
  height: 230px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  box-shadow: 4px 6px 10px rgb(80, 80, 80, 0.5);
  border-radius: 10px;
`;

const WorldIcon = styled.div`
  background-image: url(${worldIcon});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  margin-top: -10px;
  margin-bottom: 10px;
  width: 200px;
  height: 120px;
  border-radius: 4px;
`;

const socialMedia = [
  {
    name: "Google",
    provider: googleProvider,
  },
  {
    name: "Facebook",
    provider: facebookProvider,
  },
];

export default function SignInForm({
  signinRef,
  signInFormRef,
  moreInfoFormRef,
  setCurrentUser,
}) {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSignin = async (provider) => {
    const res = await socialMediaAuth(provider);
    if (res) {
      setCurrentUser(res);
      dispatch({
        type: "SET_MY_USER_ID",
        payload: res.uid,
      });

      if (await getUserIsExist(res.uid)) {
        signinRef.current.style.display = "none";
        history.push({ pathname: "home" });
      } else {
        signInFormRef.current.style.display = "none";
        moreInfoFormRef.current.style.display = "flex";
      }
    }
  };

  return (
    <SignInFormDiv ref={signInFormRef}>
      <SignTitleDiv>SIGN&ensp;IN</SignTitleDiv>
      <SignInBtnArea>
        <WorldIcon />
        {socialMedia.map((socialMedia) => (
          <SigninMediaBtn
            key={socialMedia.name}
            content={socialMedia.name}
            onClick={() => handleSignin(socialMedia.provider)}
          />
        ))}
      </SignInBtnArea>
    </SignInFormDiv>
  );
}
