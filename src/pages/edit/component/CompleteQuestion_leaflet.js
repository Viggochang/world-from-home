import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import * as ELG from "esri-leaflet-geocoder";
import "proj4leaflet";
import "esri-leaflet";
import "esri-leaflet-vector";
// import "./Map.css";

const LeafletMapDiv = styled.div`
  width: 100%;
  height: 100%;
`;

function LeafletMap({ longitude, latitude, setTouristSpot }) {
  useEffect(() => {
    // let map = undefined;
    let map = L.map("map", {
      minZoom: 1.5,
    }).setView([latitude, longitude], 5);

    let cartodbAttribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution: cartodbAttribution,
    }).addTo(map);

    let searchControl = ELG.geosearch({
      position: "topright",
      placeholder: "Search Tourist Spots",
      useMapBounds: false,
      providers: [
        ELG.arcgisOnlineProvider({
          apikey:
            "AAPK8ba779cc01594743abbd245136a3f366gM55ZxvACBdAwG_RwlwTIts1NHYDcL4AT8N9qKcMqVXEj53qqGCJvnk_GHFLmUvU", // replace with your api key - https://developers.arcgis.com
          // nearby: {
          //   lat: -33.8688,
          //   lng: 151.2093,
          // },
        }),
      ],
    }).addTo(map);
    let results = L.layerGroup().addTo(map);

    searchControl.on("results", function (data) {
      console.log(data);
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        L.marker(data.results[i].latlng)
          .addTo(results)
          .bindPopup(data.text)
          .openPopup();
        results
          .addLayer(L.marker(data.results[i].latlng).bindPopup(data.text))
          .openPopup();
      }

      if (data) {
        const {
          text,
          latlng: { lat },
          latlng: { lng },
        } = data.results[0];

        setTouristSpot((touristSpot) => {
          return [
            ...touristSpot.filter(
              (touristSpot) =>
                touristSpot.lat !== lat && touristSpot.lng !== lng
            ),
            { text, lat, lng },
          ];
        });
      }
    });

    return () => {
      map.off();
      map.remove();
    };
  }, [longitude, latitude]);

  return <LeafletMapDiv id="map" />;
}

export default LeafletMap;
