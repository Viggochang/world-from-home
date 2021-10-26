import React, { useEffect, useRef } from "react";
import L from "leaflet";
import * as ELG from "esri-leaflet-geocoder";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "./Map.css";

// import marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.4.0/dist/images/marker-shadow.png",
});

export default function LeafletMap() {
  let mymap = L.map("mapid").setView([51.505, -0.09], 13);
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={pk.eyJ1IjoidmlnZ29jaGFuZyIsImEiOiJja28xaHpuczYwOWZ1Mm9vdm1xcmx3dTQ5In0.iukEnq1CBZDE4NoNrHtKQA}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        "pk.eyJ1IjoidmlnZ29jaGFuZyIsImEiOiJja28xaHpuczYwOWZ1Mm9vdm1xcmx3dTQ5In0.iukEnq1CBZDE4NoNrHtKQA",
    }
  ).addTo(mymap);
  // const leafletMap = useRef();

  // useEffect(() => {
  //   const { current = {} } = leafletMap;
  //   const { leafletElement: map } = current;

  //   // const map = leafletMap.leafletElement;
  //   const searchControl = new ELG.Geosearch().addTo(map);
  //   const results = new L.LayerGroup().addTo(map);
  //   searchControl.on("results", function (data) {
  //     results.clearLayers();
  //     for (let i = data.results.length - 1; i >= 0; i--) {
  //       results.addLayer(L.marker(data.results[i].latlng));
  //     }
  //   });
  // }, []);

  // const center = [37.7833, -122.4167];
  const position = [0, 40.5];

  return (
    <MapContainer id="mapid"></MapContainer>
    // <div>
    //   <MapContainer style={{height: '100vh', width: '100%'}} center={position} zoom={13} scrollWheelZoom={false}>
    //     <TileLayer
    //       attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    //       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //     />
    //     <Marker position={position}>
    //       {/* <Popup>
    //         A pretty CSS3 popup. <br /> Easily customizable.
    //       </Popup> */}
    //     </Marker>
    //   </MapContainer>
    // </div>
    // <MapContainer
    //   style={{ height: "100vh" }}
    //   center={center}
    //   zoom="10"
    //   ref={leafletMap}
    // >
    //   <TileLayer
    //     attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
    //     url={"http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
    //   />
    //   <div className="pointer" />
    // </MapContainer>
  );
}
