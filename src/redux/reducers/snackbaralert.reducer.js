const snackbarReducer = (state = false, action) => {
  switch (action.type) {
    case "SET_SNACKBAR_ALERT":
      return true;
    case "UNSET_SNACKBAR_ALERT":
      return false;
    default:
      return state;
  }
};

export default snackbarReducer;
