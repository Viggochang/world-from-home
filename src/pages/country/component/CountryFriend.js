import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { db_userInfo } from "../../../util/firebase";
import countryTrans from "../../../util/countryTrans";

import CountryFriendPopup from "./countryFriend/CountryFriendPopup";

const FriendsContainerDiv = styled.div`
  height: 100%;
  margin-left: 60px;
  color: white;
  overflow-x: scroll;
  flex-grow: 1;
  @media (max-width: 1180px) {
    margin-left: 0;
    flex-grow: 0;
    height: auto;
  }
`;

// const FriendsContainerDiv = styled.div`
//   height: 100%;
//   color: white;
//   display: flex;
//   flex-direction: column;
//   align-items: flex-start;
//   margin-left: 60px;
//   flex-grow: 1;
//   justify-content: space-between;

//   @media (max-height: 1079px) {
//     width: calc(100% - 630px);
//     margin: 20px 0 0 0;
//   }
//   @media (max-width: 1920px) {
//     width: calc(40% - 40px);
//   }
//   @media (max-width: 1280px) {
//     width: calc(55% - 40px);
//   }
//   @media (max-width: 1180px) {
//     width: calc(53% - 60px);
//   }
//   @media (max-width: 1040px) {
//     width: 100%;
//   }
//   @media (max-width: 630px) {
//     margin: 20px 0;
//     align-items: center;
//   }

//   @media (max-width: 1279px) {
//     width: calc(100% - 450px);
//   }
//   @media (max-width: 999px) {
//     width: 100%;
//   }
// `;

const InfoTitle = styled.div`
  width: 100%;
  font-size: 32px;
  line-height: 48px;
  border-bottom: 2px white solid;
  margin-top: 20px;
  @media (max-width: 1180px) {
    display: none;
  }
  @media (max-height: 900px) {
    font-size: 28px;
    line-height: 32px;
  }
`;

const MyFriendsContainer = styled.div`
  /* width: 100%; */
  height: calc(100% - 102px);
  margin: 20px 0 0 20px;
  /* background-color: #e0e0e0; */
  display: flex;
  align-items: center;
  overflow: scroll;
  @media (max-width: 1180px) {
    display: none;
  }
  /* @media (min-height: 860px) {
    height: calc(100% - 80px);
    margin: 30px 0 0 20px;
  } */
`;

const FriendHere = styled.div`
  height: calc(100% - 20px);
  /* width: 180px; */
  /* margin-right: 40px; */
  /* position: relative; */
  margin-right: 40px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-height: 900px) {
    margin-right: 25px;
  }

  /* align-items: center; */
  /* @media (max-height: 1079px) {
    margin-right: 0;
  }
  @media (max-height: 1000px) {
    margin-right: 20px;
  }
  @media (max-width: 1040px) {
    display: none;
  } */
`;

const FriendHerePhoto = styled.div`
  /* width: 200px;
  height: 200px; */
  height: calc(90% - 73px);
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0px 0px 10px #bebebe;
  @media (max-height: 900px) {
    height: calc(100% - 51px);
  }
  /* @media (min-height: 1080px) {
    height: calc(100% - 55px);
  }
  @media (min-height: 1200px) {
    height: calc(100% - 100px);
  }
  @media (max-width: 1180px) {
    height: 50%;
  } */
`;

const FriendHereInfo = styled.div`
  /* text-align: start; */
  /* position: absolute;
  bottom: 0; */
  /* margin: 10px auto 0; */
  /* display: flex;
  flex-direction: column;
  align-items: flex-start; */
`;

const FriendHereInfoName = styled.div`
  width: fit-content;
  font-size: 24px;
  line-height: 28px;
  margin: 15px auto 0;
  padding: 0 15px;
  border-radius: 16px;
  background-color: white;
  color: #3a4a58;
  cursor: pointer;
  :hover {
    background-color: #b8c3d0;
  }
  @media (max-height: 900px) {
    font-size: 16px;
    line-height: 20px;
  }
  /* @media (max-height: 720px) {
    display: none;
  }
  @media (max-width: 1180px) {
    display: none;
  } */
`;
const FriendHereInfoCountry = styled.div`
  width: fit-content;
  margin-top: 10px;
  /* display: none; */
  font-size: 18px;
  @media (max-height: 900px) {
    margin-top: 5px;
    font-size: 14px;
  }
  /* @media (min-height: 1200px) {
    display: block;
  } */
`;

const CaptainTitleDiv = styled.div`
  width: 300px;
  display: none;
  /* padding: 0 40px; */
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  color: white;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  @media (max-width: 1180px) {
    display: flex;
  }
  /* @media (min-width: 1200px) {
    padding: 0 50px;
  }

  @media (min-height: 1000px) {
    display: block;
  }
  @media (min-height: 1080px) {
    margin-left: 0;
  }
  @media (max-width: 1040px) {
    width: 240px;
    padding: 0 25px;
    cursor: pointer;
    background-color: rgb(255, 255, 255, 0.4);
    :hover {
      color: #3a4a58;
    }
  }
  @media (max-width: 630px) {
    margin: 0;
    padding: 0 10px;
  } */
`;

export default function CountryFriend({ friendHere }) {
  const history = useHistory();

  return (
    <FriendsContainerDiv>
      {/* <OtherGalleryDiv>{`${targetCountry.name} from Others`}</OtherGalleryDiv> */}
      <InfoTitle>Friends</InfoTitle>
      <MyFriendsContainer>
        {friendHere.map((friend, index) => (
          <FriendHere key={`friend-here-${index}`}>
            <FriendHerePhoto
              style={{
                backgroundImage: `url(${friend.photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => {
                history.push({
                  pathname: "user",
                  search: `?id=${friend.id}`,
                });
              }}
            />
            <FriendHereInfo>
              <FriendHereInfoName
                onClick={() => {
                  history.push({
                    pathname: "user",
                    search: `?id=${friend.id}`,
                  });
                }}
              >
                {friend.name}
              </FriendHereInfoName>
              <FriendHereInfoCountry>
                <i className="fas fa-globe"></i>
                &ensp;{countryTrans[friend.country].name_en}
              </FriendHereInfoCountry>
            </FriendHereInfo>
          </FriendHere>
        ))}
      </MyFriendsContainer>
    </FriendsContainerDiv>
  );
}
