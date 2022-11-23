
const cron = require('node-cron');
const msg = require('./send_sms');
const {getUsersLocation,getLocations_OfPlacesUserIsAvoiding} = require('./services/users');
const {getDistanceFromLatLonIn_meters} = require('./services/distance.calc');
const {incrementVisitCount,resetVisitCount} = require('./services/user_avoidplace');
const dontGetCloserThanThis = 100; //100 meters
const timeUserIsAllowedToStayBeforeItCountsAsAVisit = 60000; // 1 min

//engine
cron.schedule('*/60 * * * * *', async () => {
    let date = new Date();
    console.log(date.toLocaleTimeString());
    //console.log('running a task every 60 seconds');

    //get the current location of several users
    let usersLocation = await getUsersLocation();

    //itereate through those users current locations, calc distance to places they are avoiding, if within 100 m, start time, if still there
    //increment visit count and send out sms based on visit_count and visit_limit
    for (let usr of usersLocation) {
        let userId = usr.user_id;
        let usr_lat = usr.current_latitude;
        let usr_lng = usr.current_longitude;
       

        //grab the places this user is trying to avoid
        let user_avoidLocations = await getLocations_OfPlacesUserIsAvoiding(userId);
       //iterate through the places to avoid, and if user is to close, start the timer, if user is still there, increment visit count, and send sms
        for (let place of user_avoidLocations) {
            let lat = place.latitude;
            let lng = place.longitude;
            let dist_between_usrAndPlace = getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);
           
            //check if user is to close
            if (dist_between_usrAndPlace < dontGetCloserThanThis) {
                //this 👇 code (ie the setTimeout block) will need to change, not sure the timeout will work when you have multiple users logged in,
                // maybe deal with this using the tables, boolean or timer

                //wait timeUserIsAllowedToStayBeforeItCountsAsAVisit ie 1 min, 
                setTimeout(() => {

                    //recalculate distance between user and place
                    dist_between_usrAndPlace = getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);

                    //check if user is to still to close
                    if (dist_between_usrAndPlace < dontGetCloserThanThis) {

                        //increment visit count
                        incrementVisitCount(userId,place.id);

                        //send out a message
                        console.log(`user ${userId} you need to get the heck away from ${place.name}`);
                    }
                }, timeUserIsAllowedToStayBeforeItCountsAsAVisit); //wait 1 min


            }
            
        }
       

    }
    //msg();
});

//house keeping, should run 1 time per day, but for demo it will have to run, more often
cron.schedule('*/5 * * * *', () => {
    console.log('Server doing house keeping');
    resetVisitCount();



});







module.exports = { cron };


