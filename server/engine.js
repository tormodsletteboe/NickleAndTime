
// const axios = require('axios');
const pool = require('./modules/pool');
const cron = require('node-cron');
const msg = require('./send_sms');
const usersService = require('./services/users');
const distanceCalc = require('./services/distance.calc');


//engine
cron.schedule('*/60 * * * * *', async () => {
    let date = new Date();
    console.log(date.toLocaleTimeString());
    //console.log('running a task every 60 seconds');
    let usersLocation = await usersService.getUsersLocation();
    for (let usr of usersLocation) {
        let userId = usr.user_id;
        let usr_lat = usr.current_latitude;
        let usr_lng = usr.current_longitude;
        //console.log('user: ',userId);

        //grab locations the places this user is trying to avoid
        let user_avoidLocations = await usersService.getLocations_OfPlacesUserIsAvoiding(userId);
        // console.log(user_avoidLocations);
        for (let place of user_avoidLocations) {
            let lat = place.latitude;
            let lng = place.longitude;
            let distance = distanceCalc.getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);
            //console.log(`user ${userId} is ${distance} meters from ${place.name}`);
            if (distance < 100) {
                
                //this 👇 code will need to change, need to be async, let people move about, maybe deal with this using the tables, boolean or timer
                // let date2 = new Date();
                // console.log(date2.toLocaleTimeString());
                setTimeout(() => {
                    // let date3 = new Date();
                    // console.log(date3.toLocaleTimeString());
                    let distance2 = distanceCalc.getDistanceFromLatLonIn_meters(usr_lat, usr_lng, lat, lng);
                    if (distance2 < 100) {
                        //increment visit count and send out an sms
                        console.log(`user ${userId} you need to get the heck away from ${place.name}`);
                    }
                }, 6000); //wait 1 min


            }
            //console.log(distance);
        }
        // console.log(usr.current_latitude);
        // console.log(usr.current_longitude);

    }
    //console.log(users);

    //resetVisitCount();
    //msg();
});

//house keeping
cron.schedule('*/2 * * * *', () => {
    let date = new Date();
    console.log(date.toLocaleTimeString());
    console.log('running a task every 2 minutes');


});

async function resetVisitCount() {

    const sqlText = `
    UPDATE user_avoidplace
    SET visit_count = 0, next_reset_date = now()+ INTERVAL '7 days'
    WHERE next_reset_date < now()
    ;`;

    await pool.query(sqlText)
        .then((dBRes) => {

            console.log(`Server reset the visit count on ${dBRes.rowCount} rows`);
        })
        .catch((err) => {
            console.log('resetVisitCount failed: ', err);

        });

}

//TODO: not used need to get all the data first
async function incrementVisitCount(user_id, avoid_place_id) {
    const sqlText = `
        UPDATE user_avoidplace
        SET visit_count = visit_count + 1
        WHERE user_id = $1 AND avoid_place_id = $2
    ;`;
    const params = [user_id, avoid_place_id];
    pool.query(sqlText, params)
        .then((dBRes) => {
            //res.sendStatus(200);
            console.log(`Incremented User: ${user_id} at place: ${avoid_place_id}`);
        })
        .catch((err) => {
            console.log('PUT /incrementVisitCount failed: ', err);
            //res.sendStatus(500);
        });
}



module.exports = { cron };

// resetVisitCount();
