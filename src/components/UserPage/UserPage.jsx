
import React from 'react';
// import { useEffect,useState } from 'react';
// import UbiGoogleMaps from '../UbiLabsGoogleMaps/UbiGoogleMaps';
import GoogleMapNickleAndTime from '../GoogleMap/GoogleMapNickleAndTime';
import PlacesToAvoidDrawer from '../Drawer/Drawer';





function UserPage() {
  // this component doesn't do much to start, just renders some user reducer info to the DOM
 
  

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