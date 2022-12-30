const latestSMSReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET_LATEST_SMS":
      return action.payload;
    case "UNSET_LATEST_SMS":
      return {};
    default:
      return state;
  }
};

export default latestSMSReducer;
