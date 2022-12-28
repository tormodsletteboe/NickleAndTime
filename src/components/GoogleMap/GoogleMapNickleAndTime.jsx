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
import Checkbox from "@mui/material/Checkbox";
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
  enableHighAccuracy: false,
  maximumAge: 0,
};
//timeout: 5000,

//if get location failed
function error(err) {
  console.log(`ERROR(${err.code}): ${err.message}`);
}

//main comp
function GoogleMapNickleAndTime() {
  const [switchState, setSwitchState] = useState(false);
  const carSameAsDeviceRef = useRef(false);
  const mapRef = useRef();
  const marker = useRef();
  const infowindow = useRef();
  const watchIdRef = useRef();
  const addbuttonClickedRef = useRef(false);

  const [lat, setLat] = useState(44.941738);
  const [lng, setLng] = useState(-93.357366);
  const [carLat, setCarLat] = useState(44.941738);
  const [carLng, setCarLng] = useState(-93.357366);
  const [deviceLocation, setDeviceLocation] = useState();

  const [placeSelected, SetPlaceSelected] = useState([]);
  const [visitlimit, setVisitLimit] = useState(0);
  const [businessName, setBusinessName] = useState();
  const [address, setAddress] = useState();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  const handleChangeCheckbox = (event) => {
    setSwitchState(event.target.checked);
    carSameAsDeviceRef.current = event.target.checked;

    //move the car to device location
    if (carSameAsDeviceRef.current == true) {
      setCarLat(deviceLocation.lat);
      setCarLng(deviceLocation.lng);
    }
  };

  //handle car position changed
  const handleCarPositionChanged = () => {
    if (!mapRef.current) {
      return;
    }
    dispatch({
      type: "UPDATE_CURRENT_LOCATION",
      payload: {
        current_latitude: carLat,
        current_longitude: carLng,
      },
    });

    //while driving pan as the icon moves
    if (carSameAsDeviceRef.current == true) {
      mapRef.current?.panTo({ lat: carLat, lng: carLng });
    }
  };

  //try to get a location
  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(success3, error, options);
    //start the watch right away, from useeffect
  };
  const success3 = (pos) => {
    const crd = pos.coords;
    setCarLat(crd.latitude);
    setCarLng(crd.longitude);
    if (!mapRef.current) {
      return;
    }
    mapRef.current.panTo({ lat: carLat, lng: carLng });
  };

  //used for watchposition
  const success = (pos) => {
    console.log("-------------", pos);
    const crd = pos.coords;
    setDeviceLocation({ lat: crd.latitude, lng: crd.longitude });

    //only update the car location if driving, ie car and device location should be the same,
    if (carSameAsDeviceRef.current == true) {
      setCarLat(crd.latitude);
      setCarLng(crd.longitude);
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

      //clear the search bar
      setAddress();
      setBusinessName();
      setVisitLimit(0);
      SetPlaceSelected([]);
      addbuttonClickedRef.current = true;
      if (!mapRef.current) {
        return;
      }
      mapRef.current?.panTo({ lat: lat, lng: lng });
    } catch (error) {
      console.log("error in add", error);
    }
  }

  //on component load
  useEffect(() => {
    //center the map on the location of the computer
    getLocation();
    //start the watch, used with smart phones, random with pc
    watchIdRef.current = navigator.geolocation.watchPosition(
      success,
      error,
      options
    );
    //TODO:
    // return () => {
    //   navigator.geolocation.clearWatch(watchIdRef.current);
    // };
  }, []);

  const handleOnClickMap = async (e) => {
    if (!e.placeId || carSameAsDeviceRef.current) return;

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
          CarSameAsDeviceRef={carSameAsDeviceRef}
          AddButtonWasClickedRef={addbuttonClickedRef}
        />

        {/* visit limit */}
        <Tooltip title={"Choose visits allowed per week"}>
          <TextField
            size="small"
            variant="outlined"
            label="Visits/Week"
            disabled={carSameAsDeviceRef.current}
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
        <Button
          disabled={carSameAsDeviceRef.current}
          variant="contained"
          onClick={onAdd}
          sx={{ height: 40 }}
        >
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
        
          
          
        

        <FormControl id="bottomright" component="fieldset" sx={{backgroundColor: 'white'}}>
          <FormGroup aria-label="position" row>
            <FormControlLabel
              value="top"
              control={
                <Tooltip
                  title={
                    switchState ? (
                      <Typography variant="button">
                        Volov icon moves as you drive.
                      </Typography>
                    ) : (
                      <Typography variant="button">
                        Volvo icon can be dragged and dropped freely on the map
                      </Typography>
                    )
                  }
                >
                  <Switch
                    color="primary"
                    checked={switchState}
                    onChange={handleChangeCheckbox}
                  />
                </Tooltip>
              }
              label={
                switchState ? (
                  <Typography variant="button">Driving Mode</Typography>
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
          draggable={!switchState}
          onDragEnd={(e) => {
            setCarLat(e.latLng.lat());
            setCarLng(e.latLng.lng());
            mapRef.current?.panTo({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          }}
          onPositionChanged={handleCarPositionChanged}
          animation={2}
          icon={{ url: "./volvo.png" }}
        />

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
  CarSameAsDeviceRef,
  AddButtonWasClickedRef,
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
    console.log("did you run because add was clicked");
    if (BusinessNameFromClickedOnMap) {
      setValue(
        BusinessNameFromClickedOnMap + ` ${AddressFromNameClickedOnMap}`
      );
    }
    if (AddButtonWasClickedRef.current == true) {
      setValue("");
      AddButtonWasClickedRef.current = false;
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
        disabled={!ready || CarSameAsDeviceRef.current}
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
