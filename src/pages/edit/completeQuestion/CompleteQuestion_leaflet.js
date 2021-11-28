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
    console.log(data);
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
