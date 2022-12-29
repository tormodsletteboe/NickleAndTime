
const switchReducer = (state = false, action) => {
    switch (action.type) {
      case "SET_SWITCH_STATE":
        return action.payload;
      default:
        return state;
    }
  };
  
  export default switchReducer;