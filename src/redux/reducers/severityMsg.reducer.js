const severityMsgReducer = (state = {}, action) => {
    switch (action.type) {
      case 'SET_SEVERITY_MSG':
        return action.payload;
      default:
        return state;
    }
  };
  export default severityMsgReducer;