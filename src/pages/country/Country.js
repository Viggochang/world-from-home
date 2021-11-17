import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import CountryShape from "./country_shape/CountryShape";
import CountryAlbums from "./component/country_album/CountryAlbums";
import CountryInfo from "./component/CountryInfo";
import CountryFriend from "./component/CountryFriend";
import InfoFriendSmall from "./InfoFriendSmall/InfoFriendSmall";
import CountryInfoPopup from "./component/countryInfo/CountryInfoPopup";
import countryFriendPopup from "./component/countryFriend/CountryFriendPopup";

import { db_userInfo } from "../../util/firebase";

const CountryDiv = styled.div`
  width: calc(90% - 120px);
  height: calc(85% - 80px);
  padding: 60px 60px 20px;
  /* background-color: rgba(63, 63, 63, 1); */
  position: fixed;
  top: 5%;
  left: 5%;
  z-index: 2;
  transition: background-color 0.5s, visibility 0.5s, opacity 0.5s;
  transition-delay: 1s;
  display: flex;
  flex-wrap: wrap;
  border-radius: 10px;
  @media (max-width: 1180px) {
    width: calc(90% - 60px);
    height: calc(85% - 50px);
    padding: 30px 30px 20px;
  }
  @media (max-width: 600px) {
    height: calc(85% - 30px);
    padding: 10px 30px 20px;
    flex-direction: column;
    justify-content: flex-start;
    top: 8%;
  }
`;

const InfoFriendDiv = styled.div`
  margin-top: 20px;
  height: calc(43% - 20px);
  width: 100%;
  display: flex;
  flex-direction: row;
  @media (max-width: 1180px) {
    display: none;
  }
  @media (max-height: 1120px) {
    margin-top: 0;
    height: 43%;
  }
  /* @media (max-width: 1040px) {
    flex-direction: column;
  }
  @media (max-width: 630px) {
    width: 100%;
  } */
`;

const BackDiv = styled.div`
  position: absolute;
  top: 15px;
  right: 20px;
  color: #9d9d9d;
  font-weight: bold;
  font-size: 28px;
  cursor: pointer;
  :hover {
    color: white;
  }
`;

function Country({ style, handleClickBack, signinRef }) {
  const targetCountry = useSelector((state) => state.targetCountry);

  const [captain, setCaptain] = useState({});
  const [timezone, setTimezone] = useState(0);
  const [weather, setWeather] = useState({});
  const [friendHere, setFriendHere] = useState([]);
  const id = useSelector((state) => state.myUserId);

  useEffect(() => {
    fetch(
      `https://api.worldbank.org/v2/country/${targetCountry.id}?format=json`
    )
      .then((res) => res.json())
      .then((res) => {
        if (targetCountry.id === "TW") {
          setCaptain({
            capitalCity: "Taipei",
            longitude: 121.5,
            latitude: 25.04,
          });
          return "Taipei";
        } else if (res[1]) {
          const { capitalCity, longitude, latitude } = res[1][0];
          console.log(capitalCity, longitude, latitude);
          setCaptain({ capitalCity, longitude, latitude });
          return capitalCity;
        } else {
          return null;
        }
      })
      .then((capitalCity) => {
        if (capitalCity) {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&appid=4768302d866115e64f3205b3939e2f19&units=metric`
          )
            .then((res) => res.json())
            .then((res) => {
              setTimezone(res.timezone || "No Data");
              setWeather({
                temp: res.main ? res.main.temp : "No Data",
                weather: res.weather ? res.weather[0].description : "No Data",
              });
            });
        }
      });
  }, [targetCountry]);

  useEffect(() => {
    if (id) {
      db_userInfo
        .where("friends", "array-contains", { id: id, condition: "confirmed" })
        .get()
        .then((querySnapshot) => {
          return querySnapshot.docs;
        })
        .then((friendList) => {
          setFriendHere(
            friendList
              .filter((friend) =>
                friend.data().travel_country.includes(targetCountry.id)
              )
              .map((friend) => {
                const { photo, id, name, country } = friend.data();
                return { photo, id, name, country };
              })
          );
        });
    }
  }, [id, targetCountry]);

  return (
    <CountryDiv style={style}>
      <CountryShape />
      <CountryAlbums signinRef={signinRef} />
      <InfoFriendDiv>
        <CountryInfo captain={captain} weather={weather} timezone={timezone} />
        <CountryFriend friendHere={friendHere} />
      </InfoFriendDiv>
      <InfoFriendSmall
        captain={captain}
        weather={weather}
        timezone={timezone}
        friendHere={friendHere}
      />
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times-circle" />
      </BackDiv>
    </CountryDiv>
  );
}

export default Country;
