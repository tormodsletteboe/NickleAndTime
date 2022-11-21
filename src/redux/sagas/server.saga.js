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

function* fetchSeverityMSG(action){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
      
          // send the action.payload as the body
          // the config includes credentials which
          // allow the server session to recognize the user
        //   console.log('action payload is:',action.payload);
          const msg = yield axios.get(`/messages/${action.payload.severity}`,config);
          console.log('msg is:',msg);
          yield put({
            type: 'SET_SEVERITY_MSG',
            payload: msg.data

          });
          //send this to a trigger_sms table
          yield put({
            type: 'POST_TRIGGER_SMS',
            payload: {
                msg_id: msg.data[0].id,
                avoidPlace_id: action.payload.avoidPlaceId
            }
          })
    } 
    catch (error) {
        console.error('Error in fetchSeverityMSG',error);
    }
}
function* postToTriggerSMS(action){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
      
          // send the action.payload as the body
          // the config includes credentials which
          // allow the server session to recognize the user
        //   console.log('action payload is:',action.payload);
        yield axios.post(`/triggersms`,action.payload,config);
        //   console.log('msg is:',msg);
          

    } 
    catch (error) {
        console.error('Error in postToTriggerSMS',error);
    }
}

function* resetVisitCount(){
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          };
      
          // send the action.payload as the body
          // the config includes credentials which
          // allow the server session to recognize the user
        //   console.log('action payload is:',action.payload);
        // console.log('in resetVisitCount');
        yield axios.put(`/api/user/user_avoidplace/resetVisitCount`,config);
    } 
    catch (error) {
        console.error('Error in postToTriggerSMS',error);
    }
}

function* serverSaga() {
    yield takeLatest('INCREMENT_VISIT_COUNT', incrementVisitCount);
    yield takeLatest('FETCH_SEVERITY_MSG', fetchSeverityMSG);
    yield takeLatest('POST_TRIGGER_SMS',postToTriggerSMS);
    yield takeLatest('RESET_VISIT_COUNT',resetVisitCount);
  }
 
  export default serverSaga;