import React from 'react'
import { Circle } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { Marker, InfoWindow, } from '@react-google-maps/api';
import CircularStatic from './CircularProgress';
import { OverlayView } from '@react-google-maps/api';
const handleOnClick = (place) => {
  // console.log(place.name);
}
const divStyle = {
  background: 'white',
  border: '1px solid #ccc',
  padding: 15
};

function Circles() {
  const placesToAvoid = useSelector((store) => store.placesToAvoid);
  return (
    <>
      {placesToAvoid.map((place,index) => {
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
         
          if (place.visit_count >= place.visit_limit) {
            optionsCircle.strokeColor = '#000000';
            optionsCircle.fillColor = '#FF0000';
          }
          else if (place.visit_limit - place.visit_count == 1) {
            optionsCircle.strokeColor = '#000000';
            optionsCircle.fillColor = '#FFFF00';
          }
          else {
            optionsCircle.strokeColor = '#000000';
            optionsCircle.fillColor = '#008000';
          }
          return (
            <div key={index}>
              <Circle
                center={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
                // required
                options={optionsCircle}
              />
               {!place.currently_visiting ?
              <Marker
                position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
                onClick={() => { handleOnClick(place) }}
                title={place.name}
              />
              :
              <></>
            }
              {place.currently_visiting &&
              <OverlayView position={{ lat: Number(place.latitude), lng: Number(place.longitude) }} mapPaneName={OverlayView.MARKER_LAYER} >
                <CircularStatic/>
              </OverlayView>
              }
            </div>
          );
        }
      })}
    </>
  );
}
export default Circles;