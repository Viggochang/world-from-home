import React from "react";
import styled from "styled-components";

const RemovePageDiv = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: -40px;
  font-size: 18px;
  color: #3a4a58;
  line-height: 30px;
  cursor: pointer;
  :hover {
    background-color: rgb(255, 255, 255, 0.4);
  }
`;

export default function RemovePage({
  removePageRef,
  index,
  page,
  handleRemovePage,
}) {
  return (
    <RemovePageDiv
      ref={(el) => (removePageRef.current[index] = el)}
      onClick={(e) => handleRemovePage(e, page)}
    >
      <i className="fas fa-trash-alt" />
    </RemovePageDiv>
  );
}
