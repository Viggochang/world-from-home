import React, {useRef} from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { NavLink } from "react-router-dom";

import { styled as styledMui } from "@mui/styles";
import Button from "@material-ui/core/Button";

import countryTrans from "../../../util/countryTrans";
import { db_userInfo } from "../../../util/firebase";

const FriendDiv = styled.div`
  display: flex;
  width: 50%;
  margin-bottom: 30px;
`;
const FriendPhoto = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0px 0px 20px #4f4f4f;
  cursor: pointer;
`;
const FriendInfo = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  color: #3a4a58;
  width: calc(100% - 130px);
  height: 100px;
  position: relative;
`;
const FriendName = styled.div`
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
`;
const FriendCountry = styled.div`
  font-size: 24px;
  line-height: 40px;
`;

const AcceptRemoveBtnsDiv = styled.div``;
const AcceptBtn = styledMui(Button)({
  outline: "1px	#006000 solid",
  color: "#006000",
  padding: "0 10px",
  borderRadius: "20px",
  marginRight: "15px",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#006000",
    color: "white",
  },
});
const RemoveBtn = styledMui(Button)({
  outline: "1px #AE0000 solid",
  color: "#AE0000",
  padding: "0 10px",
  borderRadius: "20px",
  marginRight: "15px",
  fontSize: "12px",
  "&:hover": {
    backgroundColor: "#AE0000",
    color: "white",
  },
});

export default function Friend({ friend, request }) {
  const { id: friendId, friends: friendFriends, photo, name, country } = friend;
  const acceptRef = useRef();
  const removeRef = useRef();

  const myInfo = useSelector((state) => state.userInfo);
  const { friends: myFriends, id: myId} = myInfo


  function handleAcceptRemove(e, type){
    const myFriendsData = [
      ...myFriends.filter(({ id }) => id !== friendId),
      {
        id: friendId,
        condition: (type === 'accept') ? 'confirmed' : 'none',
      },
    ];
    db_userInfo.doc(myId).update({ friends: myFriendsData });

    const friendFriendsData = [
      ...friendFriends.filter(({ id }) => id !== myId),
      {
        id: myId,
        condition: (type === 'accept') ? 'confirmed' : 'none',
      },
    ];
    db_userInfo.doc(friendId).update({ friends: friendFriendsData });
  }

  return (
    <FriendDiv>
      <NavLink to={`/user?id=${friendId}`}>
        <FriendPhoto
          style={{
            background: `url(${photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></FriendPhoto>
      </NavLink>
      <FriendInfo>
        <FriendName>{name}</FriendName>
        <FriendCountry>
          <i className="fas fa-globe"></i>{" "}
          {country ? countryTrans[country].name_en : ""}
        </FriendCountry>
        <AcceptRemoveBtnsDiv>
          {request ? <AcceptBtn ref={acceptRef} onClick={e => handleAcceptRemove(e, 'accept')}>accept</AcceptBtn> : <></>}
          <RemoveBtn ref={removeRef} onClick={e => handleAcceptRemove(e, 'remove')}>remove</RemoveBtn>
        </AcceptRemoveBtnsDiv>
      </FriendInfo>
    </FriendDiv>
  );
}
