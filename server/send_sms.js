//require('dotenv').config();

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.VERIFICATION_SID;

const client = require('twilio')(accountSid, authToken);



  const sendMsg =(message,to)=>{
    client.messages
    .create({
       body: message,
       from: '+14254751813',
       to: `+1${to}`
     })
    .then(message => console.log(message.sid));
  }

  const validateNumber =  (name,phoneNumber)=>{
    const result = client.validationRequests.create({
      friendlyName: name,
      phoneNumber:`+1${phoneNumber}`
     
    });
    return result;
  }

  const smsValidateNumber =(phoneNumber) =>{
    client.verify.v2.services(verifySid)
                .verifications
                .create({to: `+1${phoneNumber}`, channel: 'sms'})
                .then(verification => console.log(verification.status));
  }

  const checkStatusOfVerifyCodeSMS = (phoneNumber,code) =>{
    client.verify.v2.services(verifySid)
      .verificationChecks
      .create({to: `+1${phoneNumber}`, code: code})
      .then(verification_check => console.log(verification_check.status));
  }
 
   module.exports = {
    sendMsg,
    validateNumber,
    smsValidateNumber,
    checkStatusOfVerifyCodeSMS,
  };
