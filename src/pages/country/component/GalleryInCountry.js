import React from 'react';
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { useSelector } from "react-redux";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
    },
  },
});

const GalleryBackgroundDiv = styled.div`
  width: calc(65% - 80px);
  height: calc(57% - 40px);
  background-color: #e0e0e0;
  padding: 20px;
  display: flex;
`;

export default function GalleryInCountry({galleryQuestionRef}) {
  const targetCountry = useSelector((state) => state.targetCountry);

  function handleGalleryQuestion(){
    galleryQuestionRef.current.style.display = 'flex';
  }

  return (
    <GalleryBackgroundDiv>
      <ThemeProvider theme={theme}>
        <Button
          variant="outlined"
          color="primary"
          style={{
            lineHeight: 1.5,
            fontSize: "36px",
            margin: 'auto'
          }}
          onClick={handleGalleryQuestion}
        >+&emsp; add my&emsp; <b>{targetCountry.name}</b>
        </Button>
      </ThemeProvider>

    </GalleryBackgroundDiv>
  )
}
