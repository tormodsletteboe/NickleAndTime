import React from 'react'
import { Circle } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { Marker } from '@react-google-maps/api';

const handleOnClick = (place) => {
  console.log(place.name);
}

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
          //console.log(place.name, place.visit_count, place.visit_limit);
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
            <>
              <Circle
                key={index}
                center={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
                // required
                options={optionsCircle}
              />
              <Marker
              key={place.latitude}
                position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
                onClick={() => { handleOnClick(place) }}
              />
            </>
          );
        }
      })}
    </>
  );
}
export default Circles;