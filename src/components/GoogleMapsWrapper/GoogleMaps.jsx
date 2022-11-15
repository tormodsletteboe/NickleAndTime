import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { GoogleMapProvider, useGoogleMap } from '@ubilabs/google-maps-react-hooks';
import { useLoadScript, Marker } from '@react-google-maps/api';
import './GoogleMaps.css';
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

const mapOptions = {
   zoom: 12,
   center: {
      lat: 43.68,
      lng: -79.43
   }

}
export default function GoogleMaps() {
   const { isLoaded } = useLoadScript({
      googleMapsApiKey: "AIzaSyCZytryhTMKdfGGhl-A-6dRhHdgj_pz1gs",
      libraries: ["places"],
   });

   if (!isLoaded) return <div>Loading...</div>;
   return <GoogleMapsTheMap />;
}

function GoogleMapsTheMap() {
   const [mapContainer, setMapContainer] = useState(null);
   const [selected, setSelected] = useState({lat: 44.6, lng: -93.6 });
   const [marker, setMarker] = useState();

  useEffect(()=>{
   // console.log('in useeffect GoogleMapsTheMap');
   // console.log(`selected.lat: ${selected.lat} selected.lng: ${selected.lng}`);

  },[selected])
   

   return (
      <GoogleMapProvider
         googleMapsAPIKey="AIzaSyCZytryhTMKdfGGhl-A-6dRhHdgj_pz1gs"
         options={mapOptions}
         mapContainer={mapContainer}

      >
         <div ref={node => setMapContainer(node)} style={{ height: "100vh" }} />
         <Location />
         <div className="places-container">
            <PlacesAutocomplete setSelected={setSelected} />
         </div>
         {console.log('selected.lat',selected.lat)}
         {/* <Marker position = {{lat: selected.lat, lng: selected.lng}} /> */}
         
         
      </GoogleMapProvider>
   );
}

function Location() {
  
   const [lat, setLat] = useState(43.68);
   const [lng, setLng] = useState(-79.43);

   const { map } = useGoogleMap();
   const markerRef = useRef();

   useEffect(() => {
      if (!map || markerRef.current) return;
      markerRef.current = new google.maps.Marker({ map });
   }, [map]);

   useEffect(() => {
      if (!markerRef.current) return;
      if (isNaN(lat) || isNaN(lng)) return;
      markerRef.current.setPosition({ lat, lng });
      map.panTo({lat, lng });
   }, [lat, lng, map]);

   return (
      <div className='lat-lng'>
         <input
            type="number"
            value={lat}
            onChange={event => setLat(parseFloat(event.target.value))}
            step={0.01}
         />
         <input
            type="number"
            value={lng}
            onChange={event => setLng(parseFloat(event.target.value))}
            step={0.01}
         />
      </div>
   );

}

const PlacesAutocomplete = ({ setSelected }) => {
   const {
      ready,
      value,
      setValue,
      suggestions: { status, data },
      clearSuggestions,
   } = usePlacesAutocomplete();

   const handleSelect = async (address) => {

      console.log('in handleselect');
      setValue(address, false);
      clearSuggestions();

      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
       console.log(`lat: ${lat} lng: ${lng}`);
       console.log(address);
       console.log(results);
      setSelected({ lat, lng });
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