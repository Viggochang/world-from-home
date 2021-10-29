import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// import "./App.css";
import styled from "styled-components";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
// import 'firebase/firestore';

// import firebase from "../../util/firebase";
// import {db_userInfo} from "../../util/firebase";
import ToMyPage from "./component/ToMyPage";
import Country from "../country/Country";
import GalleryQuestion from "../country/component/GalleryQuestion";

import countryTrans from "../../util/countryTrans";
// const db = firebase.firestore();

const BackgroundColorDiv = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: -1;
  background-color: #3f3f3f;
`;

const Chartdiv = styled.div`
  width: 100%;
  height: 98vh;
`;

function World(props) {
  const galleryQuestionRef = useRef();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  // const targetCountry = useSelector((state) => state.targetCountry);

  const [maskVisibility, setMaskVisibility] = useState("hidden");
  const [maskOpacity, setMaskOpacity] = useState(0);
  const [maskDisplay, setMaskDisplay] = useState("flex");
  const [map, setMap] = useState(undefined);
  const [currentActive, setCurrentActive] = useState(undefined);

  let currentActiveCountry;
  useEffect(() => {
    // db_userInfo.doc('yXtnB3CD0XAJDQ0Le51J').get().then(doc => {
    //   dispatch({
    //     type: 'SET_USER_INFO',
    //     payload: doc.data()
    //   });
    // });
    if (Object.keys(userInfo).length) {
      let map = am4core.create("chartdiv", am4maps.MapChart);
      setMap(map);
      map.geodata = am4geodata_worldLow;
      map.projection = new am4maps.projections.Miller();

      // Create map polygon series
      let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());

      // Make map load polygon (like country names) data from GeoJSON
      polygonSeries.useGeodata = true;

      // Configure series
      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.tooltipText = "{name}";
      polygonTemplate.fill = am4core.color("#6E6E6E");
      polygonTemplate.stroke = am4core.color("#3F3F3F");
      // polygonTemplate.togglable = true;

      // Create active state
      let as = polygonTemplate.states.create("active");
      as.properties.fill = am4core.color("#ADADAD");
      // let currentActiveCountry;

      polygonTemplate.events.on(
        "hit",
        function (ev) {
          if (currentActiveCountry) {
            currentActiveCountry.isActive = false;
            // setCurrentActive(currentActiveCountry);
          }
          currentActiveCountry = ev.target;
          setCurrentActive(ev.target);
          map.zoomToMapObject(currentActiveCountry);
          currentActiveCountry.isActive = true;
          // setCurrentActive(currentActiveCountry);
          dispatch({
            type: "SET_TARGET_COUNTRY",
            payload: currentActiveCountry.dataItem.dataContext,
          });
          // home button
          // let button = map.chartContainer.createChild(am4core.Button);
          // button.label.text = "home";
          // button.padding(5, 5, 5, 5);
          // button.width = 80;
          // button.align = "right";
          // button.marginRight = 15;
          // button.events.on("hit", function () {
          //   // console.log(targetCountry);
          //   map.goHome();
          //   // polygonSeries.getPolygonById(`${currentActive.dataItem.dataContext.id}`).isActive = false;
          //   currentActiveCountry.isActive = false;
          //   setMaskOpacity(0);
          //   setMaskVisibility("hidden");
          //   setMaskDisplay("none");
          //   setTimeout(() => {
          //     setMaskDisplay("flex");
          //   }, 2000);
          // });

          console.log(ev.target.dataItem.dataContext.id);
          setMaskOpacity(0.8);
          setMaskVisibility("visible");
        },
        []
      );

      // Create hover state and set alternative fill color
      let hs = polygonTemplate.states.create("hover");
      hs.properties.fill = am4core.color("#ADADAD");

      polygonSeries.exclude = ["AQ"];

      // Add some data
      const { travel_country } = userInfo;
      polygonSeries.data = travel_country.map((countryCode) => ({
        id: countryCode,
        name: countryTrans[countryCode].name_en,
        fill: am4core.color("#408080"),
      }));
      // polygonSeries.data = [
      //   {
      //     id: "US",
      //     // name: "United States",
      //     fill: am4core.color("#C6A300"),
      //   },
      //   {
      //     // id: "EG",
      //     name: "Egypt",
      //     fill: am4core.color("#C6A300"),
      //   },
      // ];

      polygonTemplate.propertyFields.fill = "fill";

      // Add zoom control
      map.zoomControl = new am4maps.ZoomControl();
      map.zoomControl.slider.height = 100;
      map.zoomControl.marginRight = 20;
      // Add and configure small map
      // map.smallMap = new am4maps.SmallMap();
      // map.smallMap.series.push(polygonSeries);

      // Center on Pacic
      map.deltaLongitude = -10;

      // Center on Pacic
      map.deltaLatitude = 0;

      // worldMap.current = map;

      // return () => {
      //   map.dispose();
      // };
    }
  }, [userInfo]);

  function handleClickBack() {
    map.goHome();
    // polygonSeries.getPolygonById(`${currentActive.dataItem.dataContext.id}`).isActive = false;
    currentActive.isActive = false;
    setMaskOpacity(0);
    setMaskVisibility("hidden");
    setMaskDisplay("none");
    setTimeout(() => {
      setMaskDisplay("flex");
    }, 2000);
  }

  return (
    <>
      <BackgroundColorDiv />
      <Chartdiv id="chartdiv" />
      <ToMyPage />
      <Country
        style={{
          visibility: maskVisibility,
          backgroundColor: `rgba(63, 63, 63, ${maskOpacity})`,
          display: maskDisplay,
          opacity: maskOpacity + 0.2,
        }}
        back={handleClickBack}
        galleryQuestionRef={galleryQuestionRef}
      />
      <GalleryQuestion innerRef={galleryQuestionRef} />
    </>
  );
}

export default World;
