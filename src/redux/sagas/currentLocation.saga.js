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
        yield put({
            type: 'GET_CURRENT_LOCATION'
        })
    } 
    catch (error) {
        console.log('Error with updateCurrentLocation:', error);
    }

}

function* getCurrentLocation(action){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
    
    
          // send the action.payload as the body
        // the config includes credentials which
        // allow the server session to recognize the user
        const result = yield axios.get('/api/user/currentLocation', config);
        // console.log('ressssssult', result);
        yield put({
            type: 'SET_CURRENT_LOCATION',
            payload: result.data[0]
        })
    } 
    catch (error) {
        console.log('Error with updateCurrentLocation:', error);
    }

}

function* removeCurrentLocation(){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
    
    
          // send the action.payload as the body
        // the config includes credentials which
        // allow the server session to recognize the user
        const res = yield axios.delete('/api/user/currentLocation',{data:'nothing'});
        //console.log(res);
        // yield put({
        //     type: 'GET_CURRENT_LOCATION'
        // })
    } 
    catch (error) {
        console.error('Error with removeCurrentLocation:', error);
    }

}

function* currentLocationSaga() {
    yield takeLatest('UPDATE_CURRENT_LOCATION',updateCurrentLocation) ;
    yield takeLatest('GET_CURRENT_LOCATION',getCurrentLocation);
    yield takeLatest('REMOVE_CURRENT_LOCATION',removeCurrentLocation)
  }
  
  export default currentLocationSaga;