import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { db_userInfo } from "../../../util/firebase";
import countryTrans from "../../../util/countryTrans";

const FriendsContainerDiv = styled.div`
  width: calc(100% - 650px);
  height: calc(43% - 80px);
  margin: 20px 0 0 50px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* justify-content: space-between; */
  @media (min-height: 1080px) {
    width: calc(100% - 790px);
  }
`;

const CaptainTitleDiv = styled.div`
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  padding: 0 50px;
  text-align: center;
`;

const MyFriendsContainer = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  margin: 30px 0 0 20px;
  padding: 5px 0 0 10px;
  /* background-color: #e0e0e0; */
  display: flex;
  align-items: center;
  overflow: scroll;
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
  /* @media (min-height: 1200px) {
    align-items: flex-start;
  } */
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
  font-size: 20px;
  line-height: 24px;
  margin-top: 10px;
  padding: 0 10px;
  border-radius: 16px;
  background-color: white;
  color: #3a4a58;
  cursor: pointer;
  :hover {
    background-color: #b8c3d0;
  }
  @media (min-height: 900px) {
    font-size: 24px;
    line-height: 32px;
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

  return (
    <FriendsContainerDiv>
      {/* <OtherGalleryDiv>{`${targetCountry.name} from Others`}</OtherGalleryDiv> */}
      <CaptainTitleDiv>
        <i className="fas fa-users"></i>
        &ensp;{`Friends in ${targetCountry.name}`}
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
            {/* <FriendHereInfo>
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
            </FriendHereInfo> */}
          </FriendHere>
        ))}
      </MyFriendsContainer>
    </FriendsContainerDiv>
  );
}
