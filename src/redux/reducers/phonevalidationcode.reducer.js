const validationcodeReducer = (state = '', action) => {
    switch (action.type) {
      case 'SET_VALIDATION_CODE':
        return action.payload;
      default:
        return state;
    }
  };

  export default validationcodeReducer;