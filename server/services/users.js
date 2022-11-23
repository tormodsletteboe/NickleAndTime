const pool = require('../modules/pool');

//get all users
async function getUsers() {
    try {
        let dbRes = await pool.query(`SELECT * FROM "user";`);
        //console.log('dbRes',dbRes);
        return dbRes.rows;
    } 
    catch (error) {
        console.error('getUsers failed',error);
    }

}

//get the current location of several users
async function getUsersLocation(){
    try {
        let dbRes = await pool.query(`SELECT * FROM "user_location";`);
        //console.log('dbRes',dbRes);
        return dbRes.rows;
    } 
    catch (error) {
        console.error('getUsersLocations failed',error);
    }
}

//find places that this user is avoiding
async function getLocations_OfPlacesUserIsAvoiding(user_id){
    try {
        const sqlText = `
        SELECT 
            avoid_place.latitude,
            avoid_place.longitude,
            avoid_place.name,
            avoid_place.id
        FROM "user_avoidplace"
        LEFT JOIN avoid_place ON avoid_place.id = user_avoidplace.avoid_place_id
        WHERE user_avoidplace.user_id = $1
        ;`;
        const params = [user_id];
        let dbRes = await pool.query(sqlText,params);
        //console.log('dbRes',dbRes);
        return dbRes.rows;
    } 
    catch (error) {
        console.error('getLocations_OfPlacesUserIsAvoiding failed',error);
    }
}
module.exports = { 
    getUsers,
    getUsersLocation,
    getLocations_OfPlacesUserIsAvoiding,
 };