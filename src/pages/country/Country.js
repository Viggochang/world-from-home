import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import CountryShape from "./countryShape/CountryShape";
import CountryAlbums from "./countryAlbum/CountryAlbums";
import CountryInfo from "./countryInfo/CountryInfo";
import CountryFriend from "./countryFriend/CountryFriend";
import InfoFriendSmall from "./InfoFriendSmall/InfoFriendSmall";

import { getFriendsHere } from "../../util/firebase";

const CountryDiv = styled.div`
  width: calc(90% - 120px);
  height: calc(85% - 80px);
  padding: 60px 60px 20px;
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

const countryCaptalCityApi = (countryId) =>
  `https://api.worldbank.org/v2/country/${countryId}?format=json`;
const weatherApi = (capitalCity) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&appid=${process.env.REACT_APP_OPENWEATHERMAP_APPID}&units=metric`;

function Country({ style, handleClickBack, signinRef }) {
  const targetCountry = useSelector((state) => state.targetCountry);

  const [captain, setCaptain] = useState({});
  const [timezone, setTimezone] = useState(0);
  const [weather, setWeather] = useState({});
  const [friendHere, setFriendHere] = useState([]);
  const myUserInfo = useSelector((state) => state.userInfo);

  useEffect(() => {
    // async function fetchCountryCaptalCityApi() {
    //   const result = (
    //     await fetch(countryCaptalCityApi(targetCountry.id))
    //   ).json()[1];
    //   console.log((await fetch(countryCaptalCityApi(targetCountry.id))).json());
    //   let capitalCity = null;
    //   if (targetCountry.id === "TW") {
    //     setCaptain({
    //       capitalCity: "Taipei",
    //       longitude: 121.5,
    //       latitude: 25.04,
    //     });
    //     capitalCity = "Taipei";
    //   } else if (result) {
    //     const { longitude, latitude } = result[0];
    //     capitalCity = result[0].capitalCity;
    //     setCaptain({ capitalCity, longitude, latitude });
    //   }
    //   console.log(capitalCity);
    //   if (capitalCity) {
    //     const weatherData = (await fetch(weatherApi(capitalCity))).json();
    //     setTimezone(weatherData.timezone || "No Data");
    //     setWeather({
    //       temp: weatherData.main ? weatherData.main.temp : "No Data",
    //       weather: weatherData.weather
    //         ? weatherData.weather[0].description
    //         : "No Data",
    //     });
    //   }
    // }
    // fetchCountryCaptalCityApi();

    fetch(countryCaptalCityApi(targetCountry.id))
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
          setCaptain({ capitalCity, longitude, latitude });
          return capitalCity;
        } else {
          return null;
        }
      })
      .then((capitalCity) => {
        if (capitalCity) {
          fetch(weatherApi(capitalCity))
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
    if (myUserInfo.id && targetCountry.id) {
      const myFriendList = myUserInfo.friends.filter(
        (friend) => friend.condition === "confirmed"
      );

      function createUserHereArr(allAlbums) {
        return allAlbums
          .filter((album) => album.condition === "completed")
          .map((album) => album.user_id);
      }

      getFriendsHere(targetCountry.id, (allAlbums) => {
        setFriendHere(
          myFriendList.filter((friend) =>
            createUserHereArr(allAlbums).includes(friend.id)
          )
        );
      });
    }
  }, [myUserInfo, targetCountry]);

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
