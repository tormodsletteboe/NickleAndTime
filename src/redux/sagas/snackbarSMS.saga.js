import axios from 'axios';
import { put, takeLatest } from 'redux-saga/effects';

function* getLatestSMS(){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
    
    
          // send the action.payload as the body
        // the config includes credentials which
        // allow the server session to recognize the user
        const result = yield axios.get('/api/user/latestsms', config);
        console.log('latest sms', result.data[0]);
        yield put({
            type: 'SET_LATEST_SMS',
            payload: result.data[0]
        })
    } 
    catch (error) {
        console.log('Error with getLatestSMS:', error);
    }

}

function* latestSMSSaga() {
    yield takeLatest('FETCH_LATEST_SMS',getLatestSMS);
  }
  
  export default latestSMSSaga;