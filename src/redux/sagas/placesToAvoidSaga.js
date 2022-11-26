import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* addPlaceToAvoid(action){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
    
    
          // send the action.payload as the body
        // the config includes credentials which
        // allow the server session to recognize the user
        yield axios.post('/api/user/places', action.payload, config);
        yield put({
            type: 'FETCH_PLACES_TO_AVOID'
        });
    } 
    catch (error) {
        console.error('Error in addPlaceToAvoid',error);
    }
    

}

function* fetchPlacesToAvoid(){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
          const result = yield axios.get('/api/user/places',config);
          yield put({
            type: 'SET_PLACES_TO_AVOID',
            payload: result.data
          })
        
    } 
    catch (error) {
        console.error('Error in fetchPlacesToAvoid',error);
    }
}

function* toggleActive(action){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
    
    
          // send the action.payload as the body
        // the config includes credentials which
        // allow the server session to recognize the user
       const res = yield axios.put('/api/user/toggleactive', action.payload);
        yield put({
            type: 'FETCH_PLACES_TO_AVOID'
        });
    } 
    catch (error) {
        console.error('Error in toggleActive',error);
    }
    

}

function* deleteUserPlace(action){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
    
    
          // send the action.payload as the body
        // the config includes credentials which
        // allow the server session to recognize the user
        console.log('action payyyyyyy',action.payload)
       const res = yield axios.delete('/api/user/delete',{data: action.payload});
       console.log(res);
        yield put({
            type: 'FETCH_PLACES_TO_AVOID'
        });
    } 
    catch (error) {
        console.error('Error in deleteUserPlace',error);
    }
    

}

function* placesToAvoidSaga() {
    yield takeLatest('ADD_PLACE_TO_AVOID', addPlaceToAvoid);
    yield takeLatest('FETCH_PLACES_TO_AVOID',fetchPlacesToAvoid);
    yield takeLatest('TOGGLE_ACTIVE',toggleActive);
    yield takeLatest('DELETE_USER_PLACE',deleteUserPlace);
  }
  
  export default placesToAvoidSaga;