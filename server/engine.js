
const cron = require('node-cron');
const { sendMsg } = require('./send_sms');
const { getUserName, getUserPhoneNumber, getUsersLocation, getUser_Location, getLocations_OfPlacesUserIsAvoiding } = require('./services/users');
const { getDistanceFromLatLonIn_meters } = require('./services/distance.calc');
const { incrementVisitCount, resetVisitCount, get_VisitCountAndVisitLimit,getCurrentlyVisiting,setCurrentlyVisiting,getCurrentlyActive } = require('./services/user_avoidplace');
const { getSeverity } = require('./services/serverity.calc');
const { getMessage } = require('./services/messages');
const { sendRecordToTrigger_SMS_table } = require('./services/trigger_sms');
const dontGetCloserThanThis = 100; //100 meters
const timeUserIsAllowedToStayBeforeItCountsAsAVisit = 60000; // 1 min

//engine
cron.schedule('* * * * * *', async () => {

    //console.log('Heart beat ', new Date().toLocaleTimeString());
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

            
            if(dist_between_usrAndPlace>=dontGetCloserThanThis){
                setCurrentlyVisiting(userId,place.id,false)
            }
            let currentlyVisiting = await getCurrentlyVisiting(userId,place.id);
            // console.log('------------------');
            // console.log(`User: ${userId} is ${dist_between_usrAndPlace} meters from ${place.name} currently visiting: `,currentlyVisiting)
            // console.log('------------------');
            //check if user is to close
            if (dist_between_usrAndPlace < dontGetCloserThanThis && !currentlyVisiting) {
                //this 👇 code (ie the setTimeout block) will need to change, not sure the timeout will work when you have multiple users logged in,
                // maybe deal with this using the tables, boolean or timer
                setCurrentlyVisiting(userId,place.id,true);
                //wait timeUserIsAllowedToStayBeforeItCountsAsAVisit ie 1 min, 
                console.log('------------------');
                console.log(new Date().toLocaleTimeString(),`Starting a 1 min timer for ${userId} who is visiting ${place.name}`)
                console.log('------------------');
                setTimeout(async () => {
                    console.log('------------------');
                    console.log(new Date().toLocaleTimeString(),` Time is up for ${userId} and ${place.name}`);
                    console.log('------------------');
                    //get up to date user location
                    let userloc = await getUser_Location(userId);
                    usr_lat = userloc.current_latitude;
                    usr_lng = userloc.current_longitude;
                    
                    //recalculate distance between user and place
                    dist_between_usrAndPlace = getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);

                    //make sure the place is still active, can use the currently visiting method, if a place is inactive, currentlyvisiting is false
                    let stillActive = await getCurrentlyActive(userId,place.id);
                    


                    //check if user is to still to close and if they still want to avoid it, they might have deactivated the place very last second
                    if (dist_between_usrAndPlace < dontGetCloserThanThis && stillActive) {

                        //increment visit count
                        incrementVisitCount(userId, place.id);
                        //getVisitCount and VisitLimit -> calculate a severity rating -> get a message based on that rating
                        let result = await get_VisitCountAndVisitLimit(userId, place.id);
                        let visitCount = result.visit_count;
                        let visitLimit = result.visit_limit;
                        let severity = getSeverity(visitCount, visitLimit);

                        //get message to send out based on severity rating
                        let msgData = await getMessage(severity);
                        let msg = msgData.body;
                        let msgId = msgData.id;
                        let usrName = await getUserName(userId);
                        let usrPhoneNum = await getUserPhoneNumber(userId);
                        console.log(`${usrName} ${msg} ${place.name}`);
                        let totalmsg = `Nickle & Time: ${usrName} ${msg} ${place.name}`;

                        //send out the sms thorugh twilio
                        sendMsg(totalmsg, usrPhoneNum);

                        //add record to trigger_sms (ie, its like a history table)
                        sendRecordToTrigger_SMS_table(userId, place.id, msgId);
                    }
                    else{
                        //user moved away in time alotted
                        setCurrentlyVisiting(userId,place.id,false);
                        console.log('------------------');
                        console.log(new Date().toLocaleTimeString(),`  ${userId} moved way from ${place.name}`);
                        console.log('------------------');
                    }
                }, timeUserIsAllowedToStayBeforeItCountsAsAVisit); //wait 1 min
            }
        }
    }

});

//house keeping, should run 1 time per day, 
cron.schedule('59 23 * * *', () => {
    console.log('Server doing house keeping', new Date().toLocaleTimeString());
    console.log('Cheking if any visit counts need to be reset');
    resetVisitCount();
});

module.exports = { cron };


