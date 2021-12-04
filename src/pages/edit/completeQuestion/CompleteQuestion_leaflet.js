import * as ELG from "esri-leaflet-geocoder";

import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import { MapContainer, TileLayer, Marker, ZoomControl } from "react-leaflet";
import { geosearch } from "esri-leaflet-geocoder";

import "leaflet/dist/leaflet.css";

const apikey = process.env.REACT_APP_LEAFLET_APIKEY;

const LeafletMapDiv = styled.div`
  width: 100%;
  height: 100%;
`;

function LeafletMap({ longitude, latitude, setTouristSpot }) {
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState({});

  const iconMarkup = renderToStaticMarkup(
    <i className=" fa fa-map-marker-alt fa-3x" />
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  useEffect(() => {
    if (map) {
      map.setView([latitude, longitude], 6);
    }
  }, [map, longitude, latitude]);

  const control = geosearch({
    providers: [ELG.arcgisOnlineProvider({ apikey })],
    useMapBounds: false,
  });

  function handleOnSearchResult(data) {
    if (data) {
      const {
        text,
        latlng: { lat },
        latlng: { lng },
      } = data.results[0];

      setTouristSpot((touristSpot) => {
        return [
          ...touristSpot.filter(
            (touristSpot) => touristSpot.lat !== lat && touristSpot.lng !== lng
          ),
          { text, lat, lng },
        ];
      });
      setMarker({ text, lat, lng });
    }
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
        {Object.keys(marker).length ? (
          <Marker position={[marker.lat, marker.lng]} icon={customMarkerIcon} />
        ) : null}
        <ZoomControl position="bottomright" />
      </MapContainer>
    </LeafletMapDiv>
  );
}

export default LeafletMap;
