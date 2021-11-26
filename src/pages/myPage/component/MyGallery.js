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

import { onSnapshotAlbumByUserId } from "../../../util/firebase";
import countryTrans from "../../../util/countryTrans";
import AlbumInfo from "./MyGallery_info";

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
  @media (max-width: 932px) {
    width: calc(100% - 60px);
    margin-left: 0;
  }
  @media (max-width: 640px) {
    width: 100%;
  }
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
  @media (max-width: 932px) {
    flex-direction: column;
    align-items: center;
  }
  @media (max-width: 640px) {
    padding: 10px 10px 0;
    width: calc(100% - 20px);
  }
`;

const ContentDivInner = styled.div`
  margin-top: 10px;
  padding: 20px 40px 0 20px;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  @media (max-width: 1180px) {
    width: calc(100% - 60px);
    align-items: center;
  }
  @media (max-width: 640px) {
    padding: 10px 10px 0 10px;
  }
`;

const EditingSwitchDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  margin-left: auto;
  @media (max-width: 450px) {
    margin-left: 0;
    justify-content: center;
  }
`;

const EditLabel = styled.div`
  font-weight: bold;
  font-size: 20px;
  padding: 0 12px;
  line-height: 30px;
  border-radius: 15px;
  background-color: rgb(255, 255, 255, 0.7);
  @media (max-width: 450px) {
    font-size: 14px;
  }
`;

const AlbumDiv = styled.div`
  display: flex;
  margin-bottom: 30px;
  @media (max-width: 1180px) {
    width: 100%;
    max-width: 400px;
    flex-direction: column;
  }
`;
const AlbumCoverDiv = styled.div`
  width: 280px;
  height: 210px;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  cursor: pointer;
  @media (max-width: 1180px) {
    width: 100%;
    margin-top: 15px;
  }
`;

const AlbumInfoTop = styled.div`
  display: none;
  width: 100%;
  @media (max-width: 1180px) {
    display: block;
  }
`;

const AlbumInfoRight = styled.div`
  width: calc(100% - 310px);
  @media (max-width: 1180px) {
    display: none;
  }
`;

// const AlbumInfo = styled.div`
//   margin-left: 30px;
//   display: flex;
//   flex-direction: column;
//   color: #3a4a58;
//   width: calc(100% - 310px);
//   height: 210px;
//   position: relative;
//   @media (max-width: 1180px) {
//     display: none;
//   }
// `;
// const AlbumCountry = styled.div`
//   font-size: 48px;
//   font-weight: bold;
//   @media (max-width: 1400px) {
//     font-size: 30px;
//   }
// `;
// const AlbumPosition = styled.div`
//   font-size: 30px;
//   line-height: 48px;
//   @media (max-width: 1400px) {
//     font-size: 20px;
//     line-height: 36px;
//   }
// `;
// const AlbumIntroduction = styled.div`
//   margin-top: 10px;
//   overflow: scroll;
//   height: calc(100% - 103px);
//   @media (max-width: 1400px) {
//     font-size: 14px;
//   }
// `;
// const AlbumDate = styled.div`
//   position: absolute;
//   top: 0;
//   right: 0;
//   @media (max-width: 1400px) {
//     font-size: 14px;
//   }
//   @media (max-width: 1260px) {
//     display: none;
//   }
// `;
// const AlbumPraise = styled.div`
//   position: absolute;
//   top: 80px;
//   right: 0;
//   @media (max-width: 1400px) {
//     top: 45px;
//   }
// `;

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
      const unsubscribe = onSnapshotAlbumByUserId(id, setAlbumData);
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
            albumDataFilter.map((album) => (
              <AlbumDiv key={album.id}>
                <AlbumInfoTop>
                  <AlbumInfo album={album} />
                </AlbumInfoTop>
                <AlbumCoverDiv
                  style={{
                    background: `url(${album.cover_photo})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  onClick={() => handleShowAlbumId("album_id_show", album.id)}
                ></AlbumCoverDiv>
                <AlbumInfoRight>
                  <AlbumInfo album={album} />
                </AlbumInfoRight>
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
