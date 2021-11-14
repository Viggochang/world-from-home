// import React, { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import styled from "styled-components";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";
// import "leaflet.markercluster";
import * as ELG from "esri-leaflet-geocoder";
// import "proj4leaflet";
// import "esri-leaflet";
// import "esri-leaflet-vector";
// import "../../country/component/Map.css";

// const LeafletMapDiv = styled.div`
//   width: 100%;
//   height: 100%;
// `;

// function LeafletMap({ longitude, latitude, setTouristSpot }) {
//   useEffect(() => {
//     // let map = undefined;
//     let map = L.map("map", {
//       minZoom: 1.5,
//     }).setView([latitude, longitude], 6);

//     let cartodbAttribution =
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

//     L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
//       attribution: cartodbAttribution,
//     }).addTo(map);

//     map.invalidateSize(true);

//     let searchControl = ELG.geosearch({
//       position: "topright",
//       placeholder: "Search Tourist Spots",
//       useMapBounds: false,
//       providers: [
//         ELG.arcgisOnlineProvider({
//           apikey:
//             "AAPK8ba779cc01594743abbd245136a3f366gM55ZxvACBdAwG_RwlwTIts1NHYDcL4AT8N9qKcMqVXEj53qqGCJvnk_GHFLmUvU", // replace with your api key - https://developers.arcgis.com
//           // nearby: {
//           //   lat: -33.8688,
//           //   lng: 151.2093,
//           // },
//         }),
//       ],
//     }).addTo(map);
//     let results = L.layerGroup().addTo(map);

//     // if (touristSpot.length) {
//     //   touristSpot.forEach((data) =>
//     //     L.marker(new L.LatLng(data.lat, data.lng)) // 新增Marker
//     //       .bindPopup(data.text)
//     //       .addTo(map)
//     //   );
//     // }

//     searchControl.on("results", function (data) {
//       console.log(data);
//       // results.clearLayers();
//       for (let i = data.results.length - 1; i >= 0; i--) {
//         L.marker(data.results[i].latlng)
//           .addTo(results)
//           .bindPopup(data.text)
//           .openPopup();
//         results
//           .addLayer(L.marker(data.results[i].latlng).bindPopup(data.text))
//           .openPopup();
//       }

//       if (data) {
//         const {
//           text,
//           latlng: { lat },
//           latlng: { lng },
//         } = data.results[0];

//         setTouristSpot((touristSpot) => {
//           return [
//             ...touristSpot.filter(
//               (touristSpot) =>
//                 touristSpot.lat !== lat && touristSpot.lng !== lng
//             ),
//             { text, lat, lng },
//           ];
//         });
//       }
//     });

//     return () => {
//       map.off();
//       map.remove();
//     };
//   }, [longitude, latitude]);

//   return <LeafletMapDiv id="map" />;
// }

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
import { geosearch } from "esri-leaflet-geocoder";

import "leaflet/dist/leaflet.css";
// import "./leafletMap.css";

const apikey =
  "AAPK8ba779cc01594743abbd245136a3f366gM55ZxvACBdAwG_RwlwTIts1NHYDcL4AT8N9qKcMqVXEj53qqGCJvnk_GHFLmUvU";

const iconMarkup = renderToStaticMarkup(
  <i className=" fa fa-map-marker-alt fa-3x" />
);
const customMarkerIcon = divIcon({
  html: iconMarkup,
});

const LeafletMapDiv = styled.div`
  width: 100%;
  height: 100%;
`;

function LeafletMap({ longitude, latitude, setTouristSpot }) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) {
      map.setView([latitude, longitude], 6);
    }
  }, [map, longitude, latitude]);

  const control = geosearch({
    providers: [ELG.arcgisOnlineProvider({ apikey })],
  });

  function handleOnSearchResult(data) {
    console.log(data);
  }
  useEffect(() => {
    if (map) {
      control.addTo(map);
      control.on("results", handleOnSearchResult);
    }

    return () => {
      control.off("results", handleOnSearchResult);
    };
  }, [map]);

  console.log(longitude, latitude);
  return (
    <LeafletMapDiv>
      <MapContainer
        whenCreated={(map) => setMap(map)}
        center={[latitude, longitude]}
        zoom={6}
        zoomControl={false}
        minZoom={2.5}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
        />
        {/* <MarkerClusterGroup>
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
      </MarkerClusterGroup> */}
        <ZoomControl position="bottomright" />
        {/* <EsriLeafletGeoSearch
          className="geocoder-control-expanded"
          position="topleft"
          useMapBounds={false}
          placeholder="Search for places or addresses"
          onResult={(result) => {
            console.log(result);
          }}
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
        /> */}
      </MapContainer>
    </LeafletMapDiv>
  );
}

export default LeafletMap;
