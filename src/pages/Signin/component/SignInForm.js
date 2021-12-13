import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { SigninMediaBtn } from "../../../util/muiButton";
import { setMyUserId } from "../../../util/redux/action";

import { getUserIsExist, setUserDataIntoDb } from "../../../util/firebase";
import socialMediaAuth from "../../../util/auth";
import { googleProvider } from "../../../util/authMethod";
import worldIcon from "../../../image/worldIcon/worldIcon.png";

const SignInFormDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SignTitleDiv = styled.div`
  font-size: 50px;
  font-weight: bold;
  padding: 0 30px;
  margin-top: 100px;
  color: #3a4a58;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignInBtnArea = styled.div`
  background-color: white;
  width: 220px;
  height: 175px;
  margin-top: 70px;
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
  background-size: cover;
  background-repeat: no-repeat;
  width: 200px;
  height: 120px;
  border-radius: 12px;
`;

const socialMedia = [
  {
    name: "Google",
    provider: googleProvider,
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
    if (res.uid) {
      setCurrentUser(res);
      dispatch(setMyUserId(res.uid));

      if (await getUserIsExist(res.uid)) {
        signinRef.current.style.display = "none";
        history.push({ pathname: "home" });
      } else {
        signInFormRef.current.style.display = "none";
        moreInfoFormRef.current.style.display = "flex";

        const userData = {
          id: res.uid,
          email: res.email,
          name: res.displayName,
          photo: res.photoURL,
          country: "TW",
          language: "",
          introduction: "",
          friends: [],
          birthday: new Date(1900, 0, 1),
          travel_country: [],
        };
        setUserDataIntoDb(res.uid, userData);
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
