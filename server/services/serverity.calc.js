 //calculate severity
 function getSeverity2(visitCount,visitLimit){
    let severity = -1;
    //serverity is 3 if visitlimit is 0, ie users should not go there ever
    if (visitLimit == 0) {
      severity = 3;
    }
    else {
      severity = visitCount / visitLimit;
      //if less than 0.5, ie user have visited the place less than half the times allowed
      if (severity < 0.5) {
        severity = 1;
      }
      //if greater than 0.5 or less than equal to 1, ie user have visited the place more than half the times allowed, or as many times as allowed
      else if (severity >= 0.5 && severity <= 1.0) {
        severity = 2;
      }
      //users should not be going there, send out more aggresive message
      else {
        severity = 3;
      }
    }
   
    return severity;
 }
 function getSeverity(visitCount,visitLimit){
  let visitsLeft = 0;
  let severity=1;
  //serverity is 3 if visitlimit is 0, ie users should not go there ever
  if (visitLimit == 0) {
    severity = 3;
  }
  else {
    visitsLeft = Math.round(visitLimit-visitCount);
    //if less than 0.5, ie user have visited the place less than half the times allowed
    if (visitsLeft > 1) {
      severity = 1;
    }
    //if greater than 0.5 or less than equal to 1, ie user have visited the place more than half the times allowed, or as many times as allowed
    else if (visitsLeft==1) {
      severity = 2;
    }
    //users should not be going there, send out more aggresive message
    else {
      severity = 3;
    }
  }
 
  return severity;
}
 module.exports = {
    getSeverity,
 }