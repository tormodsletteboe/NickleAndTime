const mapReducer = (state = {}, action) => {
    switch (action.type) {
      case 'SET_MAP':
        return action.payload;
      case 'UNSET_MAP':
        return {};
      default:
        return state;
    }
  };
  
  // user will be on the redux state at:
  // state.user
  export default mapReducer;