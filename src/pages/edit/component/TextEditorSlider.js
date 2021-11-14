import React, { useState, useEffect } from "react";
import styled from "styled-components";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { primaryPaletteTheme } from "../../../util/muiTheme";
import { ThemeProvider } from "@material-ui/core/styles";

const TextEditorDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ShowValue = styled.div`
  color: #3a4a58;
  display: flex;
  align-items: center;
  padding-bottom: 5px;
  margin-right: 20px;
`;

const ValueInput = styled.input`
  color: #3a4a58;
  width: 30px;
  border: none;
  :focus {
    border: none;
  }
`;

export default function TextEditorSlider({
  defaultVal,
  min,
  max,
  step,
  type,
  handleFontStyleChange,
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(Number(defaultVal));
  }, [defaultVal]);

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? 0 : Number(event.target.value));
  };

  return (
    <TextEditorDiv>
      <ThemeProvider theme={primaryPaletteTheme}>
        <Box sx={{ width: 180 }}>
          <Slider
            aria-label="Temperature"
            value={typeof value === "number" ? value : 0}
            onChange={(e, value) => {
              setValue(value);
              handleFontStyleChange(value, type);
            }}
            color="primary"
            min={min}
            max={max}
            step={step}
          />
        </Box>
      </ThemeProvider>
      <ShowValue>{value}</ShowValue>
      {/* <ValueInput value={value} onChange={handleInputChange}></ValueInput> */}
    </TextEditorDiv>
  );
}
