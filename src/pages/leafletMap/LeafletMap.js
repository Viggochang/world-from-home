import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
// import Search from "react-leaflet-search";

// import { MarkerClusterGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./leafletMap.css";

import PopupContent from "./popupContent/PopupContent";

// import "proj4leaflet";
// import L from "leaflet";
// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";
// import "leaflet.markercluster";
// import * as ELG from "esri-leaflet-geocoder";
// import "esri-leaflet";
// import "esri-leaflet-vector";
import { db_gallery, db_tourist_spot } from "../../util/firebase";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

const LeafletMapDiv = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1 !important;
`;

const BackBtn = styled.div`
  font-size: 20px;
  background-color: #ffffff;
  padding: 4px;
  position: fixed;
  bottom: 220px;
  right: 45px;
  color: #3a4a58;
  border-radius: 25%;
  outline: 2px solid #adadad;
  cursor: pointer;
  z-index: 400;
  :hover {
    background-color: #f0f0f0;
  }
`;

// const PopupStyle = styled(Popup)`
//   width: 320px;
//   height: 320px;
// `;

function LeafletMap({ mapType }) {
  const [map, setMap] = useState(null);
  const [allSpot, setAllSpot] = useState([]);
  const [allAlbums, setAllAlbums] = useState({});
  const myInfo = useSelector((state) => state.userInfo);
  const myUserId = useSelector((state) => state.myUserId);
  const apikey =
    "AAPK8ba779cc01594743abbd245136a3f366gM55ZxvACBdAwG_RwlwTIts1NHYDcL4AT8N9qKcMqVXEj53qqGCJvnk_GHFLmUvU";
  const mapRef = useRef();

  useEffect(() => {
    db_tourist_spot.get().then((snapshot) => {
      setAllSpot(
        snapshot.docs
          .filter((doc) => doc.data().condition === "completed")
          .map((doc) => doc.data())
      );
    });
    db_gallery.get().then((snapshot) => {
      const allAlbum = {};
      snapshot.docs.forEach((doc) => {
        allAlbum[doc.id] = doc.data();
      });
      setAllAlbums(allAlbum);
    });
  }, []);

  // useEffect(() => {
  //   let map = new L.map("map", {
  //     minZoom: 3,
  //     zoomControl: false,
  //   }).setView([23.5, 0], 2);

  //   new L.Control.Zoom({ position: "bottomright" }).addTo(map);
  //   var cartodbAttribution =
  //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

  //   L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
  //     attribution: cartodbAttribution,
  //   }).addTo(map);

  //   let markers = new L.markerClusterGroup();

  //   const arr = [];
  //   db_gallery
  //     .get()
  //     .then((snapshot) =>
  //       snapshot.docs
  //         // .filter((doc) => doc.data().user_id === myUserId)
  //         .filter((doc) => doc.data().condition === "completed")
  //         .forEach((doc) => {
  //           doc.data().tourist_spot.forEach((spot) => {
  //             setAllSpot((allSpot) => [
  //               ...allSpot,
  //               { x: spot.lng, y: spot.lat, text: spot.text },
  //             ]);
  //             arr.push({ x: spot.lng, y: spot.lat, text: spot.text });
  //           });
  //         })
  //     )
  //     .then(() => {
  //       console.log(arr);
  //       arr
  //         .map((item) =>
  //           L.marker(new L.LatLng(item.y, item.x)) // 新增Marker
  //             .bindPopup(`<h2>${item.text}</h2>`)
  //         ) // 資訊視窗
  //         .forEach((item) => markers.addLayer(item)); // 把marker加入 L.markerClusterGroup中
  //       map.addLayer(markers);
  //     });
  //   return () => {
  //     map.off();
  //     map.remove();
  //   };
  // }, [myInfo]);

  // return <LeafletMapDiv id="map" style={{ zIndex: mapType ? 0 : 1 }} />;

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
        center={[23.5, 0]}
        zoom={3}
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
        <i className="fas fa-home"></i>
      </BackBtn>
    </LeafletMapDiv>
  );
}
export default LeafletMap;
