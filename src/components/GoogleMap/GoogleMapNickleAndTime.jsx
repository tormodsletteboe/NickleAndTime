import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { useState, useEffect } from 'react';

const containerStyle = {
  width: '100%',
  height: '700px'
};

// const center = {
//   lat: -3.745,
//   lng: -38.523
// };

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};



function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function GoogleMapNickleAndTime() {
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();

  const getLocation = () =>{
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
  const success=(pos) =>{
    const crd = pos.coords;
    setLat(crd.latitude);
    setLng(crd.longitude);
    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
  }


  useEffect(() => {
    getLocation();
  }, [])

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCZytryhTMKdfGGhl-A-6dRhHdgj_pz1gs"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{lat: lat, lng:lng}}
        zoom={10}
      >
        { /* Child components, such as markers, info windows, etc. */}
        <></>
       
      </GoogleMap>
    </LoadScript>
  )
}

export default GoogleMapNickleAndTime