import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import * as am4core from "@amcharts/amcharts4/core";
import styled from "styled-components";
import InputBase from "@mui/material/InputBase";
import countryTrans from "../../../util/countryTrans";

const SearchDiv = styled.div`
  position: absolute;
  top: 50px;
  right: 140px;
  width: 200px;
  height: 40px;
  outline: 2px #b8c3d0 solid;
  border-radius: 22px;
  padding: 0 40px 0 10px;
  background-color: rgb(102, 116, 132, 0.8);
  margin-left: 20px;
  display: flex;
  z-index: 1;
`;
const SearchIconDiv = styled.div`
  font-size: 15px;
  position: absolute;
  right: 10px;
  top: calc(50% - 9px);
  color: #b8c3d0;
  cursor: pointer;
  :hover {
    color: white;
  }
`;

const Inputdiv = styled.input`
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #b8c3d0;
  }
`;

export default function Search({
  setMaskOpacity,
  setMaskVisibility,
  map,
  setCurrentActive,
  mapType,
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

  function handleEnter(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

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
    <SearchDiv
      style={{ display: mapType ? "flex" : "none" }}
      onKeyDown={handleEnter}
    >
      <Inputdiv
        list="country-choice"
        id="search-country"
        name="search-country"
        placeholder="Discover the world"
        style={{
          border: "none",
          background: "none",
          color: "#B8C3D0",
          width: "100%",
        }}
        ref={searchRef}
        onChange={(e) => {
          e.target.parentNode.style.outline = "4px #b8c3d0 solid";
        }}
      />
      <datalist id="country-choice">
        {Object.values(countryTrans)
          .filter((country) => country.country !== "AQ")
          .map((country) => (
            <option key={country.country} value={country.name_en} />
          ))}
      </datalist>
      <SearchIconDiv onClick={handleSearch}>
        <i className="fas fa-search"></i>
      </SearchIconDiv>
    </SearchDiv>
  );
}
