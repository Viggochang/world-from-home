import React from "react";
import styled from "styled-components";

const MyButton = styled.div`
  background-color: #fff;
  color: #3a4a58;
  border: 3px #3a4a58 solid;
  font-size: 30px;

  align-items: center;
  appearance: none;
  border-radius: 30px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 3px 5px -1px,
    rgba(0, 0, 0, 0.14) 0 6px 10px 0, rgba(0, 0, 0, 0.12) 0 1px 18px 0;
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  fill: currentcolor;
  font-family: "Google Sans", Roboto, Arial, sans-serif;
  font-weight: bold;
  /* height: 48px; */
  justify-content: center;
  letter-spacing: 0.25px;
  line-height: 1.5;
  max-width: 100%;
  overflow: visible;
  padding: 2px 24px;
  position: relative;
  text-align: center;
  text-transform: none;
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, 0.2, 1) 0ms;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  width: auto;
  will-change: transform, opacity;
  z-index: 0;
  :hover {
    background: #f6f9fe;
    box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.2);
  }
  :active {
    box-shadow: 0 4px 4px 0 rgb(60 64 67 / 30%),
      0 8px 12px 6px rgb(60 64 67 / 15%);
    outline: none;
  }
  :focus {
    outline: none;
    border: 2px solid #4285f4;
  }
`;

export default function button({ text, style, onClick }) {
  return (
    <MyButton style={style} onClick={onClick}>
      {text}
    </MyButton>
  );
}

// .button-17:not(:disabled) {
//   box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
// }

// .button-17:not(:disabled):hover {
//   box-shadow: rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px;
// }

// .button-17:not(:disabled):focus {
//   box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
// }

// .button-17:not(:disabled):active {
//   box-shadow: rgba(60, 64, 67, .3) 0 4px 4px 0, rgba(60, 64, 67, .15) 0 8px 12px 6px;
// }

// .button-17:disabled {
//   box-shadow: rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px;
// }
