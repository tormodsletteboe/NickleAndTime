import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* updateCurrentLocation(action){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
    
    
          // send the action.payload as the body
        // the config includes credentials which
        // allow the server session to recognize the user
        yield axios.post('/api/user/currentLocation', action.payload, config);
    } 
    catch (error) {
        console.log('Error with updateCurrentLocation:', error);
    }

}

function* currentLocationSaga() {
    yield takeLatest('UPDATE_CURRENT_LOCATION',updateCurrentLocation) ;
    
  }
  
  export default currentLocationSaga;