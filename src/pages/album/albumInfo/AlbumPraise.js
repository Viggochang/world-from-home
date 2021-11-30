import React from "react";
import styled from "styled-components";

const AlbumPraiseDiv = styled.div`
  font-size: 22px;
  line-height: 40px;
  margin: auto calc(50% - 400px) 0 auto;
  color: white;
  @media (max-width: 1200px) {
    margin-right: calc((33.33vw - 200px) / 2);
  }
  @media (max-width: 750px) {
    font-size: 14px;
    line-height: 27px;
  }
`;

export default function AlbumPraise({ praise }) {
  return (
    <AlbumPraiseDiv>
      <i className="fas fa-thumbs-up" /> {praise}
    </AlbumPraiseDiv>
  );
}
