const validationcodeReducer = (state = "", action) => {
  switch (action.type) {
    case "SMS_CODE_APPROVED":
      return "approved";
    case "SMS_CODE_NOT_APPROVED":
      return "";
    case "CLEAR_STATUS_SMSCODE":
      return "";
    default:
      return state;
  }
};

export default validationcodeReducer;
