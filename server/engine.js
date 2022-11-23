
// const axios = require('axios');
const pool = require('./modules/pool');
const cron = require('node-cron');
const msg = require('./send_sms');
const {getUsersLocation,getLocations_OfPlacesUserIsAvoiding} = require('./services/users');
const {getDistanceFromLatLonIn_meters} = require('./services/distance.calc');
const {incrementVisitCount,resetVisitCount} = require('./services/user_avoidplace');
const dontGetCloserThanThis = 100; //100 meters
//engine
cron.schedule('*/60 * * * * *', async () => {
    let date = new Date();
    console.log(date.toLocaleTimeString());
    //console.log('running a task every 60 seconds');
    let usersLocation = await getUsersLocation();
    for (let usr of usersLocation) {
        let userId = usr.user_id;
        let usr_lat = usr.current_latitude;
        let usr_lng = usr.current_longitude;
        //console.log('user: ',userId);

        //grab locations the places this user is trying to avoid
        let user_avoidLocations = await getLocations_OfPlacesUserIsAvoiding(userId);
        // console.log(user_avoidLocations);
        for (let place of user_avoidLocations) {
            let lat = place.latitude;
            let lng = place.longitude;
            let distance = getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);
            //console.log(`user ${userId} is ${distance} meters from ${place.name}`);
            if (distance < dontGetCloserThanThis) {
                //this 👇 code will need to change, need to be async, let people move about, maybe deal with this using the tables, boolean or timer
                setTimeout(() => {
                    let distance2 = getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);
                    if (distance2 < dontGetCloserThanThis) {
                        //increment visit count and send out an sms
                        incrementVisitCount(userId,place.id);
                        console.log(`user ${userId} you need to get the heck away from ${place.name}`);
                    }
                }, 6000); //wait 1 min


            }
            
        }
       

    }

    //resetVisitCount();
    //msg();
});

//house keeping, should run 1 time per day, but for demo it will have to run, more often
cron.schedule('*/5 * * * *', () => {
    let date = new Date();
    console.log(date.toLocaleTimeString());
    console.log('running a task every 5 minutes');
    resetVisitCount();



});







module.exports = { cron };


