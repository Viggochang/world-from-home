import React, { useEffect } from "react";
import styled from "styled-components";

import countryTrans from "../../../util/countryTrans";
import { primaryPaletteTheme } from "../../../util/muiTheme";

import { ThemeProvider } from "@material-ui/core/styles";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const FilterDiv = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  width: 100%;
`;

const Title = styled.div`
  color: white;
  font-size: 48px;
  font-weight: bold;
  margin-right: auto;
  @media (max-width: 1180px) {
    font-size: 30px;
  }
  @media (max-width: 640px) {
    display: none;
  }
`;

const selectStyle = {
  width: "150px",
  marginLeft: "30px",
};

export default function AlbumFilter({
  title,
  pending,
  albumData,
  albumCountry,
  albumOrder,
  setAlbumCountry,
  setAlbumOrder,
}) {
  useEffect(() => {
    setAlbumCountry("All");
    setAlbumOrder("New");
  }, [pending]);

  function handleSetState(event, setState) {
    setState(event.target.value);
  }

  return (
    <FilterDiv>
      <Title>{title}</Title>
      <ThemeProvider theme={primaryPaletteTheme}>
        <FormControl variant="filled" style={selectStyle}>
          <InputLabel id="album-country-label">Country</InputLabel>
          <Select
            labelId="album-country-label"
            id="album-country"
            value={albumCountry}
            label="Country"
            color="primary"
            style={{
              color: "#3A4A58",
              backgroundColor: "rgb(255,255,255,0.6)",
            }}
            onChange={(e) => handleSetState(e, setAlbumCountry)}
          >
            <MenuItem value={"All"} sx={{ color: "#3a4a58" }}>
              All
            </MenuItem>

            {Array.from(
              new Set(
                albumData
                  .filter(
                    ({ condition }) =>
                      condition === (pending ? "pending" : "completed")
                  )
                  .map((data) => data.country)
              )
            ).map((country) => (
              <MenuItem key={country} value={country} sx={{ color: "#3a4a58" }}>
                {countryTrans[country].name_en}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="filled" style={selectStyle}>
          <InputLabel id="album-order-label">Order</InputLabel>
          <Select
            labelId="album-order-label"
            id="album-order"
            value={albumOrder}
            label="Order"
            style={{
              color: "#3A4A58",
              backgroundColor: "rgb(255,255,255,0.6)",
            }}
            onChange={(e) => handleSetState(e, setAlbumOrder)}
          >
            {["New", "Old", "Popular", "Unpopular"].map((order, index) => (
              <MenuItem key={index} sx={{ color: "#3a4a58" }} value={order}>
                {order}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ThemeProvider>
    </FilterDiv>
  );
}
