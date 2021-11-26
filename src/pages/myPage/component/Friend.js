import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useHistory } from "react-router";

import Button from "@material-ui/core/Button";

import countryTrans from "../../../util/countryTrans";
import { db_userInfo } from "../../../util/firebase";

const FriendDiv = styled.div`
  display: flex;
  width: 50%;
  margin-bottom: 30px;
  @media (max-width: 1180px) {
    width: 100%;
  }
  @media (max-width: 480px) {
    margin-bottom: 15px;
  }
`;
const FriendPhoto = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 4px 4px 20px #4f4f4f;
  cursor: pointer;
  :hover {
    box-shadow: 4px 4px 20px #3c3c3c;
  }
  @media (max-width: 1180px) {
    margin-left: 50px;
  }
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
  @media (max-width: 480px) {
    margin-left: 30px;
  }
`;
const FriendMask = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  :hover {
    background-color: rgb(225, 225, 225, 0.2);
  }
`;

const FriendInfo = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  color: #3a4a58;
  width: calc(100% - 130px);
  height: 100px;
  position: relative;
  @media (max-width: 1180px) {
    width: calc(100% - 180px);
  }
`;
const FriendName = styled.div`
  font-size: 36px;
  font-weight: bold;
  cursor: pointer;
  @media (max-width: 480px) {
    font-size: 24px;
  }
`;
const FriendCountry = styled.div`
  font-size: 20px;
  line-height: 30px;
  margin-bottom: 5px;
  @media (max-width: 480px) {
    font-size: 12px;
    line-height: 20px;
  }
`;

const AcceptRemoveBtnsDiv = styled.div`
  display: flex;
`;

export default function Friend({ friend, request, isMyPage }) {
  const { id: friendId, friends: friendFriends, photo, name, country } = friend;
  const acceptRef = useRef();
  const removeRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  const myInfo = useSelector((state) => state.userInfo);
  const { friends: myFriends, id: myId } = myInfo;

  function handleAcceptRemove(e, type) {
    const myFriendsData = [
      ...myFriends.filter(({ id }) => id !== friendId),
      {
        id: friendId,
        condition: type === "accept" ? "confirmed" : "none",
      },
    ];
    db_userInfo.doc(myId).update({ friends: myFriendsData });

    const friendFriendsData = [
      ...friendFriends.filter(({ id }) => id !== myId),
      {
        id: myId,
        condition: type === "accept" ? "confirmed" : "none",
      },
    ];
    db_userInfo.doc(friendId).update({ friends: friendFriendsData });
  }

  function handleQueryUserId() {
    dispatch({
      type: "SET_QUERY_USER_ID",
      payload: friendId,
    });
    history.push({ pathname: "user", search: `?id=${friendId}` });
  }

  return (
    <FriendDiv>
      {/* <NavLink to={`/user?id=${friendId}`}> */}
      <FriendPhoto
        style={{
          background: `url(${photo})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={handleQueryUserId}
      >
        <FriendMask />
      </FriendPhoto>
      {/* </NavLink> */}
      <FriendInfo>
        <FriendName onClick={handleQueryUserId}>{name}</FriendName>
        <FriendCountry>
          <i className="fas fa-globe"></i>{" "}
          {country ? countryTrans[country].name_en : ""}
        </FriendCountry>
        {isMyPage ? (
          <AcceptRemoveBtnsDiv>
            {request ? (
              <Button
                ref={acceptRef}
                onClick={(e) => handleAcceptRemove(e, "accept")}
                sx={{
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
                }}
              >
                accept
              </Button>
            ) : (
              <></>
            )}
            <Button
              ref={removeRef}
              onClick={(e) => handleAcceptRemove(e, "remove")}
              sx={{
                outline: "1px #AE0000 solid",
                color: "#AE0000",
                padding: "0 10px",
                borderRadius: "20px",
                marginRight: "15px",
                fontSize: "12px",
                // display: "flex",
                // alignItem: "center",
                // justifyContent: "center",
                "&:hover": {
                  backgroundColor: "#AE0000",
                  color: "white",
                },
              }}
            >
              remove
            </Button>
          </AcceptRemoveBtnsDiv>
        ) : (
          <></>
        )}
        {/* <AcceptRemoveBtnsDiv>
          {request ? <AcceptBtn ref={acceptRef} onClick={e => handleAcceptRemove(e, 'accept')}>accept</AcceptBtn> : <></>}
          <RemoveBtn ref={removeRef} onClick={e => handleAcceptRemove(e, 'remove')}>remove</RemoveBtn>
        </AcceptRemoveBtnsDiv> */}
      </FriendInfo>
    </FriendDiv>
  );
}
