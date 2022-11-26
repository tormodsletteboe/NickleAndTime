
const cron = require('node-cron');
const {sendMsg} = require('./send_sms');
const { getUserName,getUserPhoneNumber,getUsersLocation, getLocations_OfPlacesUserIsAvoiding } = require('./services/users');
const { getDistanceFromLatLonIn_meters } = require('./services/distance.calc');
const { incrementVisitCount, resetVisitCount, get_VisitCountAndVisitLimit } = require('./services/user_avoidplace');
const {getSeverity} = require('./services/serverity.calc');
const {getMessage}= require('./services/messages');
const {sendRecordToTrigger_SMS_table} = require('./services/trigger_sms');
const dontGetCloserThanThis = 100; //100 meters
const timeUserIsAllowedToStayBeforeItCountsAsAVisit = 60000; // 1 min

//engine
cron.schedule('*/59 * * * * *', async () => {

    console.log('Heart beat ',new Date().toLocaleTimeString());
    //get the current location of several users, TODO: this can be improved by only getting actively loggin in users.
    let usersLocation = await getUsersLocation();

    //itereate through those users current locations, calc distance to places they are avoiding, if within 100 m, start time, if still there
    //increment visit count and send out sms based on visit_count and visit_limit
    for (let usr of usersLocation) {
        let userId = usr.user_id;
        let usr_lat = usr.current_latitude;
        let usr_lng = usr.current_longitude;


        //grab the places this user is trying to avoid and which are active
        let user_avoidLocations = await getLocations_OfPlacesUserIsAvoiding(userId);
        //iterate through the places to avoid, and if user is to close, start the timer, if user is still there, increment visit count, and send sms
        for (let place of user_avoidLocations) {
            let lat = place.latitude;
            let lng = place.longitude;
            let dist_between_usrAndPlace = getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);

            console.log(`User: ${userId} is ${dist_between_usrAndPlace} meters from ${place.name}`)
            //check if user is to close
            if (dist_between_usrAndPlace < dontGetCloserThanThis) {
                //this 👇 code (ie the setTimeout block) will need to change, not sure the timeout will work when you have multiple users logged in,
                // maybe deal with this using the tables, boolean or timer

                //wait timeUserIsAllowedToStayBeforeItCountsAsAVisit ie 1 min, 
                setTimeout(async () => {

                    //recalculate distance between user and place
                    dist_between_usrAndPlace = getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);

                    //check if user is to still to close
                    if (dist_between_usrAndPlace < dontGetCloserThanThis) {

                        //increment visit count
                        incrementVisitCount(userId, place.id);
                        //getVisitCount and VisitLimit -> calculate a severity rating -> get a message based on that rating
                        let result = await get_VisitCountAndVisitLimit(userId, place.id);
                        let visitCount = result.visit_count;
                        let visitLimit = result.visit_limit;
                        let severity = getSeverity(visitCount,visitLimit);
                        
                        //get message to send out based on severity rating
                        let msgData = await getMessage(severity);
                        let msg = msgData.body;
                        let msgId = msgData.id;
                        let usrName = await getUserName(userId);
                        let usrPhoneNum = await getUserPhoneNumber(userId);
                        console.log(`${usrName} ${msg} ${place.name}`);
                        let totalmsg = `${usrName} ${msg} ${place.name}`;
                       
                        //TODO: turn this on
                        //sendMsg(totalmsg,usrPhoneNum);

                        //add record to trigger_sms (ie, its like a history table)
                        sendRecordToTrigger_SMS_table(userId,place.id,msgId);
                    }
                }, timeUserIsAllowedToStayBeforeItCountsAsAVisit); //wait 1 min
            }
        }
    }
   
});

//house keeping, should run 1 time per day, but for demo it will have to run, more often
cron.schedule('* * * * *', () => {
    console.log('Server doing house keeping',new Date().toLocaleTimeString());
    console.log('Cheking if any visit counts need to be reset');
    resetVisitCount();
});

module.exports = { cron };


