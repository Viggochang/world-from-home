import React, { useEffect, useState, useRef } from "react";
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

function LeafletMap() {
  useEffect(() => {
    // let crs = new L.Proj.CRS(
    //   "EPSG:54003",
    //   "+proj=mill +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs"
    // );
    // let crs = new L.Proj.CRS(
    //   "EPSG:2400",
    //   "+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 " +
    //     "+y_0=0.0 +proj=tmerc +ellps=bessel +units=m " +
    //     "+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs",
    //   {
    //     resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
    //   }
    // );

    // let crs = new L.Proj.CRS(
    //   "EPSG:27700",
    //   "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs",
    //   {
    //     origin: [-5781523.997920001, 4883853.592504997],
    //     resolutions: [
    //       132291.9312505292, 66145.9656252646, 26458.386250105836,
    //       19843.789687579378, 13229.193125052918, 6614.596562526459,
    //       2645.8386250105837, 1322.9193125052918, 661.4596562526459,
    //       264.5838625010584, 132.2919312505292, 66.1459656252646,
    //       26.458386250105836, 19.843789687579378, 13.229193125052918,
    //       6.614596562526459, 2.6458386250105836, 1.3229193125052918,
    //       0.6614596562526459,
    //     ],
    //   }
    // );
    let map = L.map("map", {
      minZoom: 2.5,
    }).setView([23.5, 121], 8);

    // L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //   attribution:
    //     '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
    // }).addTo(map);
    // console.log(L.esri)
    // L.esri.Vector.vectorBasemapLayer("ArcGIS:DarkGray:Base", {
    //   apikey:
    //     "AAPK8ba779cc01594743abbd245136a3f366gM55ZxvACBdAwG_RwlwTIts1NHYDcL4AT8N9qKcMqVXEj53qqGCJvnk_GHFLmUvU", // replace with your api key - https://developers.arcgis.com // Replace with your API key - https://developers.arcgis.com
    // }).addTo(map);

    var cartodbAttribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
      attribution: cartodbAttribution,
    }).addTo(map);

    let searchControl = ELG.geosearch({
      position: "topright",
      placeholder: "Enter an address or place e.g. 1 York St",
      useMapBounds: false,
      providers: [
        ELG.arcgisOnlineProvider({
          apikey:
            "AAPK8ba779cc01594743abbd245136a3f366gM55ZxvACBdAwG_RwlwTIts1NHYDcL4AT8N9qKcMqVXEj53qqGCJvnk_GHFLmUvU", // replace with your api key - https://developers.arcgis.com
          nearby: {
            lat: -33.8688,
            lng: 151.2093,
          },
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
    });

    function random(min, max) {
      return Math.random() * (max - min) + min;
    }

    function CreatePoint(count, arr) {
      // count為產生的點數量
      for (let i = 0; i < count; i++) {
        let longitude = random(120.5, 121.4); // 經度介於120.5~121.4
        let latitude = random(23, 24.6); // 緯度介於23~24.6

        arr.push({ x: longitude, y: latitude });
      }
    }
    let arr = [];
    CreatePoint(1500, arr);
    console.log(arr);

    // arr
    //   .map((item) => L.marker(new L.LatLng(item.y, item.x)))
    //   .forEach((item) => map.addLayer(item));

    let markers = L.markerClusterGroup();
    arr
      .map((item) =>
        L.marker(new L.LatLng(item.y, item.x)) // 新增Marker
          .bindPopup(`<p>經度: ${item.x}</p><p>緯度: ${item.y}</p>`)
      ) // 資訊視窗
      .forEach((item) => markers.addLayer(item)); // 把marker加入 L.markerClusterGroup中
    map.addLayer(markers);
  }, []);

  return (
    <div id="map" style={{ margin: "50px", height: "800px" }} />
    // <MapContainer
    //   style={{ height: "1000px" }}
    //   center={[51.505, -0.09]}
    //   zoom={13}
    //   scrollWheelZoom={false}
    // >
    //   <TileLayer
    //     attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //   />
    //   <Marker position={[51.505, -0.09]}>
    //     <Popup>
    //       A pretty CSS3 popup. <br /> Easily customizable.
    //     </Popup>
    //   </Marker>
    // </MapContainer>
  );
}
export default LeafletMap;
