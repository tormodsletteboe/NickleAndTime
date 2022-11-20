import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';


function* incrementVisitCount(action){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
      
          // send the action.payload as the body
          // the config includes credentials which
          // allow the server session to recognize the user
          yield axios.put('/api/user/user_avoidplace/incrementVisitCount', action.payload, config);
          yield put({
            type: 'FETCH_PLACES_TO_AVOID'
          })
    } 
    catch (error) {
        console.error('Error in incrementVisitCount',error);
    }
}


function* serverSaga() {
    yield takeLatest('INCREMENT_VISIT_COUNT', incrementVisitCount);
  }
  
  export default serverSaga;