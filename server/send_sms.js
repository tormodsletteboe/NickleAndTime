// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = "AC8ccdfa06564d4711d4c7c8656f3460bf";
const authToken = "99f22382818691269a27d51b3ed95029";
const client = require('twilio')(accountSid, authToken);



  const sendMsg =()=>{
    client.messages
    .create({
       body: 'Yo Sam check this out, my server is sending me sms',
       from: '+14254751813',
       to: '+19185109383'
     })
    .then(message => console.log(message.sid));
  }
  module.exports = sendMsg;