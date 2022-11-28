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
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';



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
  const [mapLat,setMapLat] = useState();
  const [mapLng,setMapLng] = useState();
  

  const [placeSelected, SetPlaceSelected] = useState([]);
  const [visitlimit, setVisitLimit] = useState();
  const [businessName, setBusinessName] = useState();

  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const placesToAvoid = useSelector((store) => store.placesToAvoid);
 
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
    console.log('useeffect in google maps ran');
    getLocation();
  }, [])

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDS1ELw3oAV20LEm8HZJ_WlMy-y7t82AMo"
      libraries={globalconst.libraries}
    >
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={2}
        sx={{ marginBottom: 1 }}

      >
        <PlacesAutocomplete
          className='autocomp'
          SetPlaceSelected={SetPlaceSelected}
          SetLat={setLat}
          SetLng={setLng}
          SetB_Name={setBusinessName}
        />


        <TextField
          size='small'
          variant="outlined"
          label='Visits/Week'
          onChange={(evt) => setVisitLimit(Number(evt.target.value))}
          inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
          sx={{ height: 1 }}
          type="number"

        />
        <Button
          variant="contained"
          onClick={onAdd}
          sx={{ height: 40 }}
        >
          Add
        </Button>
      </Stack>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: Number(lat), lng: Number(lng) }}
        zoom={13}
        onCenterChanged={()=>console.log('test')}
      >
        { /* Child components, such as markers, info windows, etc. */}
        <></>
        {/* {console.log('usrloc',usrLoc)} */}
        <Marker position={{ lat: Number(lat), lng: Number(lng) }} 
        draggable
        onDragEnd={(e)=>{
          setLat(e.latLng.lat());
          setLng(e.latLng.lng());
          dispatch({
            type: 'UPDATE_CURRENT_LOCATION',
            payload: {
              current_latitude: e.latLng.lat(),
              current_longitude: e.latLng.lng()
            }
          });
        }}
     
        />
        {placesToAvoid.map(place => {
          if (place.active) {
            let optionsCircle = {
              strokeColor: '',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '',
              fillOpacity: 0.35,
              clickable: false,
              draggable: false,
              editable: false,
              visible: true,
              radius: 100,
              zIndex: 1
            }
            console.log(place.name, place.visit_count,place.visit_limit);
            if(place.visit_count>=place.visit_limit){
              optionsCircle.strokeColor = '#000000';
              optionsCircle.fillColor = '#FF0000';
            }
            else if(place.visit_limit-place.visit_count==1){
              optionsCircle.strokeColor = '#000000';
              optionsCircle.fillColor = '#FFFF00';
            }
            else{
              optionsCircle.strokeColor = '#000000';
              optionsCircle.fillColor = '#008000';
            }
            return (<Circle
              key={place.id}
              center={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
              // required
              options={optionsCircle}
            />);
          }
        })}

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
    <Combobox className='combobox' onSelect={handleSelect}>
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