import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { db_gallery } from "../../../util/firebase";
import countryTrans from "../../../util/countryTrans";

const MyGalleryContentDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 50px;
  width: calc(100% - 320px);
`;

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
`;

const selectStyle = {
  width: "200px",
  marginLeft: "30px",
  backgroundColor: "rgb(255,255,255,0.7)",
};

const ContentDiv = styled.div`
  outline: 2px #3a4a58 solid;
  padding: 30px 30px 0;
  margin-top: 15px;
  width: calc(100% - 60px);
  max-height: calc(100vh - 170px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgb(255,255,255, 0.5);
  overflow: scroll;
`;

const AlbumDiv = styled.div`
  display: flex;
  margin-bottom: 30px;
`;
const AlbumCoverDiv = styled.div`
  width: 280px;
  height: 210px;
  box-shadow: 0px 0px 20px #4F4F4F;
  cursor: pointer;
`;

const AlbumInfo = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  color: #3A4A58;
  width: calc(100% - 310px);
  height: 210px;
  position: relative;
`;
const AlbumCountry = styled.div`
  font-size: 48px;
  font-weight: bold;
`;
const AlbumPosition = styled.div`
  font-size: 36px;
  line-height: 48px;
`;
const AlbumIntroduction = styled.div`
  margin-top: 10px;
  overflow: scroll;
  height: calc(100% - 103px);
`;
const AlbumTime = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;
const AlbumPraise = styled.div`
  position: absolute;
  top: 80px;
  right: 0;
`;

export default function MyGallery({title}) {
  const userInfo = useSelector((state) => state.userInfo);
  const [myWorldData, setMyWorldData] = useState([]);
  const [myWorldDataFilter, setMyWorldDataFilter] = useState([]);
  const [albumCountry, setAlbumCountry] = useState("All");
  const [albumOrder, setAlbumOrder] = useState("New");

  const { id } = userInfo;
  const order = {
    New: (a, b) => b.timestamp.seconds - a.timestamp.seconds,
    Old: (a, b) => a.timestamp.seconds - b.timestamp.seconds,
    Popular: (a, b) => b.praise.length - a.praise.length,
    Unpopular: (a, b) => a.praise.length - b.praise.length,
  }

  useEffect(() => {
    if (id){
      db_gallery
        .where("user_id", "==", id)
        .get()
        .then((querySnapshot) => {
          setMyWorldData(querySnapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [id]);

  useEffect(() => {
    setMyWorldDataFilter(
      myWorldData
      .filter(({country}) => albumCountry==='All' || country===albumCountry)
      .sort(order[albumOrder])
    )
  }, [myWorldData, albumCountry, albumOrder])

  const handleAlbumCountry = (event) => {
    setAlbumCountry(event.target.value);
  };

  const handleAlbumOrder = (event) => {
    setAlbumOrder(event.target.value);
  };

  return (
    <MyGalleryContentDiv>
      <FilterDiv>
        <Title>{title}</Title>
        <FormControl fullWidth variant="filled" style={selectStyle}>
          <InputLabel id="album-country-label">Country</InputLabel>
          <Select
            labelId="album-country-label"
            id="album-country"
            value={albumCountry}
            label="Country"
            onChange={handleAlbumCountry}
          >
            <MenuItem value={"All"}>All</MenuItem>
            {Array.from(new Set(myWorldData.map(({ country }) => country))).map(
              (country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth variant="filled" style={selectStyle}>
          <InputLabel id="album-order-label">Order</InputLabel>
          <Select
            labelId="album-order-label"
            id="album-order"
            value={albumOrder}
            label="Order"
            onChange={handleAlbumOrder}
          >
            <MenuItem value={"New"}>New</MenuItem>            
            <MenuItem value={"Old"}>Old</MenuItem>
            <MenuItem value={"Popular"}>Popular</MenuItem>
            <MenuItem value={"Unpopular"}>Unpopular</MenuItem>
          </Select>
        </FormControl>
      </FilterDiv>
      {/* <ContentDiv style={{height:`${240*myWorldDataFilter.length-30}px`}}> */}
      <ContentDiv>
        {myWorldDataFilter.map((data, index) => (
          <AlbumDiv key={index}>
            <AlbumCoverDiv
              key={data.id}
              style={{
                background: `url(${data.cover_photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></AlbumCoverDiv>
            <AlbumInfo>
              <AlbumCountry>{countryTrans[data.country].name_en}</AlbumCountry>
              <AlbumPosition><i className="fas fa-map-pin"></i> {data.position}</AlbumPosition>
              <AlbumIntroduction>{data.introduction}</AlbumIntroduction>
              <AlbumTime><i className="far fa-calendar-alt"></i> {new Date(data.timestamp.seconds*1000).toDateString()}</AlbumTime>
              <AlbumPraise><i className="fas fa-heart"></i> {data.praise.length}</AlbumPraise>
            </AlbumInfo>
          </AlbumDiv>
        ))}
      </ContentDiv>
    </MyGalleryContentDiv>
  );
}
