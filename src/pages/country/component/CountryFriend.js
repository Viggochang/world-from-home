import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { db_userInfo } from "../../../util/firebase";
import countryTrans from "../../../util/countryTrans";

import CountryFriendPopup from "./countryFriend/CountryFriendPopup";

const FriendsContainerDiv = styled.div`
  width: 57%;
  height: calc(43% - 80px);
  margin: 20px 0 0 50px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* justify-content: space-between; */

  @media (max-height: 1079px) {
    width: calc(100% - 630px);
    margin: 20px 0 0 0;
  }
  @media (max-width: 1920px) {
    width: calc(40% - 40px);
  }
  @media (max-width: 1280px) {
    width: calc(55% - 40px);
  }
  @media (max-width: 1180px) {
    width: calc(53% - 60px);
  }
  @media (max-width: 1040px) {
    width: 100%;
  }
  @media (max-width: 630px) {
    margin: 20px 0;
    align-items: center;
  }
  /* @media (max-width: 1279px) {
    width: calc(100% - 450px);
  }
  @media (max-width: 999px) {
    width: 100%;
  } */
`;

const CaptainTitleDiv = styled.div`
  display: flex;
  justify-content: center;
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;
  padding: 0 15px;
  margin-left: 52px;
  align-items: center;
  @media (min-width: 1200px) {
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
  }
`;

const MyFriendsContainer = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 0 0 20px;
  padding: 5px 0 0 10px;
  /* background-color: #e0e0e0; */
  display: flex;
  align-items: center;
  overflow: scroll;
  @media (min-height: 860px) {
    /* height: calc(100% - 80px); */
    margin: 30px 0 0 20px;
  }
`;

const FriendHere = styled.div`
  height: 100%;
  /* width: 180px; */
  margin-right: 40px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* align-items: center; */
  @media (max-height: 1079px) {
    margin-right: 0;
  }
  @media (max-height: 1000px) {
    margin-right: 20px;
  }
  @media (max-width: 1040px) {
    display: none;
  }
`;

const FriendHerePhoto = styled.div`
  height: 100%;
  margin: 0 auto;
  aspect-ratio: 1;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0px 0px 10px #bebebe;
  @media (min-height: 1080px) {
    height: calc(100% - 55px);
  }
  @media (min-height: 1200px) {
    height: calc(100% - 100px);
  }
  @media (max-width: 1180px) {
    height: 50%;
  }
`;

const FriendHereInfo = styled.div`
  /* text-align: start; */
  /* position: absolute;
  bottom: 0; */
  margin: 10px auto 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FriendHereInfoName = styled.div`
  font-size: 24px;
  line-height: 28px;
  margin-top: 10px;
  padding: 0 10px;
  border-radius: 16px;
  background-color: white;
  color: #3a4a58;
  cursor: pointer;
  :hover {
    background-color: #b8c3d0;
  }
  @media (max-height: 720px) {
    display: none;
  }
  @media (max-width: 1180px) {
    display: none;
  }
`;
const FriendHereInfoCountry = styled.div`
  margin-top: 10px;
  display: none;
  font-size: 20px;
  @media (min-height: 1200px) {
    display: block;
  }
`;

export default function CountryFriend() {
  const history = useHistory();
  const targetCountry = useSelector((state) => state.targetCountry);
  const [friendHere, setFriendHere] = useState([]);
  const myInfo = useSelector((state) => state.userInfo);
  const popupRef = useRef();
  const { id } = myInfo;

  useEffect(() => {
    console.log(id);
    if (id) {
      db_userInfo
        .where("friends", "array-contains", { id: id, condition: "confirmed" })
        .get()
        .then((querySnapshot) => {
          return querySnapshot.docs;
        })
        .then((friendList) => {
          setFriendHere(
            friendList
              .filter((friend) =>
                friend.data().travel_country.includes(targetCountry.id)
              )
              .map((friend) => {
                const { photo, id, name, country } = friend.data();
                return { photo, id, name, country };
              })
          );
        });
    }
  }, [myInfo, targetCountry]);

  function handlePopup() {
    popupRef.current.style.display = "flex";
  }

  return (
    <FriendsContainerDiv>
      {/* <OtherGalleryDiv>{`${targetCountry.name} from Others`}</OtherGalleryDiv> */}
      <CaptainTitleDiv onClick={handlePopup}>
        <i className="fas fa-users"></i>
        &ensp;{`Friends`}
      </CaptainTitleDiv>
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
                history.push({ pathname: "user", search: `?id=${friend.id}` });
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
      <CountryFriendPopup popupRef={popupRef} friendHere={friendHere} />
    </FriendsContainerDiv>
  );
}
