import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// import "./App.css";
import styled from "styled-components";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import countryTrans from "../../util/countryTrans";
import { db_gallery, db_userInfo } from "../../util/firebase";

const Chartdiv = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #3a4a58;
`;

function World({
  mapType,
  setCurrentActive,
  currentActive,
  setMap,
  setMaskVisibility,
  setMaskOpacity,
  userPage,
  map,
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.userInfo);
  const [myTravelCountries, setMyTravelCountries] = useState([]);
  const targetCountry = useSelector((state) => state.targetCountry);
  const polygonSeries = useSelector((state) => state.polygonSeries);

  useEffect(() => {
    let unsubscribe = db_gallery
      .where("user_id", "==", userInfo.id || null)
      .onSnapshot((myAlbums) => {
        setMyTravelCountries(
          Array.from(
            new Set([
              ...myAlbums.docs
                .filter((album) => album.data().condition === "completed")
                .map((album) => album.data().country),
              userInfo.country,
            ])
          )
          // .push(userInfo.country)
        );
      });
    return () => {
      unsubscribe();
    };
  }, [userInfo]);

  // let currentActiveCountry = {};
  useEffect(() => {
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
    polygonTemplate.fill = am4core.color("#667484");
    polygonTemplate.stroke = am4core.color("#3A4A58");
    // polygonTemplate.togglable = true;

    // Create active state
    let as = polygonTemplate.states.create("active");
    as.properties.fill = am4core.color("#B8C3D0");

    polygonTemplate.events.on(
      "hit",
      function (ev) {
        // if (currentActiveCountry) {
        //   currentActiveCountry.isActive = false;
        //   // setCurrentActive(currentActiveCountry);
        // }
        let currentActiveCountry = ev.target;
        setCurrentActive(ev.target);
        map.zoomToMapObject(currentActiveCountry);
        // currentActiveCountry.isActive = true;
        // setCurrentActive(currentActiveCountry);
        dispatch({
          type: "SET_TARGET_COUNTRY",
          payload: currentActiveCountry.dataItem.dataContext,
        });
        setMaskOpacity(0.8);
        setMaskVisibility("visible");
      },
      []
    );

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#B8C3D0");

    polygonSeries.exclude = ["AQ"];
    //test
    // console.log("displatch polygonSeries", polygonSeries);
    dispatch({
      type: "SET_POLYGONSERIES",
      payload: polygonSeries,
    });

    // Add some data
    const { travel_country } = userInfo;
    if (myTravelCountries) {
      polygonSeries.data = myTravelCountries
        .filter((countryCode) => countryCode)
        .map((countryCode) => ({
          id: countryCode,
          name: countryTrans[countryCode].name_en,
          fill: am4core.color("#ffffff"),
        }));
    }

    polygonTemplate.propertyFields.fill = "fill";

    // Add zoom control
    map.zoomControl = new am4maps.ZoomControl();
    map.zoomControl.slider.height = 0;
    map.zoomControl.marginRight = 40;
    map.zoomControl.marginBottom = 40;
    // Add and configure small map
    // map.smallMap = new am4maps.SmallMap();
    // map.smallMap.series.push(polygonSeries);

    // Center on Pacic
    map.deltaLongitude = -10;

    // Center on Pacic
    map.deltaLatitude = 0;

    // worldMap.current = map;

    window.scrollTo(0, 0);

    return () => {
      map.dispose();
    };
  }, [myTravelCountries]);

  useEffect(() => {
    if (
      map &&
      Object.keys(targetCountry).length &&
      polygonSeries.mapPolygons.values.length
    ) {
      console.log(polygonSeries.mapPolygons.values);
      const currentActiveCountry = polygonSeries.mapPolygons.values.filter(
        (country) => country.dataItem.dataContext.id === targetCountry.id
      )[0];
      map.zoomToMapObject(currentActiveCountry);
    }
  }, [myTravelCountries, map, targetCountry, polygonSeries]);

  console.log(targetCountry);

  // useEffect(() => {
  //   // Add some data
  //   // const { travel_country } = userInfo;
  //   if (myTravelCountries.length && Object.keys(map).length) {
  //     let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());

  //     map.series.data = (
  //       userInfo.country
  //         ? [...myTravelCountries, userInfo.country]
  //         : myTravelCountries
  //     ).map((countryCode) => ({
  //       id: countryCode,
  //       name: countryTrans[countryCode].name_en,
  //       fill: am4core.color("#ffffff"),
  //     }));
  //   }
  //   // dispatch({
  //   //   type: "SET_POLYGONSERIES",
  //   //   payload: polygonSeries,
  //   // });
  // }, [myTravelCountries, map]);

  return (
    <Chartdiv
      id="chartdiv"
      style={{
        display: userPage || mapType ? "block" : "none",
        position: userPage ? "static" : "fixed",
      }}
    />
  );
}

export default World;
