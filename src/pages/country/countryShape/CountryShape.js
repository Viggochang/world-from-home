import React, { useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_worldHigh from "@amcharts/amcharts4-geodata/worldHigh";
import am4geodata_usaLow from "@amcharts/amcharts4-geodata/usaLow";

const CountryShapeFrameDiv = styled.div`
  width: 35%;
  height: calc(57% - 20px);
  outline: 1px white solid;
  position: relative;
  padding: 10px;
  border-radius: 8px;
  @media (max-width: 1180px) {
    width: auto;
    height: calc(43% - 50px);
    margin: 20px 0 10px;
    flex-grow: 1;
  }
  @media (max-width: 968px) {
    height: calc(43% - 100px);
  }
  @media (max-width: 600px) {
    display: none;
  }
`;

const ShapeDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const CountryNameDiv = styled.div`
  margin: 20px;
  font-size: 50px;
  font-weight: bold;
  color: white;
  text-align: left;
  position: absolute;
  bottom: 0px;
  left: 10px;
`;

export default function CountryShape() {
  const targetCountry = useSelector((state) => state.targetCountry);

  useEffect(() => {
    let map = am4core.create("countryShape", am4maps.MapChart);
    if (targetCountry.id === "US") {
      map.geodata = am4geodata_usaLow;
      map.projection = new am4maps.projections.AlbersUsa();
      let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;

      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.stroke = am4core.color("#3F3F3F");
    } else {
      map.geodata = am4geodata_worldHigh;
      map.projection = new am4maps.projections.Mercator();
      let polygonSeries = map.series.push(new am4maps.MapPolygonSeries());
      polygonSeries.useGeodata = true;
      polygonSeries.include = [targetCountry.id];

      let polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.stroke = am4core.color("#3F3F3F");

      // Center on Pacic
      map.deltaLongitude = -12;
    }
  }, [targetCountry]);

  return (
    <CountryShapeFrameDiv>
      <ShapeDiv id="countryShape" />
      <CountryNameDiv>{targetCountry.name}</CountryNameDiv>
    </CountryShapeFrameDiv>
  );
}
