import { put, take, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

// worker Saga: will be fired on "REGISTER" actions
function* registerUser(action) {
  try {
    // clear any existing error on the registration page
    yield put({ type: 'CLEAR_REGISTRATION_ERROR' });

    // passes the username and password from the payload to the server
  
    yield axios.post('/api/user/register', action.payload);

    // automatically log a user in after registration
    yield put({ type: 'LOGIN', payload: action.payload });

    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({ type: 'SET_TO_LOGIN_MODE' });
  } catch (error) {
    console.log('Error with user registration:', error);
    yield put({ type: 'REGISTRATION_FAILED' });
  }
}

//TODO: stop using this
// function* verifyPhoneNumber(action){
//   try {
//     yield put({type:'CLEAR_REGISTRATION_ERROR'});
//    let validationCode = yield axios.post('/api/user/validate_phonenumber', action.payload);
//    if(validationCode.data.code ===21450){
//     yield put({ type: 'PHONENUMBER_ALREADY_REGISTERED' });
//    }
//    else if(validationCode.data.code === 13224 || validationCode.data.code === 400){
//     yield put({ type: 'NOT_A_VALID_PHONE_NUMBER' });
//    }
//    else{
//     yield put({type: 'ENTER_THIS_CODE',payload: validationCode.data});
//    }
   
//   } catch (error) {
//     console.log('Error with phone verifycation:', error);
//   }
// }


function* verifyNumberBySMS(action){
  try {
   yield put({type:'CLEAR_REGISTRATION_ERROR'});
   //let validationCode = 

   const status = yield axios.post('/api/user/smsValidateNumber', action.payload);
   
  
   if(status.data=='pending'){
    yield put({type: 'TEXT_SENT_OUT'});
   }
   else{
    yield put({type:'ERROR_SENDING_OUT_SMS'});
   }
   
  } catch (error) {
    console.log('Error with phone verifycation by sms:', error);
  }
}

function* verifyCodeSMS(action){
  try {
    yield put({type:'CLEAR_REGISTRATION_ERROR'});
    //let validationCode = 

    const status = yield axios.post('/api/user/checkStatusOfVerifyCodeSMS', action.payload);
    if(status.data=='approved'){
     
      yield put({type: 'SMS_CODE_APPROVED'});
     }
     else{
      yield put({type:'SMS_CODE_NOT_APPROVED'});
     }
   } catch (error) {
     console.log('Error with phone verifycation code by sms:', error);
   }
}

function* registrationSaga() {
  yield takeLatest('REGISTER', registerUser);
  // yield takeLatest('VERIFY_NUMBER',verifyPhoneNumber);
  yield takeLatest('VERIFY_NUMBER_SMS',verifyNumberBySMS);
  yield takeLatest('VERIFY_CODE_SMS',verifyCodeSMS);
}

export default registrationSaga;
