
import React from 'react';
// import { useEffect,useState } from 'react';
// import UbiGoogleMaps from '../UbiLabsGoogleMaps/UbiGoogleMaps';
import GoogleMapNickleAndTime from '../GoogleMap/GoogleMapNickleAndTime';
import PlacesToAvoidDrawer from '../Drawer/Drawer';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


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

  const dispatch = useDispatch();
  const currentLocationData = useSelector((store) => store.currentLocation);
  const placesToAvoidData = useSelector((store) => store.placesToAvoid);
  const severityMsg = useSelector((store)=> store.severityMsg);

  useEffect(() => {
    // const interval = setInterval(() => getLocation(), 6000);
    // //dostuff();
    // return () => clearInterval(interval);
    //TODO: uncomment above
  }, []);


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
  const resetVisitCountsIfConditionsAllow = ()=> {
    dispatch({
      type: 'RESET_VISIT_COUNT'
    })
  }



  return (
    <div className="container">
      <GoogleMapNickleAndTime />
      <button onClick={() => dostuff(currentLocationData, placesToAvoidData, dispatch,severityMsg)}>CLICK ME</button>
      <button onClick={resetVisitCountsIfConditionsAllow}> RESET VISIT COUNT</button>
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



////////////////move this out eventuelly //////////////////////////////
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}


// const lat1 = 59.3293371;
// const lng1 = 13.4877472;

// const lat2 = 59.3225525;
// const lng2 = 13.4619422;

const dostuff = (currentLocationD, placesToAv, callback, severityMsg) => {
  //const userLat = currentLocationData
  console.log(new Date().toLocaleString());
  let userLat = currentLocationD[0].current_latitude;
  let userLng = currentLocationD[0].current_longitude;

  let places = placesToAv.map((place) => {
    return {
      lat: place.latitude,
      lng: place.longitude,
      id: place.id,
      visitCount: place.visit_count,
      visitLimit: place.visit_limit
    }
  });

  for (let place of places) {
    let distance = getDistanceFromLatLonInKm(userLat, userLng, place.lat, place.lng) * 1000;
    let distance2 = 0;
    console.log("the distance is: ", distance, 'm');
    if (distance < 100) {
      console.log('You are to close .........');
      const tmer = setTimeout(() => {
        distance2 = getDistanceFromLatLonInKm(userLat, userLng, place.lat, place.lng) * 1000;
        console.log("the distance is: ", distance2, 'm');
        if (distance2 < 100) {
          //update visit count
          callback({
            type: 'INCREMENT_VISIT_COUNT',
            payload: {
              place_id: place.id
            }
          })
          //calculate severity
          let visitCount = place.visitCount + 1; // pluss 1 here means that the data has not been update in time, so eventually it will be 
          let visitLimit = place.visitLimit;
          let severity = -1;
          if (visitLimit == 0) {
            severity = 3;
          }
          else {
            severity = visitCount / visitLimit;
            if (severity < 0.5) {
              severity = 1;
            }
            else if (severity >= 0.5 && severity <= 1.0) {
              severity = 2;
            }
            else {
              severity = 3;
            }
          }

          console.log('severity is: ', severity);
          //get message from table with id, based on severity
           callback({
            type: 'FETCH_SEVERITY_MSG',
            payload: {
              severity: severity,
              avoidPlaceId: place.id
            }
          })
         
         
        }
      }, 6000);

    }

  }
  setTimeout(()=>{console.log(`xxxxxxx`,severityMsg[0].body)},1000);
}



