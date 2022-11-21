
const axios = require('axios');

async function testFunction() {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
 
  let res = await axios.get('/messages/test');
  console.log(res);

}

testFunction();

///messages
//let res = await axios.get('https://api.github.com/users/janbodnar');
//   let nOfFollowers = res.data.followers;
//   let location = res.data.location;

//   console.log(`# of followers: ${nOfFollowers}`)
//   console.log(`Location: ${location}`)