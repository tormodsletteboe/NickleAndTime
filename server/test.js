
const axios = require('axios');

async function getNumberOfFollowers() {
    const config = {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      };
 //let res = await axios.get('https://api.github.com/users/janbodnar');
  let res = await axios.get('/messages/test');
  console.log(res);
///messages
//   let nOfFollowers = res.data.followers;
//   let location = res.data.location;

//   console.log(`# of followers: ${nOfFollowers}`)
//   console.log(`Location: ${location}`)
}

getNumberOfFollowers();