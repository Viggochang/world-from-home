import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import styled from "styled-components";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Switch } from "@mui/material";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { primaryPaletteTheme } from "../../../util/muiTheme";

import { db_gallery } from "../../../util/firebase";
import countryTrans from "../../../util/countryTrans";

const theme = createTheme({
  status: {
    danger: "#e53e3e",
  },
  palette: {
    primary: {
      main: "#3A4A58",
      darker: "#053e85",
      font: "#ffffff",
    },
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
    white: {
      main: "#ffffff",
      font: "#3A4A58",
    },
  },
});

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
  width: "150px",
  marginLeft: "30px",
};

const EditLabel = styled.div`
  font-weight: bold;
  font-size: 20px;
  padding: 0 12px;
  line-height: 30px;
  border-radius: 15px;
  background-color: rgb(255, 255, 255, 0.7);
`;

const ContentDiv = styled.div`
  /* outline: 2px #3a4a58 solid; */
  padding: 10px 30px 30px;
  margin-top: 15px;
  width: calc(100% - 60px);
  max-height: calc(100vh - 170px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgb(255, 255, 255, 0.5);
  border-radius: 10px;
  /* overflow: scroll; */
`;

const ContentDivInner = styled.div`
  margin-top: 10px;
  padding: 20px 40px 0 20px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
`;

const EditingSwitchDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-left: auto;
`;

const AlbumDiv = styled.div`
  display: flex;
  margin-bottom: 30px;
`;
const AlbumCoverDiv = styled.div`
  width: 280px;
  height: 210px;
  box-shadow: 0px 0px 20px #4f4f4f;
  cursor: pointer;
`;

const AlbumInfo = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
  color: #3a4a58;
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

const NoAlbumsDiv = styled.div`
  font-size: 36px;
  font-weight: bold;
  margin: auto;
  padding-bottom: 30px;
  color: #3a4a58;
`;

export default function MyGallery({ title, id, isMyPage }) {
  // const userInfo = useSelector((state) => state.userInfo);
  const [albumData, setAlbumData] = useState([]);
  const [albumDataFilter, setAlbumDataFilter] = useState([]);
  const [albumCountry, setAlbumCountry] = useState("All");
  const [albumOrder, setAlbumOrder] = useState("New");
  const [pending, setPending] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const order = {
    New: (a, b) => b.timestamp.seconds - a.timestamp.seconds,
    Old: (a, b) => a.timestamp.seconds - b.timestamp.seconds,
    Popular: (a, b) => b.praise.length - a.praise.length,
    Unpopular: (a, b) => a.praise.length - b.praise.length,
  };

  useEffect(() => {
    setAlbumCountry("All");
    setAlbumOrder("New");
  }, [pending]);

  useEffect(() => {
    if (id) {
      let unsubscribe = db_gallery
        .where("user_id", "==", id)
        .onSnapshot((querySnapshot) => {
          setAlbumData(querySnapshot.docs.map((doc) => doc.data()));
        });
      return () => {
        unsubscribe();
      };
    }
  }, [id]);

  useEffect(() => {
    console.log(pending);
    setAlbumDataFilter(
      albumData
        .filter(
          ({ condition }) => condition === (pending ? "pending" : "completed")
        )
        .filter(
          ({ country }) => albumCountry === "All" || country === albumCountry
        )
        .sort(order[albumOrder])
    );
  }, [albumData, pending, albumCountry, albumOrder]);

  const handleAlbumCountry = (event) => {
    setAlbumCountry(event.target.value);
  };

  const handleAlbumOrder = (event) => {
    setAlbumOrder(event.target.value);
  };

  // console.log(albumDataFilter);
  function handleShowAlbumId(key, value) {
    let params = new URL(window.location).searchParams;
    params.append(key, value);
    history.push({ search: params.toString() });
    dispatch({
      type: "SET_ALBUM_ID_SHOW",
      payload: value,
    });
  }

  return (
    <MyGalleryContentDiv>
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
              onChange={handleAlbumCountry}
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
                <MenuItem
                  key={country}
                  value={country}
                  sx={{ color: "#3a4a58" }}
                >
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
              onChange={handleAlbumOrder}
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
      {/* <ContentDiv style={{height:`${240*myWorldDataFilter.length-30}px`}}> */}
      <ContentDiv>
        <ThemeProvider theme={theme}>
          <EditingSwitchDiv style={{ display: isMyPage ? "flex" : "none" }}>
            <EditLabel
              style={{
                color: "white",
                backgroundColor: pending ? "#adadad" : "rgb(58, 74, 88)",
              }}
            >
              complete
            </EditLabel>
            <Switch
              checked={pending}
              onChange={() => setPending(!pending)}
              name="pending"
              color="white"
              // style={{ width: "100px" }}
            />
            <EditLabel
              style={{
                color: "white",
                backgroundColor: pending ? "rgb(59, 74, 88)" : "#adadad",
              }}
            >
              editing
            </EditLabel>
          </EditingSwitchDiv>
        </ThemeProvider>
        <ContentDivInner>
          {albumDataFilter.length ? (
            albumDataFilter.map((album, index) => (
              <AlbumDiv key={album.id}>
                <AlbumCoverDiv
                  style={{
                    background: `url(${album.cover_photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => handleShowAlbumId("album_id_show", album.id)}
                ></AlbumCoverDiv>
                <AlbumInfo>
                  <AlbumCountry>
                    {countryTrans[album.country].name_en}
                  </AlbumCountry>
                  <AlbumPosition>
                    <i className="fas fa-map-pin"></i> {album.position}
                  </AlbumPosition>
                  <AlbumIntroduction>{album.introduction}</AlbumIntroduction>
                  <AlbumTime>
                    <i className="far fa-calendar-alt"></i>{" "}
                    {new Date(album.timestamp.seconds * 1000).toDateString()}
                  </AlbumTime>
                  <AlbumPraise>
                    <i className="fas fa-heart"></i> {album.praise.length}
                  </AlbumPraise>
                </AlbumInfo>
              </AlbumDiv>
            ))
          ) : (
            <NoAlbumsDiv>No Albums！</NoAlbumsDiv>
          )}
        </ContentDivInner>
      </ContentDiv>
    </MyGalleryContentDiv>
  );
}
