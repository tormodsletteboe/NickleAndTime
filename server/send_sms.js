//require('dotenv').config();

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

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
    const result = client.validationRequests.create({friendlyName: name,phoneNumber:`+1${phoneNumber}`});
    return result;
  }

 
   module.exports = {
    sendMsg,
    validateNumber,
  };
