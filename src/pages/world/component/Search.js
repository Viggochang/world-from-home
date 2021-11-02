import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as am4core from "@amcharts/amcharts4/core";
import styled from "styled-components";
import InputBase from "@mui/material/InputBase";
import countryTrans from "../../../util/countryTrans";

const SearchDiv = styled.div`
  position: absolute;
  top: 40px;
  right: 160px;
  width: 200px;
  height: 40px;
  outline: 4px #b8c3d0 solid;
  border-radius: 22px;
  padding: 0 40px 0 10px;
  background-color: rgb(255, 255, 255, 0.8);
  margin-left: 20px;
  display: flex;
`;
const SearchIconDiv = styled.div`
  font-size: 20px;
  position: absolute;
  right: 10px;
  top: calc(50% - 10px);
  color: #667484;
  cursor: pointer;
  :hover {
    color: #3a4a58;
  }
`;

const Inputdiv = styled.input`
  :focus {
    outline: none;
  }
`;

export default function Search({
  setMaskOpacity,
  setMaskVisibility,
  map,
  setCurrentActive,
}) {
  const searchRef = useRef();
  const dispatch = useDispatch();
  const [country2id, setCountry2id] = useState({});
  const polygonSeries = useSelector((state) => state.polygonSeries); //test

  useEffect(() => {
    const country2id = Object.entries(countryTrans).reduce(
      (acc, [key, { name_en }]) => {
        acc[name_en] = key;
        return acc;
      },
      {}
    );
    setCountry2id(country2id);
  }, []);

  function handleSearch() {
    if (country2id[searchRef.current.value]) {
      const currentActiveCountry = polygonSeries.mapPolygons.values.filter(
        (country) =>
          country.dataItem.dataContext.id ===
          country2id[searchRef.current.value]
      )[0];
      currentActiveCountry.isActive = true;
      map.zoomToMapObject(currentActiveCountry);
      setMaskOpacity(0.8);
      setMaskVisibility("visible");

      dispatch({
        type: "SET_TARGET_COUNTRY",
        payload: currentActiveCountry.dataItem.dataContext,
      });
      setCurrentActive(currentActiveCountry);
      searchRef.current.value = "";
    } else {
      searchRef.current.parentNode.style.outline = "4px #AE0000 solid";
    }
  }

  return (
    <SearchDiv>
      <Inputdiv
        list="country-choice"
        id="ice-cream-choice"
        name="ice-cream-choice"
        placeholder="Discover the world"
        style={{
          border: "none",
          background: "none",
          color: "#3A4A58",
          width: "100%",
        }}
        ref={searchRef}
        onChange={(e) => {
          e.target.parentNode.style.outline = "4px #b8c3d0 solid";
        }}
      />
      <SearchIconDiv onClick={handleSearch}>
        <i className="fas fa-search"></i>
      </SearchIconDiv>

      <datalist id="country-choice">
        {Object.values(countryTrans)
          .filter((country) => country.country !== "AQ")
          .map((country) => (
            <option key={country.country} value={country.name_en} />
          ))}
      </datalist>
    </SearchDiv>
  );
}
