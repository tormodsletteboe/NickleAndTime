import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Circle } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import './GoogleMapNickleAndTime.css';
import globalconst from '../../GlobalVar.jsx';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useDispatch, useSelector } from 'react-redux';

const optionsCircle = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 100,
  zIndex: 1
}

//google maps options
const containerStyle = {
  width: '100%',
  height: '700px'
};


//get location options
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};


//if get location failed
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function GoogleMapNickleAndTime() {
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [placeSelected, SetPlaceSelected] = useState([]);
  const [visitlimit, setVisitLimit] = useState();
  const [businessName, setBusinessName] = useState();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const placesToAvoid = useSelector((store) => store.placesToAvoid);
  const usrLoc = useSelector((store) => store.currentLocation);
  //try to get a location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
  //successfully got a location
  const success = (pos) => {
    const crd = pos.coords;
    setLat(crd.latitude);
    setLng(crd.longitude);
  }
  //user clicks the add button
  function onAdd() {
    //create a dispatch with a payload to update 2 tables

    //junction table
    const user_id = user.id;
    const visit_limit = visitlimit;

    //place to avoid table
    const name = businessName;
    const google_place_id = placeSelected[0].place_id;
    const latitude = lat;
    const longitude = lng;

    dispatch({
      type: 'ADD_PLACE_TO_AVOID',
      payload: {
        user_id,
        visit_limit,
        name,
        google_place_id,
        latitude,
        longitude
      }
    });
  }

  //on component load
  useEffect(() => {
    //center the map on the location of the computer
    getLocation();
  }, [])

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDS1ELw3oAV20LEm8HZJ_WlMy-y7t82AMo"
      libraries={globalconst.libraries}
    >
      <PlacesAutocomplete SetPlaceSelected={SetPlaceSelected} SetLat={setLat} SetLng={setLng} SetB_Name={setBusinessName} />
      <button onClick={onAdd}>Add</button>
      <input
        type={'number'}
        placeholder='weekly visit limit ex:2'
        onChange={(evt) => setVisitLimit(Number(evt.target.value))}
      />
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: lat, lng: lng }}
        zoom={18}
      >
        { /* Child components, such as markers, info windows, etc. */}
        <></>
        {/* {console.log('usrloc',usrLoc)} */}
        <Marker position={{ lat: lat, lng: lng }} />
        <Marker position={{ lat: usrLoc.current_latitude, lng: usrLoc.current_longitude }} />
        {placesToAvoid.map(place => (
          <Circle
          key={place.id}
            // // optional
            // onLoad={onLoad}
            // // optional
            // onUnmount={onUnmount}
            // required
            center={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
            // required
            options={optionsCircle}
          />
        ))}




      </GoogleMap>

    </LoadScript>
  )
}

//component to search for a location to avoid
const PlacesAutocomplete = ({ SetPlaceSelected, SetLat, SetLng, SetB_Name }) => {

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  //handles the user selecting a location from suggested places
  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    SetLat(lat);
    SetLng(lng);
    SetPlaceSelected(results);
    SetB_Name(address.split(",")[0]);
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="combobox-input"
        placeholder="Search an address"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};


export default GoogleMapNickleAndTime