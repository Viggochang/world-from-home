import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// import "./App.css";
import styled from "styled-components";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";

import countryTrans from "../../util/countryTrans";

const Chartdiv = styled.div`
  width: 100%;
  height: 100%;
`;

function World({
  userInfo,
  setCurrentActive,
  setMap,
  setMaskVisibility,
  setMaskOpacity,
}) {
  const dispatch = useDispatch();
  // const userInfo = useSelector((state) => state.userInfo);

  let currentActiveCountry;
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

        console.log(ev.target.dataItem.dataContext.id);
        setMaskOpacity(0.8);
        setMaskVisibility("visible");
      },
      []
    );

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#B8C3D0");

    polygonSeries.exclude = ["AQ"];

    // Add some data
    const { travel_country } = userInfo;
    if (travel_country) {
      polygonSeries.data = travel_country.map((countryCode) => ({
        id: countryCode,
        name: countryTrans[countryCode].name_en,
        fill: am4core.color("#ffffff"),
      }));
    }

    polygonTemplate.propertyFields.fill = "fill";

    // Add zoom control
    map.zoomControl = new am4maps.ZoomControl();
    map.zoomControl.slider.height = 100;
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
  }, [userInfo]);

  return <Chartdiv id="chartdiv" />;
}

export default World;
