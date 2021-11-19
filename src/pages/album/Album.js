import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { db_gallery, db_userInfo, db_tourist_spot } from "../../util/firebase";

import ShowAlbum from "./component/ShowAlbum";
import { Tooltip, tooltipClasses } from "@mui/material";
import { styled as styledMui } from "@mui/material/styles";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "./alertButton.css";
import ToImage from "./component/ToImage";

import countryTrans from "../../util/countryTrans";

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
    /* color: #667484; */
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

const AlbumPosition = styled.div`
  margin-left: 5px;
  font-weight: bold;
  font-size: 30px;
  line-height: 40px;
`;

const AlbumDate = styled.div`
  margin-left: 5px;
  font-size: 20px;
  line-height: 40px;
`;

export default function Album() {
  const albumIdShow = useSelector((state) => state.albumIdShow);
  const myInfo = useSelector((state) => state.userInfo);
  const history = useHistory();
  const dispatch = useDispatch();
  const [albumData, setAlbumData] = useState({});
  const [ownerPhoto, setOwnerPhoto] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [ownerFriendData, setOwnerFriendData] = useState([]);
  const [liked, setLiked] = useState(false);
  const [friendCondition, setFriendCondition] = useState("none");
  const [isMyAlbun, setIsMyAlbum] = useState(false);
  const albumRef = useRef();

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("album_id_show");
    id &&
      db_gallery
        .doc(id)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            handleClickBack();
            history.push({ pathname: "notfound" });
          }
        });
  }, []);

  useEffect(() => {
    console.log(albumIdShow);
    if (albumIdShow) {
      db_gallery
        .doc(albumIdShow)
        .get()
        .then((doc) => {
          if (doc.exists) {
            let albumData = doc.data();
            setAlbumData(albumData);
            db_userInfo
              .doc(albumData.user_id)
              .get()
              .then((doc) => {
                setOwnerPhoto(doc.data().photo);
                setOwnerId(doc.data().id);
                setOwnerFriendData(doc.data().friends);
              });
          }
        });
    }
  }, [albumIdShow]);

  useEffect(() => {
    if (albumData.praise) {
      setLiked(albumData.praise.includes(myInfo.id));
    }
  }, [albumData.praise]);

  useEffect(() => {
    if (myInfo.friends) {
      myInfo.friends.forEach((friend) => {
        if (ownerId === friend.id) {
          setFriendCondition(friend.condition);
        }
      });
    }
    setIsMyAlbum(myInfo.id === ownerId);
  }, [myInfo.friends, ownerId]);

  function handleClickBack() {
    dispatch({ type: "SET_ALBUM_ID_SHOW", payload: "" });
    setAlbumData({});
    setOwnerPhoto("");
    setOwnerId("");

    let params = new URL(window.location).searchParams;
    params.delete("album_id_show");
    history.push({
      search: params.toString(),
    });
  }

  function handleLike() {
    setLiked(!liked);
    db_gallery.doc(albumIdShow).update({
      praise: !liked
        ? [...albumData.praise, myInfo.id || "none"]
        : albumData.praise.filter((id) => id !== (myInfo.id || "none")),
    });
  }

  function handleFriend() {
    const newMyFriendData = myInfo.friends.filter(
      (friend) => friend.id !== ownerId
    );
    const newOwnerFriendData = ownerFriendData.filter(
      (friend) => friend.id !== myInfo.id
    );

    if (friendCondition === "none") {
      db_userInfo.doc(myInfo.id).update({
        friends: [
          ...newMyFriendData,
          { id: ownerId, condition: "send_request" },
        ],
      });
      db_userInfo.doc(ownerId).update({
        friends: [
          ...newOwnerFriendData,
          { id: myInfo.id, condition: "get_request" },
        ],
      });
    } else if (friendCondition === "get_request") {
      db_userInfo.doc(myInfo.id).update({
        friends: [...newMyFriendData, { id: ownerId, condition: "confirmed" }],
      });
      db_userInfo.doc(ownerId).update({
        friends: [
          ...newOwnerFriendData,
          { id: myInfo.id, condition: "confirmed" },
        ],
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
    db_tourist_spot
      .where("album_id", "==", albumIdShow)
      .get()
      .then((snapshot) => {
        snapshot.docs.forEach((doc) =>
          db_tourist_spot.doc(doc.id).update({ condition: "pending" })
        );
      });
    history.push({
      pathname: "edit",
      search: `?album_id_edit=${albumIdShow}`,
    });
  }

  function handleDelete() {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      customClass: {
        confirmButton: "confirmbutton",
        cancelButton: "cancelbutton",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        db_gallery.doc(albumIdShow).update({ condition: "discard" });
        MySwal.fire({
          title: "Deleted!",
          text: "Your album has been deleted.",
          icon: "success",
          customClass: {
            confirmButton: "confirmbutton",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            handleClickBack();
          }
        });

        db_tourist_spot
          .where("album_id", "==", albumIdShow)
          .get()
          .then((snapshot) => {
            snapshot.docs.forEach((doc) =>
              db_tourist_spot.doc(doc.id).update({ condition: "discard" })
            );
          });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        MySwal.fire({
          title: "Cancelled",
          text: "Your album is safe :)",
          icon: "error",
          customClass: {
            confirmButton: "confirmbutton",
          },
        });
      }
    });
  }

  const addFriendText = {
    none: "Add Friend",
    get_request: "Add Friend",
    send_request: "Request sent",
    confirmed: "You are Friend !",
  };

  return (
    <AlbumDiv style={{ display: albumIdShow ? "flex" : "none" }}>
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
              <i className="fas fa-user-plus"></i>
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
              <i className="fas fa-trash-alt"></i>
            </ButtonStyle>
          </MyTooltip>
          <ToImage albumRef={albumRef} />
        </ButtonsDiv>
      ) : null}

      <AlbumInfo>
        <AlbumOwner
          style={{
            backgroundImage: `url(${ownerPhoto})`,
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
          <AlbumPosition>
            <i className="fas fa-map-marker-alt"></i>
            &ensp;{albumData.position}
          </AlbumPosition>
          <AlbumDate>
            <i className="far fa-calendar-alt" />
            &ensp;
            {albumData.timestamp
              ? new Date(albumData.timestamp.seconds * 1000).toDateString()
              : ""}
          </AlbumDate>
        </AlbumPositionData>
      </AlbumInfo>
      <ShowAlbum
        show={true}
        albumContent={albumData.content}
        albumRef={albumRef}
      />
    </AlbumDiv>
  );
}
