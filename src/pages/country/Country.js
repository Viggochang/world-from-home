import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import CountryShape from "./component/CountryShape";
import CountryClock from "./component/CountryClock";
import Weather from "./component/Weather";
import GalleryInCountry from "./component/GalleryInCountry";

import { db_userInfo } from "../../util/firebase";

const CountryDiv = styled.div`
  width: calc(90% - 160px);
  height: calc(90% - 160px);
  padding: 60px 60px 30px;
  /* background-color: rgba(63, 63, 63, 1); */
  position: fixed;
  top: 5%;
  left: 5%;
  z-index: 2;
  transition: background-color 0.5s, visibility 0.5s, opacity 0.5s;
  transition-delay: 1s;
  justify-content: space-between;
  flex-wrap: wrap;
`;

// const FrameDiv = styled.div`
//   width: 35%;
//   height: 57%;
//   border: 1px white solid;
//   position: relative;
// `;

const CountryInfoDiv = styled.div`
  width: calc(50% - 60px);
  height: calc(43% - 100px);
  /* border: 1px white solid; */
  padding: 20px;
  color: white;
  display: flex;
`;

const LeftDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const CaptainTitleDiv = styled.div`
  width: 320px;
  outline: 1px white solid;
  font-size: 32px;
  line-height: 50px;
  border-radius: 25px;
  text-align: center;
`;

const CaptainCity = styled.div`
  margin: 20px 0 0 20px;
  font-size: 50px;
  font-weight: bold;
  text-align: left;
`;

const FriendsContainerDiv = styled.div`
  width: calc(50% - 20px);
  height: calc(43% - 60px);
  /* border: 1px white solid; */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const OtherGalleryDiv = styled.div`
  width: 80%;
  height: 25%;
  margin-bottom: 10px;
  border: 1px white solid;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
  font-weight: bold;
  cursor: pointer;
`;

const TitleDiv = styled.div`
  font-size: 35px;
  color: white;
  font-weight: bold;
  padding: 10px 0;
  margin-right: auto;
`;

const MyFriends = styled.div`
  width: 100%;
  height: calc(70% - 55px);
  background-color: #e0e0e0;
  display: flex;
`;

const FriendHere = styled.div`
  height: 90%;
  aspect-ratio: 1;
`;

const BackDiv = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 10px;
  right: 10px;
  color: white;
  font-weight: bold;
  font-size: 25px;
  cursor: pointer;
`;

function Country({ style, handleClickBack, galleryQuestionRef }) {
  const targetCountry = useSelector((state) => state.targetCountry);
  const myInfo = useSelector((state) => state.userInfo);
  const { id } = myInfo;

  const [captain, setCaptain] = useState({});
  const [timezone, setTimezone] = useState(0);
  const [weather, setWeather] = useState({});
  const [friendHere, setFriendHere] = useState([]);

  useEffect(() => {
    console.log(targetCountry);

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
          setCaptain({ capitalCity, longitude, latitude });
          return capitalCity;
        } else {
          return null;
        }
      })
      .then((capitalCity) => {
        console.log(capitalCity);
        if (capitalCity) {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&appid=4768302d866115e64f3205b3939e2f19&units=metric`
          )
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              setTimezone(res.timezone);
              setWeather({
                temp: res.main.temp,
                weather: res.weather[0].description,
              });
            });
        }
      });
  }, [targetCountry]);

  // useEffect(() => {
  //   if (id) {
  //     db_userInfo
  //       .where("friends", "array-contains", { id: id, condition: "confirmed" })
  //       .get()
  //       .then((querySnapshot) => {
  //         return querySnapshot.docs;
  //       })
  //       .then((friendList) => {
  //         setFriendHere(
  //           friendList
  //             .filter((friend) =>
  //               friend.data().travel_country.includes(targetCountry.id)
  //             )
  //             .map((friend) => friend.data().photo)
  //         );
  //       });

  //     // .where("travel_country", "array-contains", targetCountry.id)
  //     // .get()
  //     // .then((querySnapshot) => {
  //     //   setFriendHere(querySnapshot.docs.map((doc) => doc.photo));
  //     // });
  //   }
  // }, [myInfo]);

  return (
    <CountryDiv style={style}>
      <CountryShape />
      <GalleryInCountry galleryQuestionRef={galleryQuestionRef} />
      <CountryInfoDiv>
        <LeftDiv>
          <CaptainTitleDiv>
            <i className="fas fa-archway"></i>&ensp;Captain City
          </CaptainTitleDiv>
          <CaptainCity>{captain.capitalCity}</CaptainCity>
          <Weather weatherData={weather} />
        </LeftDiv>
        <CountryClock timezone={timezone} />
      </CountryInfoDiv>
      <FriendsContainerDiv>
        <OtherGalleryDiv>{`${targetCountry.name} from Others`}</OtherGalleryDiv>
        <TitleDiv>{`Friends in ${targetCountry.name}`}</TitleDiv>
        <MyFriends>
          my friends
          {/* {friendHere.map((friendPhoto) => (
            <FriendHere
              style={{
                backgroundImage: `url(${friendPhoto})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ))} */}
        </MyFriends>
      </FriendsContainerDiv>
      <BackDiv onClick={handleClickBack}>
        <i className="fas fa-times"></i>
      </BackDiv>
    </CountryDiv>
  );
}

export default Country;
