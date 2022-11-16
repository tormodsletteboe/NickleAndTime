import React, {useState, useCallback, forwardRef} from 'react';
import {GoogleMapProvider} from '@ubilabs/google-maps-react-hooks';

function UbiGoogleMaps() {
  const [mapContainer, setMapContainer] = useState(null);
  const mapRef = useCallback(node => {
    node && setMapContainer(node);
  }, []);

  const mapOptions = {
    // Add your map options here
    // `center` and `zoom` are required for every map to be displayed
    center: {lat: 53.5582447, lng: 9.647645},
    zoom: 6
  };

  return (
    <GoogleMapProvider
      googleMapsAPIKey="AIzaSyCZytryhTMKdfGGhl-A-6dRhHdgj_pz1gs"
      mapContainer={mapContainer}
      mapOptions={mapOptions}>
      <React.StrictMode>
        <div ref={ref} style={{height: '100%'}} />
      </React.StrictMode>
    </GoogleMapProvider>
  );
}

export default UbiGoogleMaps;