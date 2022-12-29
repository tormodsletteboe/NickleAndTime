const latestSMSReducer = (state = {}, action) => {
    switch (action.type) {
      case "SET_LATEST_SMS":
        return action.payload;
      default:
        return state;
    }
  };
  
  export default latestSMSReducer;