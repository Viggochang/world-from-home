import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  getAlbumDataById,
  getUserDataByUid,
  updateAlbum,
  updateUser,
  getTouristSpotByAlbumId,
  onSnapshotAlbumByAlbumId,
  updateTouristSpot,
} from "../../util/firebase";
import { swalDeleteAlbum } from "../../util/swal";

import ShowAlbum from "./component/ShowAlbum";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";
// import "./alertButton.css";

import countryTrans from "../../util/countryTrans";
import { friendStateObj } from "../../util/friendStateObj";

const MyTooltip = styledMui(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgb(255, 255, 255, 0.9)",
    color: "#3a4a58",
    boxShadow: theme.shadows[1],
    fontSize: 18,
    fontWeight: "bold",
  },
}));

const AlbumDiv = styled.div`
  width: calc(100vw - 200px);
  height: calc(100vh - 80px);
  background-color: rgb(0, 0, 0, 0.9);
  display: none;
  z-index: 5;
  position: fixed;
  top: 0;
  left: 0;
  flex-direction: column;
  padding: 40px 100px;
  overflow: scroll;
  @media (min-width: 1440px) {
    width: 1240px;
    padding: 40px calc(50vw - 620px);
  }
`;

const BackDiv = styled.div`
  position: fixed;
  top: 25px;
  right: 30px;
  color: #9d9d9d;
  font-weight: bold;
  font-size: 28px;
  cursor: pointer;
  :hover {
    color: white;
  }
`;

const ButtonsDiv = styled.div`
  position: fixed;
  top: 150px;
  right: 60px;
  display: flex;
  flex-direction: column;
  z-index: 1;
  @media (min-width: 1440px) {
    right: 100px;
  }
`;

const ButtonStyle = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 30px;
  color: #3a4a58;
  background-color: white;
  cursor: pointer;
  box-shadow: 0px 0px 10px #d0d0d0;
  @media (min-width: 1440px) {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }
  :hover {
    box-shadow: 0px 0px 22px #d0d0d0;
  }
`;

const AlbumInfo = styled.div`
  display: flex;
  align-items: center;
`;

const AlbumOwner = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 10px;
  cursor: pointer;
`;

const AlbumPositionData = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
`;

const AlbumOwnerName = styled.div`
  margin-left: 5px;
  font-weight: bold;
  font-size: 30px;
  line-height: 40px;
`;

const AlbumDate = styled.div`
  margin-left: 5px;
  font-size: 22px;
  line-height: 40px;
`;

const AlbumPraise = styled.div`
  font-size: 22px;
  line-height: 40px;
  margin: auto calc(50% - 400px) 0 auto;
  color: white;
`;

export default function Album() {
  const albumIdShow = useSelector((state) => state.albumIdShow);
  const myInfo = useSelector((state) => state.userInfo);
  const history = useHistory();
  const dispatch = useDispatch();
  const [albumData, setAlbumData] = useState({});
  const [ownerData, setOwnerData] = useState({});
  const [praise, setPraise] = useState(0);
  const [liked, setLiked] = useState(false);
  const [friendCondition, setFriendCondition] = useState("none");
  const [isMyAlbun, setIsMyAlbum] = useState(false);
  const albumRef = useRef();

  const id = new URLSearchParams(window.location.search).get("album_id_show");

  useEffect(() => {
    async function getAlbumData(id) {
      const albumData = await getAlbumDataById(id);
      if (!albumData) {
        handleClickBack();
        history.push({ pathname: "notfound" });
      } else {
        setAlbumData(albumData);
        setLiked(albumData.praise.includes(myInfo.id));

        if (albumData.user_id === myInfo.id) {
          setIsMyAlbum(true);
        }

        const ownerData = await getUserDataByUid(albumData.user_id);
        setOwnerData(ownerData);
        if (Object.keys(myInfo).length) {
          myInfo.friends.forEach((friend) => {
            if (ownerData.id === friend.id) {
              setFriendCondition(friend.condition);
            }
          });
        }
      }
    }
    id && getAlbumData(id);
  }, [id, myInfo]);

  useEffect(() => {
    if (albumIdShow) {
      const unsubscribe = onSnapshotAlbumByAlbumId(albumIdShow, setPraise);
      return () => {
        unsubscribe();
      };
    }
  }, [albumIdShow]);

  function handleClickBack() {
    dispatch({ type: "SET_ALBUM_ID_SHOW", payload: "" });
    setAlbumData({});
    setOwnerData({});

    let params = new URL(window.location).searchParams;
    params.delete("album_id_show");
    history.push({
      search: params.toString(),
    });
  }

  function handleLike() {
    setLiked(!liked);
    updateAlbum(albumIdShow, {
      praise: !liked
        ? [...albumData.praise.filter((id) => id !== myInfo.id), myInfo.id]
        : albumData.praise.filter((id) => id !== myInfo.id),
    });
  }

  function handleFriend() {
    if (friendCondition === "none" || friendCondition === "get_request") {
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

      setFriendCondition(friendStateObj[friendCondition].state_change.my_state);
      updateUser(myInfo.id, {
        friends: createUpdateBody(
          myInfo,
          ownerData,
          friendCondition,
          "my_state"
        ),
      });
      updateUser(ownerData.id, {
        friends: createUpdateBody(
          ownerData,
          myInfo,
          friendCondition,
          "friend_state"
        ),
      });
    }
  }

  function handleEdit() {
    dispatch({
      type: "SET_ALBUM_ID_SHOW",
      payload: "",
    });
    dispatch({
      type: "SET_TARGET_COUNTRY",
      payload: {
        id: albumData.country,
        name: countryTrans[albumData.country].name_en,
      },
    });
    async function touristSpotPending() {
      const touristSpots = await getTouristSpotByAlbumId(albumIdShow);
      touristSpots.forEach((doc) =>
        updateTouristSpot(doc.id, { condition: "pending" })
      );
    }
    touristSpotPending();
    history.push({
      pathname: "edit",
      search: `?album_id_edit=${albumIdShow}`,
    });
  }

  function handleDelete() {
    async function discardTouristSpot() {
      const allSpots = await getTouristSpotByAlbumId(albumIdShow);
      allSpots.forEach((spot) =>
        updateTouristSpot(spot.id, { condition: "discard" })
      );
    }

    swalDeleteAlbum(
      () => {
        updateAlbum(albumIdShow, { condition: "discard" });
      },
      discardTouristSpot,
      handleClickBack
    );
  }

  function handleEsc(event) {
    if (event.key === "Escape") {
      if (albumIdShow) {
        handleClickBack();
      }
    }
  }

  const addFriendText = {
    none: "Add Friend",
    get_request: "Add Friend",
    send_request: "Request sent",
    confirmed: "You are Friend !",
  };

  return (
    <AlbumDiv
      style={{ display: albumIdShow ? "flex" : "none" }}
      onKeyDown={handleEsc}
      tabIndex="0"
    >
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times-circle" />
      </BackDiv>
      {myInfo.id ? (
        <ButtonsDiv>
          <MyTooltip
            title={liked ? "Liked" : "Like"}
            placement="left"
            sx={{ fontSize: "16px" }}
          >
            <ButtonStyle
              onClick={handleLike}
              style={
                liked ? { backgroundColor: "#3A4A58", color: "white" } : {}
              }
            >
              <i className="fas fa-thumbs-up" />
            </ButtonStyle>
          </MyTooltip>

          <MyTooltip title={addFriendText[friendCondition]} placement="left">
            <ButtonStyle
              onClick={handleFriend}
              style={
                friendCondition === "confirmed"
                  ? {
                      backgroundColor: "#3A4A58",
                      color: "white",
                      display: isMyAlbun ? "none" : "flex",
                    }
                  : { display: isMyAlbun ? "none" : "flex" }
              }
            >
              <i className="fas fa-user-plus" />
            </ButtonStyle>
          </MyTooltip>

          <MyTooltip
            title="Edit"
            placement="left"
            style={{ display: isMyAlbun ? "flex" : "none" }}
          >
            <ButtonStyle onClick={handleEdit}>
              <i className="fas fa-pencil-alt" />
            </ButtonStyle>
          </MyTooltip>

          <MyTooltip
            title="Delete"
            placement="left"
            style={{ display: isMyAlbun ? "flex" : "none" }}
          >
            <ButtonStyle onClick={handleDelete}>
              <i className="fas fa-trash-alt" />
            </ButtonStyle>
          </MyTooltip>
          {/* <ToImage albumRef={albumRef} /> */}
        </ButtonsDiv>
      ) : null}

      <AlbumInfo>
        <AlbumOwner
          style={{
            backgroundImage: `url(${ownerData.photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {
            dispatch({
              type: "SET_ALBUM_ID_SHOW",
              payload: "",
            });
            history.push({
              pathname: "user",
              search: `?id=${albumData.user_id}`,
            });
          }}
        />
        <AlbumPositionData>
          <AlbumOwnerName>{ownerData.name}</AlbumOwnerName>
          <AlbumDate>
            <i className="fas fa-map-marker-alt" />
            &ensp;{albumData.position}&emsp;
            <i className="far fa-calendar-alt" />
            &ensp;
            {albumData.timestamp
              ? new Date(albumData.timestamp.seconds * 1000).toDateString()
              : ""}
          </AlbumDate>
        </AlbumPositionData>
        <AlbumPraise>
          <i className="fas fa-thumbs-up" /> {praise}
        </AlbumPraise>
      </AlbumInfo>
      <ShowAlbum
        show={true}
        albumContent={albumData.content}
        albumRef={albumRef}
      />
    </AlbumDiv>
  );
}
