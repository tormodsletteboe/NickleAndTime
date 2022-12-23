import React from "react";
import GoogleMapNickleAndTime from "../GoogleMap/GoogleMapNickleAndTime";
import PlacesToAvoidDrawer from "../Drawer/Drawer";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

//get location options
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

//get location error function
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function UserPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    //get location right away, then every so often
    getLocation();
    
    const interval = setInterval(() => {
      dispatch({
        type: "FETCH_PLACES_TO_AVOID",
      });
    }, 20000); //fetch places to avoid from database every 2 seconds

    return () => {
      clearInterval(interval);
    }; // clear the interval when leaving this component
  }, []);

  //get the location of the user
  const getLocation = () => {
    navigator.geolocation.watchPosition(success, error, options);
  };
  //update database with this users current location
  const success = (pos) => {
    //console.log('the position of this device changed, update sent to database');
    const crd = pos.coords;
    dispatch({
      type: "UPDATE_CURRENT_LOCATION",
      payload: {
        current_latitude: crd.latitude,
        current_longitude: crd.longitude,
      },
    });
  };

  return (
    <div className="container">
      <GoogleMapNickleAndTime />
      <PlacesToAvoidDrawer />
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
