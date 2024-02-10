import * as React from 'react';
import {useState, useMemo} from 'react';
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl';

import Pin from './components/Pin';

import './App.css';

import rentals from './data/vacation_rentals.json';

console.log("rentals are ", rentals);

const TOKEN = "pk.eyJ1IjoiY2FtZGVuYmxhdGNobHkiLCJhIjoiY2xzZmRld3BnMHg4dTJtbGdya3A5amxmYyJ9.YWpZ0yjrrFd228gsQwfx3A";

function App() {

  const [popupInfo, setPopupInfo]:any = useState(null);

  const pins = useMemo(
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
                setPopupInfo(rental);
              }}
            >
              <Pin />
            </Marker>
          );
        }

      }),
    []
  );

  return (
    <div className="App">
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

        {pins}

        {popupInfo && (
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
                Property manager: {popupInfo.PropertyManager? popupInfo.PropertyManager: "N/A"}
                <br />
                Business license: {popupInfo.Business_Lic}
              </p>
            </div>
          </Popup>
        )}

      </Map>
    </div>
  );
}

export default App;
