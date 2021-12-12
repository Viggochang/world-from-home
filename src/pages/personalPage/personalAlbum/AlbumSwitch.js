import React from "react";
import styled from "styled-components";

import { ThemeProvider } from "@material-ui/core/styles";
import { whiteBtnTheme } from "../../../util/muiTheme";
import { Switch } from "@mui/material";

const EditingSwitchDiv = styled.div`
  display: ${(props) => (props.display === "true" ? "flex" : "none")};
  align-items: center;
  margin-top: 10px;
  margin-left: auto;
  @media (max-width: 450px) {
    margin-left: 0;
    justify-content: center;
  }
`;

const AlbumStatusLabel = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: white;
  padding: 0 12px;
  line-height: 30px;
  border-radius: 15px;
  background-color: rgb(255, 255, 255, 0.7);
  @media (max-width: 450px) {
    font-size: 14px;
  }
`;
const EditingLabel = styled(AlbumStatusLabel)`
  background-color: ${(props) =>
    props.pending ? "#adadad" : "rgb(58, 74, 88)"};
`;
const CompleteLabel = styled(AlbumStatusLabel)`
  background-color: ${(props) =>
    props.pending ? "rgb(59, 74, 88)" : "#adadad"};
`;

export default function AlbumSwitch({ pending, setPending, isMyPage }) {
  return (
    <ThemeProvider theme={whiteBtnTheme}>
      <EditingSwitchDiv display={isMyPage.toString()}>
        <EditingLabel pending={pending}>complete</EditingLabel>
        <Switch
          checked={pending}
          onChange={() => setPending(!pending)}
          name="pending"
          color="white"
        />
        <CompleteLabel pending={pending}>editing</CompleteLabel>
      </EditingSwitchDiv>
    </ThemeProvider>
  );
}
