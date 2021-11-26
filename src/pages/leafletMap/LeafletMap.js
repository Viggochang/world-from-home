import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import EsriLeafletGeoSearch from "react-esri-leaflet/plugins/EsriLeafletGeoSearch";

import "leaflet/dist/leaflet.css";
import "./leafletMap.css";

import PopupContent from "./popupContent/PopupContent";

import {
  getTouristSpotsData,
  onSnapshotTouristSpot,
} from "../../util/firebase";

const LeafletMapDiv = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
`;

const BackBtn = styled.div`
  font-size: 20px;
  background-color: #ffffff;
  padding: 4px;
  position: fixed;
  bottom: 120px;
  right: 45px;
  color: #3a4a58;
  border-radius: 25%;
  outline: 2px solid rgb(58, 74, 88, 0.6);
  cursor: pointer;
  z-index: 400;
  :hover {
    background-color: #f0f0f0;
  }
`;

function LeafletMap() {
  const [map, setMap] = useState(null);
  const [allSpot, setAllSpot] = useState([]);
  const apikey = process.env.REACT_APP_LEAFLET_APIKEY;

  useEffect(() => {
    const unsubscribe = onSnapshotTouristSpot(setAllSpot);
    return () => unsubscribe();
  }, []);

  const iconMarkup = renderToStaticMarkup(
    <i className=" fa fa-map-marker-alt fa-3x" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  function handleClickBack() {
    map.flyTo([23.5, 0], 3, {
      duration: 1.5,
    });
  }

  return (
    <LeafletMapDiv>
      <MapContainer
        whenCreated={(map) => setMap(map)}
        center={[25, 20]}
        zoom={2.5}
        zoomControl={false}
        minZoom={2.5}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {allSpot.map((spot, index) => (
            <Marker
              key={index}
              position={[spot.lat, spot.lng]}
              icon={customMarkerIcon}
              onClick={(spot) => {
                console.log(spot.text);
              }}
            >
              <Popup maxWidth="500" maxHeight="auto">
                <PopupContent spot={spot} />
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        <ZoomControl />
        <EsriLeafletGeoSearch
          className="geocoder-control-expanded"
          position="topleft"
          useMapBounds={false}
          placeholder="Search for places or addresses"
          providers={{
            arcgisOnlineProvider: {
              apikey,
            },
            featureLayerProvider: {
              url: "https://services.arcgis.com/BG6nSlhZSAWtExvp/ArcGIS/rest/services/GIS_Day_Registration_Form_2019_Hosted_View_Layer/FeatureServer/0",
              searchFields: ["event_name", "host_organization"],
              label: "GIS Day Events 2019",
              bufferRadius: 5000,
              formatSuggestion: function (feature) {
                return (
                  feature.properties.event_name +
                  " - " +
                  feature.properties.host_organization
                );
              },
            },
          }}
          key={apikey}
        />
      </MapContainer>
      <BackBtn onClick={handleClickBack}>
        <i className="fas fa-home" />
      </BackBtn>
    </LeafletMapDiv>
  );
}
export default LeafletMap;
