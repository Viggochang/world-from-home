import React, { useEffect, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import styled from "styled-components";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import countryTrans from "../../util/countryTrans";
import { onSnapShotMyTravelCountry } from "../../util/firebase";

const Chartdiv = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background-color: #3a4a58;
  display: ${(props) =>
    props.userPage === "true" || props.mapType === "true" ? "block" : "none"};
  position: ${(props) => (props.userPage === "true" ? "static" : "fixed")};
`;

am4core.useTheme(am4themes_animated);

function World({ userInfo, mapType, setMap, userPage, map, showCountry }) {
  const dispatch = useDispatch();
  const [myTravelCountries, setMyTravelCountries] = useState([]);
  const targetCountry = useSelector((state) => state.targetCountry);
  const polygonSeries = useSelector((state) => state.polygonSeries);

  useEffect(() => {
    function createMyTravelCountryArr(myAlbums) {
      return Array.from(
        new Set([
          ...myAlbums
            .filter((album) => album.condition === "completed")
            .map((album) => album.country),
          userInfo.country,
        ])
      );
    }

    let unsubscribe = onSnapShotMyTravelCountry(userInfo.id, (myAlbums) => {
      setMyTravelCountries(createMyTravelCountryArr(myAlbums));
    });
    return () => {
      unsubscribe();
    };
  }, [userInfo]);

  useLayoutEffect(() => {
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

    // Create active state
    let as = polygonTemplate.states.create("active");
    as.properties.fill = am4core.color("#B8C3D0");

    polygonTemplate.events.on(
      "hit",
      function (ev) {
        showCountry(ev.target);
        map.zoomToMapObject(ev.target);
      },
      []
    );

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#B8C3D0");

    polygonSeries.exclude = ["AQ"];
    dispatch({
      type: "SET_POLYGONSERIES",
      payload: polygonSeries,
    });

    // Add some data
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

    map.deltaLongitude = -10;
    map.deltaLatitude = 0;

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
      const currentActiveCountry = polygonSeries.mapPolygons.values.filter(
        (country) => country.dataItem.dataContext.id === targetCountry.id
      )[0];
      map.zoomToMapObject(currentActiveCountry);
    }
  }, [myTravelCountries, map, targetCountry, polygonSeries]);

  return (
    <Chartdiv
      id="chartdiv"
      userPage={userPage.toString()}
      mapType={mapType.toString()}
    />
  );
}

export default World;
