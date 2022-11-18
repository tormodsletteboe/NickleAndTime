
import React from 'react';
// import { useEffect,useState } from 'react';
// import UbiGoogleMaps from '../UbiLabsGoogleMaps/UbiGoogleMaps';
import GoogleMapNickleAndTime from '../GoogleMap/GoogleMapNickleAndTime';
import PlacesToAvoidDrawer from '../Drawer/Drawer';
import { useEffect } from 'react';
import { useDispatch,useSelector } from 'react-redux';

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};



function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}


function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
  const success = (pos) => {
    const crd = pos.coords;
    // setLat(crd.latitude);
    // setLng(crd.longitude);
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    const date = new Date();
    console.log(date);
    dispatch({
      type: 'UPDATE_CURRENT_LOCATION',
      payload: {
        current_latitude: crd.latitude,
        current_longitude: crd.longitude
      }
    })
  }
  const dispatch = useDispatch();

  useEffect(() => {
    setInterval(getLocation, 60000);
    //do a dispatch with coords to database
    

  }, [])


  return (
    <div className="container">
      <GoogleMapNickleAndTime />
      <PlacesToAvoidDrawer />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
{/* <h2>Welcome, {user.username}!</h2>
      <p>Your ID is: {user.id}</p> */}
{/* <LogOutButton className="btn" /> */ }
      // import LogOutButton from '../LogOutButton/LogOutButton';