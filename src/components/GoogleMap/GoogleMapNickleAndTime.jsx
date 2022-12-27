import React from "react";
import { useRef } from "react";
import { useCallback } from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./GoogleMapNickleAndTime.css";
import globalconst from "../../GlobalVar.jsx";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

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

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Circles from "./Circles";
import Tooltip from "@mui/material/Tooltip";
import FormGroup from "@mui/material/FormGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Switch from "@mui/material/Switch";
import { Typography } from "@mui/material";

//google maps options
const containerStyle = {
  width: "100%",
  height: "80vh",
};
const center = {
  lat: 44.941738,
  lng: -93.357366,
};

//get location options
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

//if get location failed
function error(err) {
  console.log(`ERROR(${err.code}): ${err.message}`);
}

//main comp
function GoogleMapNickleAndTime() {
  const [
    carLocationIsTheSameAsDeviceLocation,
    setCarLocationIsTheSameAsDeviceLocation,
  ] = useState(true);
  
  const mapRef = useRef();
  const marker = useRef();
  const infowindow = useRef();
  const watchIdRef = useRef();

  const [lat, setLat] = useState(44.941738);
  const [lng, setLng] = useState(-93.357366);
  const [carLat, setCarLat] = useState(44.941738);
  const [carLng, setCarLng] = useState(-93.357366);

  const [placeSelected, SetPlaceSelected] = useState([]);
  const [visitlimit, setVisitLimit] = useState(0);
  const [businessName, setBusinessName] = useState();
  const [address, setAddress] = useState();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  //handle car position changed
  const handleCarPositionChanged = () => {
    if (!mapRef.current) {
      console.log("returned no mapRef");
      return;
    }
    // const bounds = mapRef.current.getBounds();
    //  const sw = {lat: bounds.Wa.lo,lng:bounds.Ia.lo};
    //  const ne = {lat:bounds.Wa.hi,lng:bounds.Ia.hi};

    // console.log('bounds ',bounds);
    // console.log('sw ',sw);
    // console.log('ne ',ne);
    
    if(carLocationIsTheSameAsDeviceLocation){
      mapRef.current?.panTo({ lat: carLat, lng: carLng });
    }
   
  };

  //try to get a location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(success3, error, options);
    //start the watch right away, from useeffect
    watchIdRef.current = navigator.geolocation.watchPosition(success, error, options);
    
  };
 
  

  const success3 = (pos) => {

    const crd = pos.coords;
    setCarLat(crd.latitude);
    setCarLng(crd.longitude);
    if (!mapRef.current) {
      return;
    }
    mapRef.current.panTo({lat: carLat,lng: carLng});
  };


  //used for watchposition
  const success = (pos) => {
    const crd = pos.coords;
    
    if (carLocationIsTheSameAsDeviceLocation) {
     
      // setCarLat(crd.latitude);
      // setCarLng(crd.longitude);
      dispatch({
        type: "UPDATE_CURRENT_LOCATION",
        payload: {
          current_latitude: crd.latitude,
          current_longitude: crd.longitude,
        },
      });
    }
  };


  //user clicks the add button
  function onAdd() {
    //create a dispatch with a payload to update 2 tables
    try {
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
    } catch (error) {
      console.log("error in add", error);
    }
  }

  //on component load
  useEffect(() => {
    //center the map on the location of the computer
    getLocation();
  }, []);

  const handleOnClickMap = async (e) => {
    if (!e.placeId) return;

    //prevent default infowindow
    e.stop();

    const results = await getGeocode({ placeId: e.placeId });
    SetPlaceSelected(results);
    //console.log(results);
    //console.log(results[0].formatted_address);

    const { lat, lng } = await getLatLng(results[0]);

    setLat(lat);
    setLng(lng);

    const request = {
      placeId: e.placeId,
      fields: ["name", "formatted_address", "place_id", "geometry"],
    };
    const service = new window.google.maps.places.PlacesService(mapRef.current);
    //console.log(service);
    service.getDetails(request, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place &&
        place.geometry &&
        place.geometry.location
      ) {
        marker.current.setPosition({ lat, lng });
        marker.current.setMap(mapRef.current);

        infowindow.current.setContent(place.name);
        infowindow.current.open({
          anchor: marker.current,
          map: mapRef.current,
        });
        setBusinessName(place.name);
        setAddress(place.formatted_address);
      }
    });

    //mapRef.current?.panTo({lat,lng});
  };

  const onLoad = useCallback((map) => {
    return (
      (mapRef.current = map),
      (infowindow.current = new window.google.maps.InfoWindow()),
      (marker.current = new window.google.maps.Marker())
    );
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
          Map={mapRef}
          BusinessNameFromClickedOnMap={businessName}
          AddressFromNameClickedOnMap={address}
          SetBNameFromClickedOnMap={setBusinessName}
          SetAddressFromNameClickedOnMap={setAddress}
        />

        {/* visit limit */}
        <Tooltip title={"Choose visits allowed per week"}>
          <TextField
            size="small"
            variant="outlined"
            label="Visits/Week"
            onChange={(evt) => {
              if (isNaN(evt.target.value)) {
                setVisitLimit(0);
              } else {
                setVisitLimit(Number(evt.target.value));
              }
            }}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            sx={{ height: 1 }}
            type="text"
            value={visitlimit}
          />
        </Tooltip>
        <Button variant="contained" onClick={onAdd} sx={{ height: 40 }}>
          Add
        </Button>
      </Stack>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onClick={handleOnClickMap}
        options={{ disableDefaultUI: true, clickableIcons: true }}
        onLoad={onLoad}
      >
        {/* Child components, such as markers, info windows, etc. */}

        <FormControl component="fieldset">
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="top"
              control={
                <Tooltip title={carLocationIsTheSameAsDeviceLocation ? (
                  <Typography variant="button">Volov icon location is equal to device location.</Typography>
                ) : (
                  <Typography variant="button">Volvo icon can be dragged and dropped freely on the map</Typography>
                )} >
                  <Switch
                    color="primary"
                    checked={carLocationIsTheSameAsDeviceLocation}
                    onChange={()=>{
                      setCarLocationIsTheSameAsDeviceLocation(!carLocationIsTheSameAsDeviceLocation);
                    }}
                  />
                </Tooltip>
              }
              label={
                carLocationIsTheSameAsDeviceLocation ? (
                  <Typography variant="button">Volvo = Device</Typography>
                ) : (
                  <Typography variant="button">Drag & Drop</Typography>
                )
              }
              labelPlacement="bottom"
            />
          </FormGroup>
        </FormControl>

        <Marker
          position={{ lat: Number(carLat), lng: Number(carLng) }}
          draggable={!carLocationIsTheSameAsDeviceLocation}
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
          onPositionChanged={handleCarPositionChanged}
          animation={2}
          icon={{ url: "./volvo.png" }}
        />
        {/* {clickedPosition && <InfoWin center={clickedPosition}/>} */}
        {/* <Marker position={{ lat: Number(44.948545), lng: Number(-93.349296) }} /> */}
        {/* <InfoWin center={center} /> */}
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
  Map,
  BusinessNameFromClickedOnMap,
  SetBNameFromClickedOnMap,
  AddressFromNameClickedOnMap,
  SetAddressFromNameClickedOnMap,
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  //console.log(BusinessNameFromClickedOnMap);

  useEffect(() => {
    if (BusinessNameFromClickedOnMap) {
      console.log("b name ran", BusinessNameFromClickedOnMap);
      setValue(
        BusinessNameFromClickedOnMap + ` ${AddressFromNameClickedOnMap}`
      );
      clearSuggestions();
    }
  }, [AddressFromNameClickedOnMap]);
  //handles the user selecting a location from suggested places
  const handleSelect = async (address) => {
    //console.log('add',address);
    SetBNameFromClickedOnMap("");
    SetAddressFromNameClickedOnMap("");
    clearSuggestions();
    setValue(address, false);
    const results = await getGeocode({ address });
    console.log(address);
    console.log(results);
    console.log(results[0]);

    const { lat, lng } = await getLatLng(results[0]);
    SetLat(lat);
    SetLng(lng);

    SetPlaceSelected(results);
    SetB_Name(address.split(",")[0]);

    Map.current.setZoom(17);
    Map.current?.panTo({ lat: lat, lng: lng });
    clearSuggestions();
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
