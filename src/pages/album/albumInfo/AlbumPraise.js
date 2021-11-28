import React from "react";
import styled from "styled-components";

const AlbumPraiseDiv = styled.div`
  font-size: 22px;
  line-height: 40px;
  margin: auto calc(50% - 400px) 0 auto;
  color: white;
`;

export default function AlbumPraise({ praise }) {
  return (
    <AlbumPraiseDiv>
      <i className="fas fa-thumbs-up" /> {praise}
    </AlbumPraiseDiv>
  );
}
