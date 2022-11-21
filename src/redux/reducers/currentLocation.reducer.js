const currentLocation = (state = {}, action) => {
    switch (action.type) {
      case 'SET_CURRENT_LOCATION':
        return action.payload;
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default currentLocation;
//   case 'UNSET_USER':
//         return {};