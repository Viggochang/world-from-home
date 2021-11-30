import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";

import MyTooltip from "../../../util/muiTooltips";

import { updateAlbum } from "../../../util/firebase";

const ButtonStyle = styled.div`
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 30px;
  color: ${(props) => (props.liked === "true" ? "white" : "#3A4A58")};
  background-color: ${(props) =>
    props.liked === "true" ? "#3A4A58" : "white"};
  cursor: pointer;
  box-shadow: 0px 0px 10px #d0d0d0;
  @media (min-width: 1440px) {
    width: 80px;
    height: 80px;
    font-size: 36px;
  }
  @media (max-width: 800px) {
    margin: 15px 10px 0;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  :hover {
    box-shadow: 0px 0px 22px #d0d0d0;
  }
`;

export default function LikeBtn({ praise }) {
  const myInfo = useSelector((state) => state.userInfo);
  const albumIdShow = useSelector((state) => state.albumIdShow);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(praise && praise.includes(myInfo.id));
  }, [praise]);

  function handleLike() {
    setLiked(!liked);
    updateAlbum(albumIdShow, {
      praise: !liked
        ? [...praise.filter((id) => id !== myInfo.id), myInfo.id]
        : praise.filter((id) => id !== myInfo.id),
    });
  }

  return (
    <MyTooltip
      style={{ fontSize: 18, opacity: 0.9 }}
      title={liked ? "Liked" : "Like"}
      placement="left"
      content={
        <ButtonStyle liked={!!liked && liked.toString()} onClick={handleLike}>
          <i className="fas fa-thumbs-up" />
        </ButtonStyle>
      }
    />
  );
}
