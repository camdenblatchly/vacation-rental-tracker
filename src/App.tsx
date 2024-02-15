import * as React from 'react';
import {useState, useMemo} from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl
} from 'react-map-gl';

import Pin from './components/Pin';

import './App.css';

import rentals from './data/vacation_rentals.json';
import waitlist_rentals from './data/vacation_rentals_waitlist.json';

console.log("rentals are ", rentals);
console.log("waitlist_rentals are ", waitlist_rentals);

const TOKEN = "pk.eyJ1IjoiY2FtZGVuYmxhdGNobHkiLCJhIjoiY2xzZmRld3BnMHg4dTJtbGdya3A5amxmYyJ9.YWpZ0yjrrFd228gsQwfx3A";

function App() {

  const [popupInfo, setPopupInfo]:any = useState(null);

  const current_pins = useMemo(
    () =>
      rentals
        .filter((rental) => (typeof rental.Longitude === "number" && typeof rental.Latitude === "number"))
        .map((rental, index) => {

          if (typeof rental.Longitude === "number" && typeof rental.Latitude === "number") {
            return(
              <Marker
                key={`marker-${index}`}
                longitude={rental.Longitude}
                latitude={rental.Latitude}
                anchor="bottom"
                onClick={e => {
                  // If we let the click event propagates to the map, it will immediately close the popup
                  // with `closeOnClick: true`
                  e.originalEvent.stopPropagation();
                  setPopupInfo({...rental, type: "current"});
                }}
              >
                <Pin fill={"#7570b3"} />
              </Marker>
            );
          }
          else {
            return null;
          }

      }),
    []
  );


  const waitlist_pins = useMemo(
    () =>
      waitlist_rentals
        .filter((rental) => (typeof rental.Longitude === "number" && typeof rental.Latitude === "number"))
        .map((rental, index) => {

          if (typeof rental.Longitude === "number" && typeof rental.Latitude === "number") {
            return(
              <Marker
                key={`marker-${index}`}
                longitude={rental.Longitude}
                latitude={rental.Latitude}
                anchor="bottom"
                onClick={e => {
                  // If we let the click event propagates to the map, it will immediately close the popup
                  // with `closeOnClick: true`
                  e.originalEvent.stopPropagation();
                  setPopupInfo({...rental, type: "waitlist"});
                }}
              >
                <Pin fill={"#d95f02"}/>
              </Marker>
            );
          }
          else {
            return null;
          }

      }),
    []
  );  

  return (
    <div className="App">
      <div className="text-content">
        <h1>Durango Short Term Rental Tracker</h1>
        <p>
          Since 1989, the city of Durango has regulated the use of short term rentals. Currently, the city 
          city publishes a list of address with approved permits. I've geocoded that addresses and plotted them below.
          Take a look
        </p>
      </div>
      <div className="map-container">
        <Map
          initialViewState={{
            latitude: 37.29,
            longitude: -107.88,
            zoom: 12,
            bearing: 0,
            pitch: 0
          }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={TOKEN}
        >
          <FullscreenControl position="top-left" />
          <NavigationControl position="top-left" />
          <ScaleControl />

          {current_pins}
          {waitlist_pins}

          {popupInfo && popupInfo.type === "current" && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.Longitude)}
              latitude={Number(popupInfo.Latitude)}
              onClose={() => setPopupInfo(null)}
            >
              <div className="popup">
                <h2>{popupInfo.Address}</h2>
                <p>
                  Owner: {popupInfo.Applicant}
                  <br />
                  Permit number: {popupInfo.Permit_Number}
                  <br />
                  Property manager: {popupInfo["Property Manager"]? popupInfo["Property Manager"]: "N/A"}
                  <br />
                  Business license: {popupInfo.Business_Lic}
                  <br />
                  Zone: {popupInfo.ZONE} <em>(Note: only zones EN-1 and EN-2 have rental caps)</em>
                </p>
              </div>
            </Popup>
          )}

          {popupInfo && popupInfo.type === "waitlist" && (
            <Popup
              anchor="top"
              longitude={Number(popupInfo.Longitude)}
              latitude={Number(popupInfo.Latitude)}
              onClose={() => setPopupInfo(null)}
            >
              <div className="popup">
                <h2>{popupInfo.Address}</h2>
                <p>
                  Owner: {popupInfo['Applicant Name']}
                  <br />
                  Current rental?: {popupInfo['Current VR?']}
                  <br />
                  Illegal rental?: {popupInfo['Illegal VR?']? popupInfo['Illegal VR?']: "N/A"}
                  <br />
                  Zone: {popupInfo.ZONE}
                </p>
                <p><em>Note: only zones EN-1 and EN-2 have rental caps</em></p>
              </div>
            </Popup>
          )}        

        </Map>
      </div>
    </div>
  );
}

export default App;
