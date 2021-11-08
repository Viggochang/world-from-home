import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import styled from "styled-components";

import "proj4leaflet";
import L from "leaflet";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import * as ELG from "esri-leaflet-geocoder";
import "esri-leaflet";
import "esri-leaflet-vector";
// import "./Map.css";
import { db_gallery } from "../../util/firebase";

const LeafletMapDiv = styled.div`
  height: "100vh";
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1 !important;
`;

function LeafletMap({ mapType }) {
  const [allSpot, setAllSpot] = useState([]);
  const myInfo = useSelector((state) => state.userInfo);

  // useEffect(() => {
  //   db_gallery.get().then(
  //     (snapshot) =>
  //       snapshot.docs
  //         .filter((doc) => doc.user_id === myInfo.id)
  //         .forEach(({ tourist_spot }) => {
  //           tourist_spot.forEach(([lat, lng]) => {
  //             setAllSpot((allSpot) => [...allSpot, { x: lng, y: lat }]);
  //           });
  //         })

  //     // .forEach({(tourist_sppot}) => {
  //     //   tourist_sppot.forEach(([lat, lng]) => {
  //     //     spotArr.push([lat, lng])
  //     //   })
  //     // })
  //   );
  // }, []);

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
    let map = new L.map("map", {
      minZoom: 2.5,
      zoomControl: false,
    }).setView([23.5, 0], 2);

    new L.Control.Zoom({ position: "bottomright" }).addTo(map);

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

    // let searchControl = ELG.geosearch({
    //   position: "topright",
    //   placeholder: "Search",
    //   useMapBounds: false,
    //   providers: [
    //     ELG.arcgisOnlineProvider({
    //       apikey:
    //         "AAPK8ba779cc01594743abbd245136a3f366gM55ZxvACBdAwG_RwlwTIts1NHYDcL4AT8N9qKcMqVXEj53qqGCJvnk_GHFLmUvU", // replace with your api key - https://developers.arcgis.com
    //       nearby: {
    //         lat: -33.8688,
    //         lng: 151.2093,
    //       },
    //     }),
    //   ],
    // }).addTo(map);

    // let results = L.layerGroup().addTo(map);

    // searchControl.on("results", function (data) {
    //   console.log(data);
    //   results.clearLayers();
    //   for (let i = data.results.length - 1; i >= 0; i--) {
    //     L.marker(data.results[i].latlng)
    //       .addTo(results)
    //       .bindPopup(data.text)
    //       .openPopup();
    //     results
    //       .addLayer(L.marker(data.results[i].latlng).bindPopup(data.text))
    //       .openPopup();
    //   }
    // });

    // function random(min, max) {
    //   return Math.random() * (max - min) + min;
    // }

    // function CreatePoint(count, arr) {
    //   // count為產生的點數量
    //   for (let i = 0; i < count; i++) {
    //     let longitude = random(120.5, 121.4); // 經度介於120.5~121.4
    //     let latitude = random(23, 24.6); // 緯度介於23~24.6

    //     arr.push({ x: longitude, y: latitude });
    //   }
    // }
    // let arr = [];
    // CreatePoint(1500, arr);
    // console.log(arr);

    // arr
    //   .map((item) => L.marker(new L.LatLng(item.y, item.x)))
    //   .forEach((item) => map.addLayer(item));

    let markers = new L.markerClusterGroup();

    const arr = [];
    db_gallery
      .get()
      .then((snapshot) =>
        snapshot.docs
          .filter((doc) => doc.data().user_id === "yXtnB3CD0XAJDQ0Le51J")
          .forEach((doc) => {
            console.log(doc.data());
            doc.data().tourist_spot.forEach((spot) => {
              setAllSpot((allSpot) => [
                ...allSpot,
                { x: spot.lng, y: spot.lat, text: spot.text },
              ]);
              arr.push({ x: spot.lng, y: spot.lat, text: spot.text });
            });
          })
      )
      .then(() => {
        console.log(arr);
        arr
          .map((item) =>
            L.marker(new L.LatLng(item.y, item.x)) // 新增Marker
              .bindPopup(item.text)
          ) // 資訊視窗
          .forEach((item) => markers.addLayer(item)); // 把marker加入 L.markerClusterGroup中
        map.addLayer(markers);
      });

    // allSpot
    //   .map((item) =>
    //     L.marker(new L.LatLng(item.y, item.x)) // 新增Marker
    //       .bindPopup(`<p>經度: ${item.x}</p><p>緯度: ${item.y}</p>`)
    //   ) // 資訊視窗
    //   .forEach((item) => markers.addLayer(item)); // 把marker加入 L.markerClusterGroup中
    // map.addLayer(markers);

    return () => {
      map.off();
      map.remove();
    };
  }, [myInfo]);

  return (
    <LeafletMapDiv id="map" style={{ zIndex: mapType ? 0 : 1 }} />
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
