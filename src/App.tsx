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

const TOKEN = "pk.eyJ1IjoiY2FtZGVuYmxhdGNobHkiLCJhIjoiY2xzZmRld3BnMHg4dTJtbGdya3A5amxmYyJ9.YWpZ0yjrrFd228gsQwfx3A";

function App() {
  return (
    <div className="App">
      <Map
        initialViewState={{
          latitude: 40,
          longitude: -100,
          zoom: 3.5,
          bearing: 0,
          pitch: 0
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={TOKEN}
      >
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />
      </Map>
    </div>
  );
}

export default App;
