import React from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
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
import { useDispatch,useSelector } from 'react-redux';



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
  const [placeSelected, SetPlaceSelected] = useState([]);
  const [visitlimit, setVisitLimit] = useState();
  const dispatch = useDispatch();
  const user = useSelector((store)=>store.user);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  }
  const success = (pos) => {
    const crd = pos.coords;
    setLat(crd.latitude);
    setLng(crd.longitude);
    // console.log('Your current position is:');
    // console.log(`Latitude : ${crd.latitude}`);
    // console.log(`Longitude: ${crd.longitude}`);
    // console.log(`More or less ${crd.accuracy} meters.`);
  }
  function onAdd() {
    //create a dispatch with a payload to update 2 tables
    console.log('in onAdd');
    console.log(user);
    console.log(placeSelected);
    console.log(lat);
    console.log(lng);
    console.log(visitlimit);
    
    //junction table
    const user_id = user.id;
    const visit_limit = visitlimit;

    //place to avoid table
    const name = 'starbucks';
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

  useEffect(() => {
    getLocation();
  }, [])

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCZytryhTMKdfGGhl-A-6dRhHdgj_pz1gs"
      libraries={globalconst.libraries}
    >
      <PlacesAutocomplete SetPlaceSelected={SetPlaceSelected} SetLat={setLat} SetLng={setLng} />
      {/* <button onClick={() => console.log('selected is :', placeSelected[0].place_id)}>CLicke Me</button>
      <button onClick={() => console.log(`lat: ${lat} lng:${lng}`)} style={{marginBottom:5}}>CLicke Me</button> */}
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
        <Marker position={{ lat: lat, lng: lng }} />

      </GoogleMap>

    </LoadScript>
  )
}


const PlacesAutocomplete = ({ SetPlaceSelected, SetLat, SetLng }) => {

  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {

    // console.log('in handleselect');
    setValue(address, false);
    clearSuggestions();
    console.log('asddddddddddd', address);
    const results = await getGeocode({ address });
    console.log('resultttttttt', results);
    const { lat, lng } = await getLatLng(results[0]);
    // console.log(`lat: ${lat} lng: ${lng}`);
    SetLat(lat);
    SetLng(lng);
    SetPlaceSelected(results);
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