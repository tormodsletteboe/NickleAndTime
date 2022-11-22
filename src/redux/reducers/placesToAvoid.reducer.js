const placesToAvoidReducer = (state = [], action) => {
    switch (action.type) {
      case 'SET_PLACES_TO_AVOID':
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default placesToAvoidReducer;
