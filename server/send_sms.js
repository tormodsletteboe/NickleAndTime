require('dotenv').config();

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);



  const sendMsg =()=>{
    client.messages
    .create({
       body: 'Hi Erin it is your husband sending sms from his program',
       from: '+14254751813',
       to: '+19185109383'
     })
    .then(message => console.log(message.sid));
  }
  module.exports = sendMsg;