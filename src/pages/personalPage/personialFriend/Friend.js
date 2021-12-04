import React, { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { useHistory } from "react-router";

import { FriendAcceptRemoveBtn } from "../../../util/muiButton";

import countryTrans from "../../../util/countryTrans";
import { updateUser } from "../../../util/firebase";
import { friendStateObj } from "../../../util/friendStateObj";
import { swalRemoveFriend } from "../../../util/swal";

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
  background-image: url(${(props) => props.photo});
  background-size: cover;
  background-position: center;
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

export default function Friend({ friend: friendInfo, request, isMyPage }) {
  const acceptRef = useRef();
  const removeRef = useRef();
  const history = useHistory();
  const dispatch = useDispatch();

  const myInfo = useSelector((state) => state.userInfo);

  function handleAcceptRemove(e, friendCondition) {
    const createUpdateBody = (
      myInfo,
      friendInfo,
      friendCondition,
      stateFrom
    ) => [
      ...myInfo.friends.filter((friend) => friend.id !== friendInfo.id),
      {
        id: friendInfo.id,
        condition: friendStateObj[friendCondition].state_change[stateFrom],
      },
    ];

    updateUser(myInfo.id, {
      friends: createUpdateBody(
        myInfo,
        friendInfo,
        friendCondition,
        "my_state"
      ),
    });
    updateUser(friendInfo.id, {
      friends: createUpdateBody(
        friendInfo,
        myInfo,
        friendCondition,
        "friend_state"
      ),
    });
  }

  function handleQueryUserId() {
    dispatch({
      type: "SET_QUERY_USER_ID",
      payload: friendInfo.id,
    });
    history.push({ pathname: "user", search: `?id=${friendInfo.id}` });
  }

  return (
    <FriendDiv>
      <FriendPhoto photo={friendInfo.photo} onClick={handleQueryUserId}>
        <FriendMask />
      </FriendPhoto>
      <FriendInfo>
        <FriendName onClick={handleQueryUserId}>{friendInfo.name}</FriendName>
        <FriendCountry>
          <i className="fas fa-globe" />
          &ensp;
          {friendInfo.country ? countryTrans[friendInfo.country].name_en : ""}
        </FriendCountry>
        {isMyPage && (
          <AcceptRemoveBtnsDiv>
            {request && (
              <FriendAcceptRemoveBtn
                content="accept"
                innerRef={acceptRef}
                onClick={(e) => handleAcceptRemove(e, "get_request")}
              />
            )}
            <FriendAcceptRemoveBtn
              content="remove"
              innerRef={removeRef}
              onClick={(e) =>
                swalRemoveFriend(() => handleAcceptRemove(e, "confirmed"))
              }
            />
          </AcceptRemoveBtnsDiv>
        )}
      </FriendInfo>
    </FriendDiv>
  );
}
