import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Circle } from "@react-google-maps/api";
import { useState, useEffect } from "react";
import "./GoogleMapNickleAndTime.css";
import globalconst from "../../GlobalVar.jsx";
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
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Circles from "./Circles";

//google maps options
const containerStyle = {
  width: "100%",
  height: "700px",
};

//get location options
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

//if get location failed
function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

function GoogleMapNickleAndTime() {
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [carLat, setCarLat] = useState(44.948545);
  const [carLng, setCarLng] = useState(-93.349296);

  const [placeSelected, SetPlaceSelected] = useState([]);
  const [visitlimit, setVisitLimit] = useState(0);
  const [businessName, setBusinessName] = useState();

  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  // useEffect(() => {
  //   window.addEventListener('keydown', (evt) => {
  //     if (evt.code === 'ArrowDown') {
  //       setCarLat(carLat - 0.0001);
  //     }
  //   });
  // })

  //try to get a location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(success, error, options);
  };
  //successfully got a location
  const success = (pos) => {
    const crd = pos.coords;
    // setCarLat(crd.latitude);
    // setCarLng(crd.longitude);
    setLat(crd.latitude);
    setLng(crd.longitude);
  };
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
      type: "ADD_PLACE_TO_AVOID",
      payload: {
        user_id,
        visit_limit,
        name,
        google_place_id,
        latitude,
        longitude,
      },
    });
  }

  //on component load
  useEffect(() => {
    //center the map on the location of the computer
    getLocation();
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_PUBLIC_MAP_API_KEY}
      libraries={globalconst.libraries}
    >
      {/* search bar is in the stack */}
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="flex-end"
        spacing={2}
        sx={{ marginBottom: 1 }}
      >
        <PlacesAutocomplete
          className="autocomp"
          SetPlaceSelected={SetPlaceSelected}
          SetLat={setLat}
          SetLng={setLng}
          SetB_Name={setBusinessName}
        />

        {/* visit limit */}
        <TextField
          size="small"
          variant="outlined"
          label="Visits/Week"
          onChange={(evt) => setVisitLimit(Number(evt.target.value))}
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
          sx={{ height: 1 }}
          type="number"
          value={visitlimit}
        />
        <Button variant="contained" onClick={onAdd} sx={{ height: 40 }}>
          Add
        </Button>
      </Stack>
//45.163385, -93.050790
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{ lat: Number(45.163385), lng: Number(-93.050790) }}
        zoom={13}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <></>
        <Marker
          position={{ lat: Number(carLat), lng: Number(carLng) }}
          draggable
          onDragEnd={(e) => {
            setCarLat(e.latLng.lat());
            setCarLng(e.latLng.lng());
            dispatch({
              type: "UPDATE_CURRENT_LOCATION",
              payload: {
                current_latitude: e.latLng.lat(),
                current_longitude: e.latLng.lng(),
              },
            });
          }}
          animation={2}
          icon={{ url: "./volvo.png" }}
        />
        {/* <Marker position={{ lat: Number(44.948545), lng: Number(-93.349296) }} /> */}

        {/* add avoid circless */}
        <Circles />
      </GoogleMap>
    </LoadScript>
  );
}

//component to search for a location to avoid
const PlacesAutocomplete = ({
  SetPlaceSelected,
  SetLat,
  SetLng,
  SetB_Name,
}) => {
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
    <Combobox className="combobox" onSelect={handleSelect}>
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

export default GoogleMapNickleAndTime;
