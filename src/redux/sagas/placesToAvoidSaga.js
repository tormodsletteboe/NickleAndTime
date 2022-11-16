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
    } 
    catch (error) {
        console.error('Error in addPlaceToAvoid',error);
    }
    

}
function* placesToAvoidSaga() {
    yield takeLatest('ADD_PLACE_TO_AVOID', addPlaceToAvoid);
  }
  
  export default placesToAvoidSaga;