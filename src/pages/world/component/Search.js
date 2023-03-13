import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
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
  display: ${(props) => (props.type === "true" ? "flex" : "none")};
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
  border: none;
  background: none;
  color: #b8c3d0;
  width: 100%;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #b8c3d0;
  }
`;

export default function Search({ map, mapType, showCountry }) {
  const searchRef = useRef();
  const [search, setSearch] = useState("");
  const polygonSeries = useSelector((state) => state.polygonSeries);

  const country2id = Object.entries(countryTrans).reduce(
    (acc, [key, { name_en }]) => {
      acc[name_en] = key;
      return acc;
    },
    {}
  );

  function handleEnter(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  function handleSearch(search) {
    if (country2id[search]) {
      const currentActiveCountry = polygonSeries.mapPolygons.values.filter(
        (country) => country.dataItem.dataContext.id === country2id[search]
      )[0];
      showCountry(currentActiveCountry);
      map.zoomToMapObject(currentActiveCountry);
    } else {
      searchRef.current.parentNode.style.outline = "4px #AE0000 solid";
    }
  }

  return (
    <SearchDiv type={mapType.toString()} onKeyDown={handleEnter}>
      <Inputdiv
        list="country-choice"
        id="search-country"
        name="search-country"
        placeholder="Discover the world"
        value={search}
        ref={searchRef}
        onChange={(e) => {
          e.target.parentNode.style.outline = "4px #b8c3d0 solid";
          setSearch(e.target.value);
          handleSearch(e.target.value);
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
        <i className="fas fa-search" />
      </SearchIconDiv>
    </SearchDiv>
  );
}
